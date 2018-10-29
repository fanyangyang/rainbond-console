# -*- coding: utf8 -*-
import logging
import json

from rest_framework.response import Response
from backends.services.exceptions import *
from backends.services.resultservice import *
from backends.services.tenantservice import tenant_service
from backends.services.userservice import user_service
from backends.services.regionservice import region_service
from console.services.team_services import team_services as console_team_service
from base import BaseAPIView
from goodrain_web.tools import JuncheePaginator
from www.models import Tenants, PermRelTenant
from console.services.enterprise_services import enterprise_services
from console.services.user_services import user_services as console_user_service
from console.services.perm_services import perm_services as console_perm_service
from console.services.region_services import region_services as console_region_service
from django.db import transaction
from console.services.team_services import team_services
from console.repositories.app import service_repo
from www.services import app_group_svc
from backends.services.httpclient import HttpInvokeApi



logger = logging.getLogger("default")
http_client = HttpInvokeApi()


class AllTeamView(BaseAPIView):
    def get(self, request, *args, **kwargs):
        """
        获取团队信息
        ---
        parameters:
            - name: page_num
              description: 页码
              required: false
              type: string
              paramType: query
            - name: page_size
              description: 每页数量
              required: false
              type: string
              paramType: query
            - name: enterprise_alias
              description: 企业别名
              required: false
              type: string
              paramType: query
            - name: tenant_alias
              description: 团队别名
              required: false
              type: string
              paramType: query
            - name: tenant_name
              description: 团队名称
              required: false
              type: string
              paramType: query

        """
        try:
            page = request.GET.get("page_num", 1)
            page_size = request.GET.get("page_size", 20)
            enterprise_alias = request.GET.get("enterprise_alias", None)
            tenant_alias = request.GET.get("tenant_alias", None)
            tenant_name = request.GET.get("tenant_name", None)
            enterprise_id = None
            if enterprise_alias:
                enter = enterprise_services.get_enterprise_by_enterprise_alias(enterprise_alias)
                if not enter:
                    return Response(
                        generate_result("0404", "enterprise is not found", "企业{0}不存在".format(enterprise_alias)))
                enterprise_id = enter.enterprise_id

            if tenant_alias:
                team = console_team_service.get_team_by_team_alias(tenant_alias)
                if not team:
                    return Response(
                        generate_result("0404", "team is not found", "团队别名{0}不存在".format(tenant_alias)))

            if tenant_name:
                team = console_team_service.get_tenant_by_tenant_name(tenant_name)
                if not team:
                    return Response(
                        generate_result("0404", "team is not found", "团队名称{0}不存在".format(tenant_name)))

            tenant_list = tenant_service.get_team_by_name_or_alias_or_enter(tenant_name, tenant_alias, enterprise_id)
            tenant_paginator = JuncheePaginator(tenant_list, int(page_size))
            tenants = tenant_paginator.page(int(page))

            tenants_num = Tenants.objects.count()
            # 需要license控制，现在没有，默认为一百万
            allow_num = 1000000
            list = []
            for tenant in tenants:
                tenant_dict = {}
                tenant_limit_memory_list = []
                region_list = console_region_service.get_region_list_by_team_name(request, tenant.tenant_name)
                total_services = 0
                run_app = 0
                for region in region_list:
                    region_tenant_limit_memory = {}
                    res, body = http_client.get_tenant_limit_memory(region, tenant_name)
                    if int(res.status) >= 400:
                        region_tenant_limit_memory["message"] = "{0}数据中心查询失败".format(region.region_name)
                    region_tenant_limit_memory[region.region_name] = body["bean"]
                    tenant_limit_memory_list.append(region_tenant_limit_memory)
                    service_ids = service_repo.get_tenant_services(tenant.tenant_id)
                    if service_ids:
                        res, body = http_client.get_tenant_service_status(region, tenant_name, json.dumps(service_ids))
                        total_region_services = len(body["list"])
                        run_region_app = 0
                        for app_status in body["list"]:
                            status = app_status.get("status")
                            if status == "running":
                                run_region_app += 1
                        total_services += total_region_services
                        run_app += run_region_app
                tenant_dict["total_services"] = total_services
                tenant_dict["run_apps"] = run_app
                tenant_dict["tenant_memory"] = tenant_limit_memory_list
                user = user_service.get_user_by_user_id(tenant.creater)
                tenant_dict["creater"] = user.nick_name
                user_list = tenant_service.get_tenant_users(tenant.tenant_name)
                tenant_dict["user_num"] = len(user_list)
                tenant_dict["tenant_alias"] = tenant.tenant_alias
                tenant_dict["tenant_alias"] = tenant.tenant_alias

                list.append(tenant_dict)
            bean = {"total_tenant_num": allow_num, "cur_tenant_num": tenants_num}

            result = generate_result(
                "0000", "success", "查询成功", bean=bean, list=list, total=tenant_paginator.count
            )
        except Exception as e:
            logger.exception(e)
            result = generate_error_result()
        return Response(result)

    @transaction.atomic
    def post(self, request, *args, **kwargs):
        """
        添加团队
        ---
        parameters:
            - name: tenant_name
              description: 团队名
              required: true
              type: string
              paramType: form
            - name: enterprise_id
              description: 企业ID
              required: true
              type: string
              paramType: form
            - name: useable_regions
              description: 可用数据中心 ali-sh,ali-hz
              required: false
              type: string
              paramType: form
        """
        sid = None
        try:
            tenant_name = request.data.get("tenant_name", None)
            if not tenant_name:
                return Response(generate_result("1003", "team name is none", "团对名称不能为空"))
            enterprise_id = request.data.get("enterprise_id", None)
            if not enterprise_id:
                return Response(generate_result("1003", "enterprise id is none", "企业ID不能为空"))
            enter = enterprise_services.get_enterprise_by_enterprise_id(enterprise_id)
            if not enter:
                return Response(generate_result("0404", "enterprise not found", "企业在云帮不存在"))

            team = console_team_service.get_team_by_team_alias_and_eid(tenant_name, enterprise_id)
            if team:
                return Response(generate_result("0409", "team alias is exist", "团队别名{0}在该企业已存在".format(tenant_name)))

            user = console_user_service.get_enterprise_first_user(enter.enterprise_id)
            if not user:
                return Response(generate_result("0412", "enterprise has no user", "企业下不存在任何用户"))

            useable_regions = request.data.get("useable_regions", "")
            logger.debug("team name {0}, usable regions {1}".format(tenant_name, useable_regions))
            regions = []
            if useable_regions:
                regions = useable_regions.split(",")
            # 开启保存点
            sid = transaction.savepoint()
            code, msg, team = console_team_service.create_team(user, enter, regions, tenant_name)
            # 创建用户在团队的权限
            perm_info = {
                "user_id": user.user_id,
                "tenant_id": team.ID,
                "identity": "owner",
                "enterprise_id": enter.pk
            }
            console_perm_service.add_user_tenant_perm(perm_info)

            for r in regions:
                code, msg, tenant_region = console_region_service.create_tenant_on_region(team.tenant_name, r)
                if code != 200:
                    logger.error(msg)
                    if sid:
                        transaction.savepoint_rollback(sid)
                    return Response(generate_result("0500", "add team error", msg), status=code)

            transaction.savepoint_commit(sid)

            bean = {"tenant_name": team.tenant_name, "tenant_id": team.tenant_id, "tenant_alias": team.tenant_alias,
                    "user_num": 1}
            result = generate_result("0000", "success", "租户添加成功", bean=bean)
        except TenantOverFlowError as e:
            result = generate_result("7001", "tenant over flow", "{}".format(e.message))
        except TenantExistError as e:
            result = generate_result("7002", "tenant exist", "{}".format(e.message))
        except NoEnableRegionError as e:
            result = generate_result("7003", "no enable region", "{}".format(e.message))
        except Exception as e:
            logger.exception(e)
            if sid:
                transaction.savepoint_rollback(sid)
            result = generate_error_result()
        return Response(result)

    def delete(self, request, *args, **kwargs):
        """
        删除团队
        ---
        parameters:
            - name: team_name
              description: 要删除的团队
              required: true
              type: string
              paramType: path
        """
        tenant_name = request.data.get("tenant_name", None)
        if not tenant_name:
            return Response(generate_result("1003", "team name is none", "参数缺失"))

        try:
            service_count = team_services.get_team_service_count_by_team_name(team_name=tenant_name)
            if service_count >= 1:
                result = generate_result("0404", "failed", "当前团队内有应用,不可以删除")
                return Response(result)
            status = team_services.delete_tenant(tenant_name=tenant_name)
            if not status:
                result = generate_result("0000", "success", "删除团队成功")
            else:
                result = generate_result("1002", "delete a tenant failed", "删除团队失败")
        except Tenants.DoesNotExist as e:
            logger.exception(e)
            result = generate_result("1004", "tenant not exist", "{}团队不存在".format(tenant_name))
        except Exception as e:
            result = generate_result("9999", "sys exception", "系统异常")
            logger.exception(e)
        return Response(result)


