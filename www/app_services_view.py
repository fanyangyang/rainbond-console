# -*- coding: utf8 -*-
import logging
import json

from django.views.decorators.cache import never_cache
from django.template.response import TemplateResponse
from django.http.response import HttpResponse
from django.http import JsonResponse
from www.views import BaseView, AuthedView, LeftSideBarMixin, CopyPortAndEnvMixin
from www.decorator import perm_required
from www.models import Users, ServiceInfo, TenantRegionInfo, TenantServiceInfo, TenantServiceRelation, TenantServiceEnv, TenantServiceAuth
from service_http import RegionServiceApi
from www.tenantservice.baseservice import BaseTenantService, TenantUsedResource, TenantAccountService, CodeRepositoriesService
from www.utils.language import is_redirect
from www.monitorservice.monitorhook import MonitorHook
from www.utils.crypt import make_uuid
from django.conf import settings

logger = logging.getLogger('default')

regionClient = RegionServiceApi()
monitorhook = MonitorHook()
tenantAccountService = TenantAccountService()
tenantUsedResource = TenantUsedResource()
baseService = BaseTenantService()
codeRepositoriesService = CodeRepositoriesService()


class AppCreateView(LeftSideBarMixin, AuthedView):

    def get_media(self):
        media = super(AuthedView, self).get_media() + self.vendor(
            'www/css/goodrainstyle.css', 'www/css/style.css', 'www/css/style-responsive.css', 'www/js/jquery.cookie.js',
            'www/js/common-scripts.js', 'www/js/jquery.dcjqaccordion.2.7.js', 'www/js/jquery.scrollTo.min.js',
            'www/js/respond.min.js',)
        if settings.MODULES["Git_Code_Manual"]:
            media = media + self.vendor("www/js/app-create-manual.js")
        else:
            media = media + self.vendor("www/js/app-create.js")
        return media

    @never_cache
    @perm_required('create_service')
    def get(self, request, *args, **kwargs):
        context = self.get_context()
        if settings.MODULES["Git_Code_Manual"]:
            response = TemplateResponse(self.request, "www/app_create_manual_code_step_1.html", context)
        else:
            response = TemplateResponse(self.request, "www/app_create_step_1.html", context)
        try:
            context["tenantName"] = self.tenantName
            context["createApp"] = "active"
            request.session["app_tenant"] = self.tenantName
            app_status = request.COOKIES.get('app_status', '')
            app_an = request.COOKIES.get('app_an', '')
            context["app_status"] = app_status
            context["app_an"] = app_an
            response.delete_cookie('app_status')
            response.delete_cookie('app_an')
        except Exception as e:
            logger.exception(e)
        return response

    @never_cache
    @perm_required('create_service')
    def post(self, request, *args, **kwargs):

        service_alias = ""
        service_code_from = ""
        tenant_id = self.tenant.tenant_id
        service_id = make_uuid(tenant_id)
        data = {}
        try:
            if tenantAccountService.isOwnedMoney(self.tenant, self.response_region):
                data["status"] = "owed"
                return JsonResponse(data, status=200)

            service_desc = ""
            service_alias = request.POST.get("create_app_name", "")
            service_code_from = request.POST.get("service_code_from", "")
            if service_code_from is None or service_code_from == "":
                data["status"] = "code_from"
                return JsonResponse(data, status=200)
            if service_alias is None or service_alias == "":
                data["status"] = "empty"
                return JsonResponse(data, status=200)
            service_alias = service_alias.lower()
            # get base service
            service = ServiceInfo.objects.get(service_key="application")
            # create console tenant service
            num = TenantServiceInfo.objects.filter(tenant_id=tenant_id, service_alias=service_alias).count()
            if num > 0:
                data["status"] = "exist"
                return JsonResponse(data, status=200)

            # calculate resource
            tempService = TenantServiceInfo()
            tempService.min_memory = service.min_memory
            tempService.service_region = self.response_region
            tempService.min_node = service.min_node
            diffMemory = service.min_node * service.min_memory
            rt_type, flag = tenantUsedResource.predict_next_memory(self.tenant, tempService, diffMemory, False)
            if not flag:
                if rt_type == "memory":
                    data["status"] = "over_memory"
                else:
                    data["status"] = "over_money"
                return JsonResponse(data, status=200)

            # create console service
            service.desc = service_desc
            newTenantService = baseService.create_service(
                service_id, tenant_id, service_alias, service, self.user.pk, region=self.response_region)
            monitorhook.serviceMonitor(self.user.nick_name, newTenantService, 'create_service', True)
            baseService.addServicePort(newTenantService, False, container_port=5000, protocol='http', port_alias='', is_inner_service=False, is_outer_service=True)

            # code repos
            if service_code_from == "gitlab_new":
                codeRepositoriesService.initRepositories(self.tenant, self.user, newTenantService, service_code_from, "", "", "")
            elif service_code_from == "gitlab_exit":
                code_clone_url = request.POST.get("service_code_clone_url", "")
                code_id = request.POST.get("service_code_id", "")
                code_version = request.POST.get("service_code_version", "master")
                if code_id == "" or code_clone_url == "" or code_version == "":
                    data["status"] = "code_repos"
                    TenantServiceInfo.objects.get(service_id=service_id).delete()
                    return JsonResponse(data, status=200)
                codeRepositoriesService.initRepositories(self.tenant, self.user, newTenantService, service_code_from, code_clone_url, code_id, code_version)
                
            elif service_code_from == "github":
                code_id = request.POST.get("service_code_id", "")
                code_clone_url = request.POST.get("service_code_clone_url", "")
                code_version = request.POST.get("service_code_version", "master")
                if code_id == "" or code_clone_url == "" or code_version == "":
                    data["status"] = "code_repos"
                    TenantServiceInfo.objects.get(service_id=service_id).delete()
                    return JsonResponse(data, status=200)
                codeRepositoriesService.initRepositories(self.tenant, self.user, newTenantService, service_code_from, code_clone_url, code_id, code_version)

            # create region tenantservice
            baseService.create_region_service(newTenantService, self.tenantName, self.response_region, self.user.nick_name)
            monitorhook.serviceMonitor(self.user.nick_name, newTenantService, 'init_region_service', True)
            # create service env
            # baseService.create_service_env(tenant_id, service_id, self.response_region)
            # record log
            data["status"] = "success"
            data["service_alias"] = service_alias
            data["service_id"] = service_id
        except Exception as e:
            logger.exception(e)
            tempTenantService = TenantServiceInfo.objects.get(service_id=service_id)
            codeRepositoriesService.deleteProject(tempTenantService)
            TenantServiceInfo.objects.filter(service_id=service_id).delete()
            TenantServiceAuth.objects.filter(service_id=service_id).delete()
            TenantServiceRelation.objects.filter(service_id=service_id).delete()
            monitorhook.serviceMonitor(self.user.nick_name, tempTenantService, 'create_service_error', False)
            data["status"] = "failure"
        return JsonResponse(data, status=200)


