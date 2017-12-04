webpackJsonp([11],{22:function(module,exports,__webpack_require__){"use strict";function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}Object.defineProperty(exports,"__esModule",{value:!0});var _pageController=__webpack_require__(2),_pageController2=_interopRequireDefault(_pageController),_appApiCenter=__webpack_require__(1),_pageAppApiCenter=(__webpack_require__(4),__webpack_require__(3)),_widget=__webpack_require__(0),_widget2=_interopRequireDefault(_widget),template=(_widget2.default.Message,__webpack_require__(37)),AppPay=(0,_pageController2.default)({template:template,property:{tenantName:"",serviceAlias:"",renderData:{appInfo:{},pageData:{}}},method:{getInitData:function(){var _this=this;(0,_appApiCenter.getAppInfo)(this.tenantName,this.serviceAlias).done(function(appInfo){_this.renderData.appInfo=appInfo,(0,_pageAppApiCenter.getPagePayAppData)(_this.tenantName,_this.serviceAlias).done(function(pageData){_this.renderData.pageData=pageData,_this.render()})})},handleMemorySelectTimePay:function(data){var self=this,oneMonthMoney=data.oneMonthMoney,needPay=oneMonthMoney,form=_widget2.default.create("form",{rowNum:1,items:[{label:"包月时长",type:"info",value:'<input style="display:inline-block;width:60%" type="range" min="1" max="24" step="1" id="TimeLong" value="1"><span><cite id="TimeLongText" class="text-success">1</cite>个月</span>'},{label:"费用总计",type:"info",value:'<span id="TimeLongMoney" class="text-success">'+oneMonthMoney+"</span>元"}]}),dialog=_widget2.default.create("dialog",{title:"购买内存包月",content:form.getElement(),height:"250px",btns:[{classes:"btn btn-success",text:"确认付款"},{classes:"btn btn-default btn-cancel",text:"取消"}],domEvents:{".btn-success click":function(){var monthNum=dialog.getElement().find("#TimeLong").val();(0,_appApiCenter.appMemoryMonthly)(self.tenantName,self.serviceAlias,monthNum,needPay).done(function(data){form.destroy(),dialog.destroy(),form=dialog=null,self.getInitData()})},"#TimeLong input":function(){needPay=(dialog.getElement().find("#TimeLong").val()*oneMonthMoney).toFixed(2),$("#TimeLongMoney").html(needPay),$("#TimeLongText").html($("#TimeLong").val())}}})},handleMemoryDirectPay:function(data){var self=this,form=_widget2.default.create("form",{rowNum:1,items:[{label:"包月时长",type:"info",value:'<p class="the_same text-danger">内存与磁盘包月时长应保持一致，剩余时间<span class="text-success day">'+data.remainDay+'</span>天<span  class="text-success hour">'+data.remainHour+"</span>小时</p>"},{label:"费用总计",type:"info",value:'<span id="TimeLongMoney" class="text-success">'+data.toPayMoney+"</span>元"}]}),dialog=_widget2.default.create("dialog",{title:"购买内存包月",content:form.getElement(),height:"250px",btns:[{classes:"btn btn-success",text:"确认付款"},{classes:"btn btn-default btn-cancel",text:"取消"}],domEvents:{".btn-success click":function(){(0,_appApiCenter.appMemoryMonthly)(self.tenantName,self.serviceAlias).done(function(data){form.destroy(),dialog.destroy(),form=dialog=null,self.getInitData()})}}})},showMemoryExpansionDialog:function(data){function computedMemory(memory){return memory<1024?memory:1024*Math.floor(memory/1024)}function computedShowMemory(memory){return memory<1024?memory+" M":Math.floor(memory/1024)+" G"}function computedMoney(){var memory=computedMemory($memoryInput.val()),nodeNum=data.canSetNodeNums?$nodeNumInput.val():1,money=(nodeNum*memory-data.minMemory)*data.unitMoney;return $showMoney.html(money.toFixed(2)),money}var $nodeNumInput=null,$showMemory=null,$memoryInput=null,$showMoney=null,self=this,form=_widget2.default.create("form",{rowNum:1,items:[{label:"节点数",name:"nodeNum",type:"info",value:'<input style="display:inline-block;width:60%" type="range" min="'+data.minNode+'" max="20" step="1" id="NodeNum" value="'+data.minNode+'" /><span><cite id="NodeText" class="text-success">'+data.minNode+"</cite>个</span>"},{label:"单节点内存",type:"info",value:'<input style="display:inline-block;width:60%" type="range" min="'+data.minMemory+'" max="'+data.maxMemory+'" step="128" id="OneMemory" value="'+data.minMemory+'" ／><span><cite id="OneMemoryText" class="text-success"></cite></span>'},{label:"新增费用",type:"info",name:"money",value:'<span id="deployMoney" class="text-success">'+(data.payMoney||0)+"</span><span>元（按当前包月时长计算）</span>"}]}),dialog=_widget2.default.create("dialog",{title:"增加内存包月额度",content:form.getElement(),height:"300px",btns:[{classes:"btn btn-success",text:"确认付款"},{classes:"btn btn-default btn-cancel",text:"取消"}],domEvents:{".btn-success click":function(){computedMoney()<=0?(form.destroy(),dialog.destroy(),form=dialog=null):(0,_appApiCenter.postMemoryMonthlyExpansion)(self.tenantName,self.serviceAlias,computedMemory($memoryInput.val()),$("#NodeNum").val()).done(function(){form.destroy(),dialog.destroy(),form=dialog=null,self.getInitData()})},"#NodeNum input":function(){data.canSetNodeNums&&($("#NodeText").html($("#NodeNum").val()),computedMoney())},"#OneMemory input":function(){$("#OneMemoryText").html(computedShowMemory(computedMemory($("#OneMemory").val()))),computedMoney()}}}),$dialog=dialog.getElement();$showMoney=$dialog.find("#deployMoney"),$dialog.find("#NodeText"),$nodeNumInput=$dialog.find("#NodeNum"),$showMemory=$dialog.find("#OneMemoryText"),$memoryInput=$dialog.find("#OneMemory"),$showMemory.html(computedShowMemory(data.minMemory)),data.canSetNodeNums||form.hideInput("nodeNum"),data.showMoney||form.hideInput("money")},handleMemoryExpansion:function(){var self=this;(0,_appApiCenter.appMemoryMonthlyExpansionInfo)(this.tenantName,this.serviceAlias).done(function(data){self.showMemoryExpansionDialog(data)})},handleMemoryMonthly:function(){var self=this;(0,_appApiCenter.getMemoryMonthlyInfo)(this.tenantName,this.serviceAlias).done(function(data){data.choosable?self.handleMemorySelectTimePay(data):self.handleMemoryDirectPay(data)})},showDiskMonthlyDialog:function(data,choosable){var self=this,unitMoney=choosable?data.oneMonthOneGmoney:data.oneGmoney,needPay=unitMoney,form=_widget2.default.create("form",{rowNum:1,items:[{label:"包月时长",type:"info",name:"monthInfo",value:'<p class="the_same text-danger">磁盘与内存包月时长应保持一致，剩余时间<span  class="text-success">'+data.remainDay+'</span>天<span  class="text-success">'+data.remainHour+"</span>小时</p>"},{label:"包月时长",type:"info",name:"monthInput",value:'<input style="display:inline-block;width:60%" type="range" min="1" max="24" step="1" id="LongDisk" value="1"><span><cite id="LongDiskText" class="text-success">1</cite>个月</span>'},{label:"包月额度",type:"info",value:'<input style="display:inline-block;width:60%" type="range" min="1" max="200" step="1" id="LongDiskSize" value="1"><span><span><cite id="DiskSizeText" class="text-success">1</cite>G</span>'},{label:"费用总计",type:"info",value:'<span id="LongDiskMoney" class="text-success">'+needPay+"</span>元"}]}),dialog=_widget2.default.create("dialog",{title:"购买磁盘包月",content:form.getElement(),height:"300px",btns:[{classes:"btn btn-success",text:"确认付款"},{classes:"btn btn-default btn-cancel",text:"取消"}],domEvents:{".btn-success click":function(){var $wrap=dialog.getElement(),monthNum=$wrap.find("#LongDisk").val(),diskSize=$wrap.find("#LongDiskSize").val();(0,_appApiCenter.appDiskMonthly)(self.tenantName,self.serviceAlias,diskSize,monthNum).done(function(data){form.destroy(),dialog.destroy(),form=dialog=null,self.getInitData()})},"#LongDisk input":function(){if(choosable){var $wrap=dialog.getElement();needPay=(unitMoney*$wrap.find("#LongDisk").val()*$wrap.find("#LongDiskSize").val()).toFixed(2),$("#LongDiskText").html($wrap.find("#LongDisk").val()),$("#LongDiskMoney").html(needPay)}},"#LongDiskSize input":function(){var $wrap=dialog.getElement();needPay=choosable?(unitMoney*$wrap.find("#LongDiskSize").val()*$wrap.find("#LongDisk").val()).toFixed(2):(unitMoney*$wrap.find("#LongDiskSize").val()).toFixed(2),$("#LongDiskMoney").html(needPay),$("#DiskSizeText").html($wrap.find("#LongDiskSize").val())}}});choosable?form.hideInput("monthInfo"):form.hideInput("monthInput")},handleDiskMonthly:function(){var self=this;(0,_appApiCenter.getDiskMonthlyInfo)(this.tenantName,this.serviceAlias).done(function(data){self.showDiskMonthlyDialog(data,data.choosable)})},showMonthlyAddTimeDialog:function(data){var self=this,oneMonthMoney=data.oneMonthMoney,needPay=oneMonthMoney,form=_widget2.default.create("form",{rowNum:1,labelCol:3,items:[{label:"包月时长",type:"info",value:'<input type="range" min="1" max="24" step="1" id="TimeLong" value="1" style="display:inline-block;width:60%"><span><cite id="TimeLongText" class="text-success">1</cite>个月</span>'},{label:"费用总计",type:"info",value:'<div><span id="TimeLongMoney" class="text-success">'+oneMonthMoney+"</span>元（按所有包月项目同步增加时长计算）</div>"}]}),dialog=_widget2.default.create("dialog",{title:"增加包月时长",content:form.getElement(),height:"300px",btns:[{classes:"btn btn-success",text:"确认付款"},{classes:"btn btn-default btn-cancel",text:"取消"}],domEvents:{".btn-success click":function(){var monthNum=dialog.getElement().find("#TimeLong").val();(0,_appApiCenter.appMonthlyAddTime)(self.tenantName,self.serviceAlias,monthNum).done(function(data){form.destroy(),dialog.destroy(),form=dialog=null,self.getInitData()})},"#TimeLong input":function(){needPay=(dialog.getElement().find("#TimeLong").val()*oneMonthMoney).toFixed(2),$("#TimeLongMoney").html(needPay),$("#TimeLongText").html(dialog.getElement().find("#TimeLong").val())}}})},handleMonthlyAddTime:function(){var self=this;(0,_appApiCenter.getAppMonthlyInfo)(this.tenantName,this.serviceAlias).done(function(data){self.showMonthlyAddTimeDialog(data)})}},domEvents:{".memoryMonthly click":function(){this.handleMemoryMonthly()},".monthlyAddTime click":function(){this.handleMonthlyAddTime()},".memoryExpansion click":function(){this.handleMemoryExpansion()},".diskMonthly click":function(){this.handleDiskMonthly()}},onReady:function(){this.renderData.tenantName=this.tenantName,this.renderData.serviceAlias=this.serviceAlias,this.getInitData()}});window.AppPayController=AppPay,exports.default=AppPay},37:function(module,exports){module.exports='    <div class="panel panel-default">\n        <div class="panel-heading">计费方式</div>\n        <div class="panel-body">\n        <table class="table">\n            <tbody>\n            <tr>\n                <td>\n                    内存：\n                    {{if pageData.service_attach_info.memory_pay_method == \'prepaid\'}}\n                        <span class="memoryFun" data-currentway="prepaid">\n                            包&nbsp;{{pageData.total_buy_memory}}MB 至\n                        </span>\n                        <span>\n                            {{pageData.service_attach_info.buy_end_time}}\n                        </span>\n                        &nbsp;&nbsp;\n                        <a href="javascript:void(0)" class="monthlyAddTime">增加时长</a>\n                        &nbsp;&nbsp;\n                        <a href="javascript:void(0)" class="memoryExpansion">增加额度</a>\n                    {{else}}\n                        <span class="memoryFun" data-currentway="postpaid">按小时扣费</span>\n                        &nbsp;&nbsp;\n                        <a href="javascript:void(0)" class="memoryMonthly">购买包月</a>\n                    {{/if}}\n                </td>\n                <td>\n                    当前使用：<span>{{appInfo.service.min_memory}} MB×{{appInfo.service.min_node}}</span>\n                </td>\n                <td>\n                    累计费用：\n                    <span>{{pageData.service_total_memory_fee || 0}} 元</span>\n\n                </td>\n            </tr>\n            <tr>\n                <td>\n                    磁盘：\n                    {{if pageData.service_attach_info.disk_pay_method == \'prepaid\'}}\n                        <span class="diskFun" data-currentway="prepaid">\n                            包&nbsp;{{ pageData.service_attach_info.disk / 1024 }} GB 至\n                        </span>\n                        <span>\n                            {{pageData.service_attach_info.buy_end_time}}\n                        </span>\n                        &nbsp;&nbsp;\n                        <a href="javascript:void(0)" class="monthlyAddTime">增加时长</a>\n                    {{else}}\n                        <span class="diskFun" data-currentway="postpaid">按小时扣费</span>\n                        &nbsp;&nbsp;\n                        <a href="javascript:void(0)" class="diskMonthly">购买包月</a>\n                    {{/if}}\n                </td>\n                <td>\n                    当前使用：<span>{{(pageData.last_hour_consume  && pageData.last_hour_consume.disk) || 0}} MB</span>\n                </td>\n                <td>\n                    累计费用：<span>{{pageData.service_total_disk_fee || 0}}元</span>\n                </td>\n            </tr>\n            <tr>\n                <td>\n                    流量：<span>按小时扣费</span>\n                </td>\n                <td>\n                    上一小时使用：<span>{{(pageData.last_hour_consume  && pageData.last_hour_consume.net) || 0}} MB</span>\n                </td>\n                <td>\n                    累计费用：<span>{{pageData.service_total_net_fee}} 元</span>\n                </td>\n            </tr>\n            </tbody>\n        </table>\n        </div>\n    </div>\n   \n    <div class="panel panel-default">\n        <div class="panel-heading">最近24小时计费明细</div>\n        <div class="panel-body">\n        <table class="table">\n            <thead>\n                <tr class="active">\n                    <th>时段</th>\n                    <th class="hidden-xs">内存<br />(MB)</th>\n                    <th class="hidden-xs">费用<br />(元)</th>\n                    <th class="hidden-xs">实扣<br />(元)</th>\n                    <th class="hidden-xs">磁盘<br />(MB)</th>\n                    <th class="hidden-xs">费用<br />(元)</th>\n                    <th class="hidden-xs">实扣<br />(元)</th>\n                    <th class="hidden-xs">流量<br />(MB)</th>\n                    <th class="hidden-xs">费用<br />(元)</th>\n                    <th class="hidden-xs">实扣<br />(元)</th>\n                    <th>总扣费<br />(元)</th>\n                </tr>\n            </thead>\n            <tbody>\n                {{each pageData.service_consume_list}}\n                <tr>\n                    <td>\n                        {{(new $imports.Date($value.time)-(1000*60*60)) | dateFormat "MM-dd hh:mm"}}\n                        ~\n                        {{new $imports.Date($value.time) | dateFormat "hh:mm"}}\n                    </td>\n                    <td class="hidden-xs">{{$value.memory}}</td>\n                    <td class="hidden-xs">{{$value.real_memory_money }}</td>\n                    <td class="hidden-xs">\n                        <span class="fn-tips" data-toggle="tooltip" data-placement="top" title="{{if $value.memory_pay_method == \'prepaid\'}}超出包月额度的费用{{else}}按小时扣除的费用{{/if}}">\n                            {{$value.memory_money}}\n                        </span>\n                    </td>\n                    <td class="hidden-xs">{{$value.disk}}</td>\n                    <td class="hidden-xs">{{$value.real_disk_money}}</td>\n                    <td class="hidden-xs">\n                        <span class="fn-tips" data-toggle="tooltip" data-placement="top" title="{{if $value.disk_pay_method == \'prepaid\'}}超出包月额度的费用{{else}}按小时扣除的费用{{/if}}">\n                            {{$value.disk_money}}\n                        </span>\n                    </td>\n                    <td class="hidden-xs">{{$value.net}}</td>\n                    <td class="hidden-xs">{{$value.net_money}}</td>\n                    <td class="hidden-xs">\n                        <span class="fn-tips" data-toggle="tooltip" data-placement="top" title="按小时扣除的费用">\n                            {{$value.net_money}}\n                        </span>\n                    </td>\n                    <td>{{$value.pay_money}}</td>\n                </tr>\n                {{/each}}\n            </tbody>\n            <tfoot>\n            </tfoot>\n        </table>\n        </div>\n    </div>'},72:function(module,exports,__webpack_require__){module.exports=__webpack_require__(22)}},[72]);