class TeamView(BaseAPIView):
    def get(self, request, tenant_name, *args, **kwargs):
        """
        获取某指定团队信息
        ---
        parameters:
            - name: tenant_name
              description: 团队名称
              required: true
              type: string
              paramType: path

        """
        try:
            tenant = tenant_service.get_tenant(tenant_name)
            create_id = tenant.creater
            user = user_service.get_user_by_user_id(create_id)
            user_list = tenant_service.get_users_by_tenantID(tenant.ID)
            user_num = len(user_list)
            rt_list = [{"tenant_id": tenant.tenant_id, "tenant_name": tenant.tenant_name, "user_num": user_num,
                        "tenant_alias":tenant.tenant_alias, "creater": user.nick_name}]
            result = generate_result("0000", "success", "查询成功", list=rt_list)
        except Tenants.DoesNotExist as e:
            logger.exception(e)
            result = generate_result("1001", "tenant not exist", "租户{}不存在".format(tenant_name))
        except Exception as e:
            logger.exception(e)
            result = generate_result("9999", "system error", "系统异常")
        return Response(result)


class TeamUserView(BaseAPIView):
    def get(self, request, tenant_name, user_name, *args, **kwargs):
        """
        查询某团队下的某个用户
        ---
        parameters:
            - name: tenant_name
              description: 团队名
              required: true
              type: string
              paramType: path
            - name: user_name
              description: 用户名
              required: true
              type: string
              paramType: path
        """
        try:
            user = user_service.get_user_by_username(user_name)
            tenant = tenant_service.get_tenant(tenant_name)
            perm_tenants = PermRelTenant.objects.filter(tenant_id=tenant.ID, user_id=user.pk)
            if not perm_tenants:
                result = generate_result("1010", "tenant user not exist",
                                         "租户{0}下不存在用户{1}".format(tenant_name, user_name))
            else:
                code = "0000"
                msg = "success"
                list = []
                res = {"tenant_id": tenant.tenant_id, "tenant_name": tenant.tenant_name, "user_id": user.user_id,
                       "nick_name": user.nick_name, "email": user.email, "phone": user.phone}
                list.append(res)
                result = generate_result(code, msg, "查询成功", list=list)
        except UserNotExistError as e:
            result = generate_result("1008", "user not exist", e.message)
        except Tenants.DoesNotExist as e:
            logger.exception(e)
            result = generate_result("1001", "tenant not exist", "租户{}不存在".format(tenant_name))
        except Exception as e:
            logger.exception(e)
            result = generate_result("9999", "system error", "系统异常")
        return Response(result)