class AppDependencyCodeView(LeftSideBarMixin, AuthedView, CopyPortAndEnvMixin):

    def get_media(self):
        media = super(AuthedView, self).get_media() + self.vendor(
            'www/css/goodrainstyle.css', 'www/css/style.css', 'www/css/style-responsive.css', 'www/js/jquery.cookie.js',
            'www/js/common-scripts.js', 'www/js/jquery.dcjqaccordion.2.7.js', 'www/js/jquery.scrollTo.min.js',
            'www/js/respond.min.js', 'www/js/app-dependency.js')
        return media

    @never_cache
    @perm_required('create_service')
    def get(self, request, *args, **kwargs):
        try:
            context = self.get_context()
            context["myAppStatus"] = "active"
            context["tenantName"] = self.tenantName
            context["tenantService"] = self.service

            cacheServiceList = ServiceInfo.objects.filter(status="published")
            context["cacheServiceList"] = cacheServiceList

            tenant_id = self.tenant.tenant_id
            deployTenantServices = TenantServiceInfo.objects.filter(
                tenant_id=tenant_id, service_region=self.response_region).exclude(category='application')
            context["deployTenantServices"] = deployTenantServices
        except Exception as e:
            logger.exception(e)
        return TemplateResponse(self.request, "www/app_create_step_2_dependency.html", context)

    @never_cache
    @perm_required('create_service')
    def post(self, request, *args, **kwargs):
        data = {}
        try:
            tenant_id = self.tenant.tenant_id
            service_alias = self.service.service_alias
            service_id = self.service.service_id
            # create service dependency
            createService = request.POST.get("createService", "")
            logger.debug(createService)
            if createService is not None and createService != "":
                serviceKeys = createService.split(",")
                # resource check
                diffMemory = self.service.min_memory + len(serviceKeys) * 128
                rt_type, flag = tenantUsedResource.predict_next_memory(self.tenant, self.service, diffMemory, False)
                if not flag:
                    if rt_type == "memory":
                        data["status"] = "over_memory"
                    else:
                        data["status"] = "over_money"
                    return JsonResponse(data, status=200)

                # create service
                for skey in serviceKeys:
                    try:
                        service_key, app_version = skey.split(':', 1)
                        dep_service = ServiceInfo.objects.get(service_key=service_key, version=app_version)
                        dep_service_id = make_uuid(service_key)
                        depTenantService = baseService.create_service(
                            dep_service_id, tenant_id, dep_service.service_name.lower() + "_" + service_alias, dep_service, self.user.pk, region=self.response_region)
                        monitorhook.serviceMonitor(self.user.nick_name, depTenantService, 'create_service', True)
                        self.copy_port_and_env(dep_service, depTenantService)
                        baseService.create_region_service(depTenantService, self.tenantName, self.response_region, self.user.nick_name)
                        monitorhook.serviceMonitor(self.user.nick_name, depTenantService, 'init_region_service', True)
                        # baseService.create_service_env(tenant_id, dep_service_id, self.response_region)
                        baseService.create_service_dependency(tenant_id, service_id, dep_service_id, self.response_region)
                    except Exception as e:
                        logger.exception(e)
            # exist service dependency.
            hasService = request.POST.get("hasService", "")
            logger.debug(hasService)
            if hasService is not None and hasService != "":
                serviceIds = hasService.split(",")
                for sid in serviceIds:
                    try:
                        baseService.create_service_dependency(tenant_id, service_id, sid, self.response_region)
                    except Exception as e:
                        logger.exception(e)
            data["status"] = "success"
        except Exception as e:
            logger.exception(e)
            data["status"] = "failure"
        return JsonResponse(data, status=200)