class AddTeamUserView(BaseAPIView):
    def post(self, request, tenant_name, *args, **kwargs):
        """
        为团队添加用户
        ---
        parameters:
            - name: tenant_name
              description: 团队名
              required: true
              type: string
              paramType: path
            - name: user_name
              description: 用户名
              required: true
              type: string
              paramType: form
            - name: identity
              description: 权限
              required: true
              type: string
              paramType: form
        """
        try:
            user_name = request.data.get("user_name", None)
            if not user_name:
                return Response(generate_result("1003", "username is null", "用户名不能为空"))
            identity = request.data.get("identity", "viewer")
            if not identity:
                return Response(generate_result("1003", "identity is null", "用户权限不能为空"))

            user = user_service.get_user_by_username(user_name)
            tenant = tenant_service.get_tenant(tenant_name)
            enterprise = enterprise_services.get_enterprise_by_id(tenant.enterprise_id)
            tenant_service.add_user_to_tenant(tenant, user, identity, enterprise)
            result = generate_result("0000", "success", "用户添加成功")
        except PermTenantsExistError as e:
            result = generate_result("1009", "permtenant exist", e.message)
        except UserNotExistError as e:
            result = generate_result("1008", "user not exist", e.message)
        except Tenants.DoesNotExist as e:
            logger.exception(e)
            result = generate_result("1001", "tenant not exist", "租户{}不存在".format(tenant_name))
        except Exception as e:
            logger.exception(e)
            result = generate_result("9999", "system error", "系统异常")
        return Response(result)