class AppWaitingCodeView(LeftSideBarMixin, AuthedView):

    def get_media(self):
        media = super(AuthedView, self).get_media() + self.vendor(
            'www/css/goodrainstyle.css', 'www/css/style.css', 'www/css/style-responsive.css', 'www/js/jquery.cookie.js',
            'www/js/common-scripts.js', 'www/js/jquery.dcjqaccordion.2.7.js', 'www/js/jquery.scrollTo.min.js',
            'www/js/respond.min.js', 'www/js/app-waiting.js')
        return media

    @never_cache
    @perm_required('create_service')
    def get(self, request, *args, **kwargs):
        try:
            context = self.get_context()
            context["myAppStatus"] = "active"
            context["tenantName"] = self.tenantName
            context["tenantService"] = self.service
            
            context["httpGitUrl"] = codeRepositoriesService.showGitUrl(self.service)

            tenantServiceRelations = TenantServiceRelation.objects.filter(
                tenant_id=self.tenant.tenant_id, service_id=self.service.service_id)
            if len(tenantServiceRelations) > 0:
                dpsids = []
                for tsr in tenantServiceRelations:
                    dpsids.append(tsr.dep_service_id)
                deployTenantServices = TenantServiceInfo.objects.filter(service_id__in=dpsids)
                context["deployTenantServices"] = deployTenantServices
                authList = TenantServiceAuth.objects.filter(service_id__in=dpsids)
                if len(authList) > 0:
                    authMap = {}
                    for auth in authList:
                        authMap[auth.service_id] = auth
                    context["authMap"] = authMap
        except Exception as e:
            logger.exception(e)
        return TemplateResponse(self.request, "www/app_create_step_3_waiting.html", context)


class AppLanguageCodeView(LeftSideBarMixin, AuthedView):

    def get_media(self):
        media = super(AuthedView, self).get_media() + self.vendor(
            'www/css/goodrainstyle.css', 'www/css/style.css', 'www/css/style-responsive.css', 'www/js/jquery.cookie.js',
            'www/js/common-scripts.js', 'www/js/jquery.dcjqaccordion.2.7.js', 'www/js/jquery.scrollTo.min.js',
            'www/js/respond.min.js', 'www/js/app-language.js')
        return media

    @never_cache
    @perm_required('create_service')
    def get(self, request, *args, **kwargs):
        language = "none"
        try:
            if self.service.language == "" or self.service.language is None:
                return self.redirect_to('/apps/{0}/{1}/app-waiting/'.format(self.tenant.tenant_name, self.service.service_alias))

            tenantServiceEnv = TenantServiceEnv.objects.get(service_id=self.service.service_id)
            if tenantServiceEnv.user_dependency is not None and tenantServiceEnv.user_dependency != "":
                return self.redirect_to('/apps/{0}/{1}/detail/'.format(self.tenant.tenant_name, self.service.service_alias))

            context = self.get_context()
            context["myAppStatus"] = "active"
            context["tenantName"] = self.tenantName
            context["tenantService"] = self.service
            language = self.service.language
            data = json.loads(tenantServiceEnv.check_dependency)
            context["dependencyData"] = data
            redirectme = is_redirect(self.service.language, data)
            context["redirectme"] = redirectme
            if redirectme:
                language = "default"
        except Exception as e:
            logger.exception(e)
        if self.service.language == 'docker':
            self.service.cmd = ''
            self.service.save()
            regionClient.update_service(self.response_region, self.service.service_id, {"cmd": ""})
            return TemplateResponse(self.request, "www/app_create_step_4_default.html", context)
        return TemplateResponse(self.request, "www/app_create_step_4_" + language.replace(".", "").lower() + ".html", context)

    @never_cache
    @perm_required('create_service')
    def post(self, request, *args, **kwargs):
        data = {}
        try:
            service_version = request.POST.get("service_version", "")
            service_server = request.POST.get("service_server", "")
            service_dependency = request.POST.get("service_dependency", "")
            logger.debug(service_dependency)
            checkJson = {}
            checkJson["language"] = self.service.language
            if service_version != "":
                checkJson["runtimes"] = service_version
            else:
                checkJson["runtimes"] = ""
            if service_server != "":
                checkJson["procfile"] = service_server
            else:
                checkJson["procfile"] = ""
            if service_dependency != "":
                dps = service_dependency.split(",")
                d = {}
                for dp in dps:
                    if dp is not None and dp != "":
                        d["ext-" + dp] = "*"
                checkJson["dependencies"] = d
            else:
                checkJson["dependencies"] = {}

            tenantServiceEnv = TenantServiceEnv.objects.get(service_id=self.service.service_id)
            tenantServiceEnv.user_dependency = json.dumps(checkJson)
            tenantServiceEnv.save()
            data["status"] = "success"
        except Exception as e:
            logger.exception(e)
            data["status"] = "failure"
        return JsonResponse(data, status=200)


class GitLabWebHook(BaseView):

    @never_cache
    def post(self, request, *args, **kwargs):
        result = {}
        try:
            payload = request.body
            payloadJson = json.loads(payload)
            project_id = payloadJson["project_id"]
            repositoryJson = payloadJson["repository"]
            name = repositoryJson["name"]
            git_url = repositoryJson["git_http_url"]
            logger.debug(str(project_id) + "==" + name + "==" + git_url)
            listTs = TenantServiceInfo.objects.filter(git_project_id=project_id).exclude(code_from="github")
            for ts in listTs:
                codeRepositoriesService.codeCheck(ts)
            result["status"] = "success"
        except Exception as e:
            logger.exception(e)
            result["status"] = "failure"
        return HttpResponse(json.dumps(result))


class GitHubWebHook(BaseView):

    @never_cache
    def post(self, request, *args, **kwargs):
        result = {}
        try:
            # event = request.META['HTTP_X_GITHUB_EVENT']
            # logger.debug(event)
            payload = request.body
            payloadJson = json.loads(payload)
            repositoryJson = payloadJson["repository"]
            fullname = repositoryJson["full_name"]
            git_url = repositoryJson["clone_url"]
            project_id = repositoryJson["id"]
            logger.debug(str(project_id) + "==" + fullname + "==" + git_url)
            listTs = TenantServiceInfo.objects.filter(git_project_id=project_id, code_from="github")
            for ts in listTs:
                codeRepositoriesService.codeCheck(ts)
            result["status"] = "success"
        except Exception as e:
            logger.exception(e)
            result["status"] = "failure"
        return HttpResponse(json.dumps(result))


class GitCheckCode(BaseView):

    @never_cache
    def get(self, request, *args, **kwargs):
        data = {}
        try:
            service_id = request.GET.get("service_id", "")
            logger.debug("git code request: " + service_id)
            if service_id is not None and service_id != "":
                tse = TenantServiceEnv.objects.get(service_id=service_id)
                result = tse.user_dependency
                if result is not None and result != "":
                    data = json.loads(result)
        except Exception as e:
            logger.exception(e)
        return JsonResponse(data, status=200)

    @never_cache
    def post(self, request, *args, **kwargs):
        result = {}
        try:
            service_id = request.POST.get("service_id", "")
            dependency = request.POST.get("condition", "")
            logger.debug(service_id + "=" + dependency)
            if service_id is not None and service_id != "" and dependency != "":
                dps = json.loads(dependency)
                language = dps["language"]
                if language is not None and language != "" and language != "no":
                    try:
                        tse = TenantServiceEnv.objects.get(service_id=service_id)
                        tse.language = language
                        tse.check_dependency = dependency
                        tse.save()
                    except Exception:
                        tse = TenantServiceEnv(service_id=service_id, language=language, check_dependency=dependency)
                        tse.save()
                    service = TenantServiceInfo.objects.get(service_id=service_id)
                    if language != "false":
                        if language.find("Java") > -1 and service.min_memory < 512:
                            service.min_memory = 512
                            data = {}
                            data["language"] = "java"
                            regionClient.changeMemory(service.service_region, service_id, json.dumps(data))
                        service.language = language
                        service.save()
            result["status"] = "success"
        except Exception as e:
            logger.exception(e)
            result["status"] = "failure"
        return HttpResponse(json.dumps(result))