class TeamUsableRegionView(BaseAPIView):

    def get(self, request, tenant_name, *args, **kwargs):
        """
        获取团队可用的数据中心
        ---
        parameters:
            - name: tenant_name
              description: 团队名
              required: true
              type: string
              paramType: path
        """
        region_name = None
        try:
            team = console_team_service.get_tenant_by_tenant_name(tenant_name)
            if not team:
                return Response(generate_result("0404", "team not found", "团队{0}不存在".format(tenant_name)))

            region_list = console_region_service.get_region_list_by_team_name(request, tenant_name)
            if region_list:
                region_name = region_list[0]["team_region_name"]
            else:
                regions = region_service.get_all_regions()
                if regions:
                    region_name = regions[0].region_name
            result = generate_result("0000", "success", "查询成功", bean={"region_name":region_name})
        except Exception as e:
            logger.exception(e)
            result = generate_result("9999", "system error", "系统异常")
        return Response(result)


class TenantSortView(BaseAPIView):
    """企业下团队排行（根据人数+应用数）"""
    def get(self, request, *args, **kwargs):

        enterprise_id = request.GET.get("enterprise_id", None)
        if enterprise_id:
            enter = enterprise_services.get_enterprise_by_enterprise_id(enterprise_id)
            if not enter:
                return Response(
                    generate_result("0404", "enterprise is not found", "企业不存在"))
            try:
                tenant_list = tenant_service.get_team_by_name_or_alias_or_enter(tenant_name=None, tenant_alias=None,
                                                                                enterprise_id=enterprise_id)
                bean = {}
                bean["tenant_num"] = len(tenant_list)
                user_list = app_group_svc.get_user_by_eid(enterprise_id)
                bean["user_num"] = len(user_list)
                tenant_dict = {}
                for tenant in tenant_list:
                    user_list = tenant_service.get_tenant_users(tenant.tenant_name)
                    service_list = service_repo.get_tenant_services(tenant.tenant_id)
                    total = len(user_list) + len(service_list)
                    tenant_dict[tenant.tenant_alias] = total
                sort_list = sorted(tenant_dict.items(), key=lambda item: item[1], reverse=True)
                result = generate_result('0000', 'success', '查询成功', list=sort_list, bean=bean)
            except Exception as e:
                logger.exception(e)
                result = generate_result('9999', 'system error', '系统异常')
            return Response(result)
        else:
            result = generate_result("1003", "the enterprise alias cannot be empty", "企业别名不能为空")
            return Response(result)