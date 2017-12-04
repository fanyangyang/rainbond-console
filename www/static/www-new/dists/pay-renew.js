webpackJsonp([0],{28:function(module,exports,__webpack_require__){"use strict";function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}function _defineProperty(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value:value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}Object.defineProperty(exports,"__esModule",{value:!0});var _domEvents,_pageController=__webpack_require__(2),_pageController2=_interopRequireDefault(_pageController),_widget=__webpack_require__(0),_widget2=_interopRequireDefault(_widget),_payAppADTUtil=__webpack_require__(58),_payAppADTUtil2=_interopRequireDefault(_payAppADTUtil),_appApiCenter=__webpack_require__(1),Msg=_widget2.default.Message;__webpack_require__(65),__webpack_require__(51),__webpack_require__(49),__webpack_require__(52),__webpack_require__(50),__webpack_require__(56);var template=__webpack_require__(42),PayController=(0,_pageController2.default)({template:template,property:{listType:"1",dataList:null,totalMoney:0,tenantName:"",renderData:{}},method:{updateDomByMenuType:function(){this.$wrap.find(".top-level").removeClass("active"),this.$wrap.find("[menu-type="+this.listType+"]").closest(".top-level").addClass("active"),this.$wrap.find(".selected-text").html(""),"3"==this.listType?this.$wrap.find(".memory-selected-text").html(":选择时长"):"4"==this.listType&&this.$wrap.find(".memory-selected-text").html(":不选择时长"),"5"==this.listType?this.$wrap.find(".disk-selected-text").html(":选择时长"):"6"==this.listType&&this.$wrap.find(".disk-selected-text").html(":不选择时长"),this.$wrap.find(".total-money-wrap span").html("0"),this.timeSelect.setValue(1),this.$wrap.find("[name=disk-range]").val(1),this.$wrap.find(".disk-result").html(1),"1"===this.listType?(this.$wrap.find(".money-row").hide(),this.$wrap.find(".diskRange-row").hide(),this.$wrap.find(".dateRange-row").hide(),this.$wrap.find(".btns-row").hide(),this.$wrap.find(".pay-renew-form").hide()):"2"==this.listType?(this.$wrap.find(".money-row").show(),this.$wrap.find(".btns-row").show(),this.$wrap.find(".diskRange-row").hide(),this.$wrap.find(".dateRange-row").show(),this.$wrap.find(".submit-memory-month").hide(),this.$wrap.find(".submit-disk-month").hide(),this.$wrap.find(".submit-renew").show()):"3"==this.listType||"4"==this.listType?(this.$wrap.find(".money-row").show(),this.$wrap.find(".btns-row").show(),this.$wrap.find(".diskRange-row").hide(),this.$wrap.find(".submit-memory-month").show(),this.$wrap.find(".submit-disk-month").hide(),this.$wrap.find(".submit-renew").hide(),"3"==this.listType?this.$wrap.find(".dateRange-row").show():this.$wrap.find(".dateRange-row").hide()):"5"!=this.listType&&"6"!=this.listType||(this.$wrap.find(".money-row").show(),this.$wrap.find(".btns-row").show(),this.$wrap.find(".submit-memory-month").hide(),this.$wrap.find(".submit-disk-month").show(),this.$wrap.find(".submit-renew").hide(),this.$wrap.find(".diskRange-row").show(),"5"==this.listType?this.$wrap.find(".dateRange-row").show():this.$wrap.find(".dateRange-row").hide())},createList:function(){this.dataList&&this.dataList.destroy();var self=this;"1"==this.listType&&(this.dataList=_widget2.default.create("tableList",{url:"/apps/"+this.tenantName+"/service-renew/",renderTo:this.$wrap.find(".list-wrap"),selectable:!1,toCustomData:function(data){return new _payAppADTUtil2.default(data)},columns:[{name:"name",text:"应用名称"},{name:"memory",text:"内存"},{name:"disk",text:"硬盘"},{name:"endDate",text:"截止日期"},{name:"action",text:"操作"}],render:{name:function(text,data,index,customData){return customData.getAppName()},memory:function(text,data,index,customData){var html=customData.getTotalMemory(!0);return customData.isMemoryPayed()&&(html+=' <span class="status-tip">包</span>'),html},disk:function(text,data,index,customData){var html=customData.getDisk(!0);return customData.isDiskPayed()&&(html+=' <span class="status-tip">包</span>'),html},endDate:function(text,data,index,customData){return customData.getEndDate()},action:function(text,data,index,customData){var html=[];return customData.isMemoryPayed()||html.push('<button class="buy-memory btn btn-default" href="javascript:;">内存购买包月</button>'),(customData.canAddMemoryDate()||customData.canAddDiskDate())&&html.push('<button class="add-date btn btn-default" href="javascript:;">增加时长</button>'),customData.canAddMemorySize()&&html.push('<button class="memory-add-size btn btn-default" href="javascript:;">内存增加额度</button>'),customData.isDiskPayed()||html.push('<button class="buy-disk btn btn-default" href="javascript:;">磁盘购买包月</button>'),customData.canAddDiskSize()&&html.push('<button class="disk-add-date btn btn-default" href="javascript:;">磁盘增加额度</button>'),html.join("")}}})),"2"==this.listType&&(this.dataList=_widget2.default.create("tableList",{url:"/apps/"+this.tenantName+"/service-renew/",queryFunction:function(){return{action:"batch"}},renderTo:this.$wrap.find(".list-wrap"),selectable:!0,toCustomData:function(data){return new _payAppADTUtil2.default(data)},columns:[{name:"name",text:"应用名称"},{name:"memory",text:"内存"},{name:"disk",text:"硬盘"},{name:"endDate",text:"截止日期"}],event:{onLoaded:function(){self.$wrap.find(".pay-renew-form").show()},onEmpty:[function(){self.$wrap.find(".pay-renew-form").hide()}],onSelectedChange:[function(){self.updateTotalMoney()}]},render:{name:function(text,data,index,customData){return customData.getAppName()},memory:function(text,data,index,customData){return customData.getTotalMemory(!0)},disk:function(text,data,index,customData){return customData.getDisk(!0)},endDate:function(text,data,index,customData){return customData.getEndDate()}}})),"3"==this.listType&&(this.dataList=_widget2.default.create("tableList",{url:"/apps/"+this.tenantName+"/service-renew/",queryFunction:function(){return{action:"batch-memory",type:"postpaid_disk"}},renderTo:this.$wrap.find(".list-wrap"),selectable:!0,toCustomData:function(data){return new _payAppADTUtil2.default(data)},columns:[{name:"name",text:"应用名称"},{name:"memory",text:"使用内存"}],event:{onLoaded:function(){self.$wrap.find(".pay-renew-form").show()},onEmpty:[function(){self.$wrap.find(".pay-renew-form").hide()}],onSelectedChange:[function(){self.updateTotalMoney()}]},render:{name:function(text,data,index,customData){return customData.getAppName()},memory:function(text,data,index,customData){return customData.getTotalMemory(!0)}}})),"4"==this.listType&&(this.dataList=_widget2.default.create("tableList",{url:"/apps/"+this.tenantName+"/service-renew/",queryFunction:function(){return{action:"batch-memory",type:"prepaid_disk"}},renderTo:this.$wrap.find(".list-wrap"),selectable:!0,toCustomData:function(data){return new _payAppADTUtil2.default(data)},columns:[{name:"name",text:"应用名称"},{name:"memory",text:"使用内存"},{name:"disk",text:"硬盘"}],event:{onLoaded:function(){self.$wrap.find(".pay-renew-form").show()},onEmpty:[function(){self.$wrap.find(".pay-renew-form").hide()}],onSelectedChange:[function(){self.updateTotalMoney()}]},render:{name:function(text,data,index,customData){return customData.getAppName()},memory:function(text,data,index,customData){return customData.getTotalMemory(!0)},disk:function(text,data,index,customData){return customData.getDisk(!0)}}})),"5"==this.listType&&(this.dataList=_widget2.default.create("tableList",{url:"/apps/"+this.tenantName+"/service-renew/",queryFunction:function(){return{action:"batch-disk",type:"postpaid_memory"}},renderTo:this.$wrap.find(".list-wrap"),selectable:!0,toCustomData:function(data){return new _payAppADTUtil2.default(data)},columns:[{name:"name",text:"应用名称"},{name:"memory",text:"使用内存"}],event:{onLoaded:function(){self.$wrap.find(".pay-renew-form").show()},onEmpty:[function(){self.$wrap.find(".pay-renew-form").hide()}],onSelectedChange:[function(){self.updateTotalMoney()}]},render:{name:function(text,data,index,customData){return customData.getAppName()},memory:function(text,data,index,customData){return customData.getTotalMemory(!0)}}})),"6"==this.listType&&(this.dataList=_widget2.default.create("tableList",{url:"/apps/"+this.tenantName+"/service-renew/",queryFunction:function(){return{action:"batch-disk",type:"prepaid_memory"}},renderTo:this.$wrap.find(".list-wrap"),selectable:!0,toCustomData:function(data){return new _payAppADTUtil2.default(data)},columns:[{name:"name",text:"应用名称"},{name:"memory",text:"使用内存"}],event:{onLoaded:function(){self.$wrap.find(".pay-renew-form").show()},onEmpty:[function(){self.$wrap.find(".pay-renew-form").hide()}],onSelectedChange:[function(){self.updateTotalMoney()}]},render:{name:function(text,data,index,customData){return customData.getAppName()},memory:function(text,data,index,customData){return customData.getTotalMemory(!0)}}}))},setListType:function(type){this.listType=type},getTotalMoney:function(){if("2"==this.listType||"3"==this.listType){for(var monthNum=this.timeSelect.getValue(),needMoneys=this.dataList.getSelectedArrayByKey("need_money"),totalOneMonthMoney=0,totalMoney=0,i=0;i<needMoneys.length;i++)totalOneMonthMoney+=Number(needMoneys[i]);return totalMoney=24*totalOneMonthMoney*30*monthNum,totalMoney.toFixed(2)}if("4"==this.listType){for(var needMoneys=this.dataList.getSelectedArrayByKey("need_money"),totalOneMonthMoney=0,totalMoney=0,i=0;i<needMoneys.length;i++)totalOneMonthMoney+=Number(needMoneys[i]);return totalMoney=24*totalOneMonthMoney*30,totalMoney.toFixed(2)}if("5"==this.listType){var len=this.dataList.getSelected().length;if(0==len)return 0;var diskOneHourMoney=24*this.dataList.getSelected()[0].unit_disk_fee*30,monthNum=this.timeSelect.getValue(),disk=this.$wrap.find("[name=disk-range]").val(),totalMoney=diskOneHourMoney*len*monthNum*disk;return totalMoney.toFixed(2)}if("6"==this.listType){for(var selected=this.dataList.getSelected(),totalMoney=0,disk=this.$wrap.find("[name=disk-range]").val(),i=0;i<selected.length;i++)totalMoney+=selected[i].unit_disk_fee*selected[i].hours;return totalMoney*=disk,totalMoney.toFixed(2)}},updateTotalMoney:function(){this.$wrap.find(".total-money-wrap span").html(this.getTotalMoney())},handleBatchMemory:function(){if("3"==this.listType){var selectedIds=this.dataList.getSelectedArrayByKey("service_id"),monthNum=this.timeSelect.getValue();return(0,_appApiCenter.appBatchMemoryWitTime)(this.tenantName,selectedIds,monthNum)}if("4"==this.listType){var selectedIds=this.dataList.getSelectedArrayByKey("service_id");return(0,_appApiCenter.appBatchMemoryWithoutTime)(this.tenantName,selectedIds)}},handleBatchDisk:function(){if("5"==this.listType){var selectedIds=this.dataList.getSelectedArrayByKey("service_id"),monthNum=this.timeSelect.getValue(),disk=this.$wrap.find("[name=disk-range]").val();return(0,_appApiCenter.appBatchDiskWithTime)(this.tenantName,selectedIds,disk,monthNum)}if("6"==this.listType){var selectedIds=this.dataList.getSelectedArrayByKey("service_id"),disk=this.$wrap.find("[name=disk-range]").val();return(0,_appApiCenter.appBatchDiskWithoutTime)(this.tenantName,selectedIds,disk)}}},domEvents:(_domEvents={"[menu-type] click":function(e){var type=$(e.currentTarget).attr("menu-type");type&&(this.setListType(type),this.createList(),this.updateDomByMenuType(),this.$wrap.find(".empty-info").hide())},".add-date click":function(e){var uid=$(e.currentTarget).parents(".list_item").attr("uid"),data=this.dataList.getDataByuid(uid);data&&this.handleMonthlyAddTime(new _payAppADTUtil2.default(data))},".buy-memory click":function(e){var self=this,uid=$(e.currentTarget).parents(".list_item").attr("uid"),data=this.dataList.getDataByuid(uid);if(data){var appADT=new _payAppADTUtil2.default(data);_widget2.default.create("appMemoryMonthly",{tenantName:appADT.getTenantName(),serviceAlias:appADT.getAppAlias(),onSuccess:function(){self.dataList.reload()}})}},".buy-disk click":function(e){var self=this,uid=$(e.currentTarget).parents(".list_item").attr("uid"),data=this.dataList.getDataByuid(uid);if(data){var appADT=new _payAppADTUtil2.default(data);_widget2.default.create("appDiskMonthly",{tenantName:appADT.getTenantName(),serviceAlias:appADT.getAppAlias(),onSuccess:function(){self.dataList.reload()}})}}},_defineProperty(_domEvents,".add-date click",function(e){var self=this,uid=$(e.currentTarget).parents(".list_item").attr("uid"),data=this.dataList.getDataByuid(uid);if(data){var appADT=new _payAppADTUtil2.default(data);_widget2.default.create("appMonthlyAddTime",{tenantName:appADT.getTenantName(),serviceAlias:appADT.getAppAlias(),onSuccess:function(){self.dataList.reload()}})}}),_defineProperty(_domEvents,".memory-add-size click",function(e){var self=this,uid=$(e.currentTarget).parents(".list_item").attr("uid"),data=this.dataList.getDataByuid(uid);if(data){var appADT=new _payAppADTUtil2.default(data);_widget2.default.create("appMemoryExpansion",{tenantName:appADT.getTenantName(),serviceAlias:appADT.getAppAlias(),onSuccess:function(){self.dataList.reload()}})}}),_defineProperty(_domEvents,".submit-renew click",function(e){var self=this,selectedIds=this.dataList.getSelectedArrayByKey("service_id");if(!selectedIds.length)return void Msg.warning("请选择要续费的应用");var monthNum=this.timeSelect.getValue(),totalMoney=this.getTotalMoney(),confirm=_widget2.default.create("confirm",{title:"批量续费",content:"费用总计: "+totalMoney+" 元<br /> 确认批量续费吗？",event:{onOk:function(){(0,_appApiCenter.appBatchRenew)(self.tenantName,selectedIds,monthNum).done(function(data){confirm.destroy(),self.dataList.reload(),self.updateTotalMoney()})}}})}),_defineProperty(_domEvents,".submit-memory-month click",function(){var self=this;if(!this.dataList.getSelectedArrayByKey("service_id").length)return void Msg.warning("请选择要包月的应用");var totalMoney=this.getTotalMoney(),confirm=_widget2.default.create("confirm",{title:"内存包月",content:"费用总计: "+totalMoney+" 元<br /> 确认包月吗？",event:{onOk:function(){self.handleBatchMemory().done(function(){confirm.destroy(),self.dataList.reload(),self.updateTotalMoney()})}}})}),_defineProperty(_domEvents,".submit-disk-month click",function(){var self=this;if(!this.dataList.getSelectedArrayByKey("service_id").length)return void Msg.warning("请选择要包月的应用");var totalMoney=this.getTotalMoney(),confirm=_widget2.default.create("confirm",{title:"磁盘包月",content:"费用总计: "+totalMoney+" 元<br /> 确认包月吗？",event:{onOk:function(){self.handleBatchDisk().done(function(){confirm.destroy(),self.dataList.reload(),self.updateTotalMoney()})}}})}),_defineProperty(_domEvents,"[name=disk-range] input",function(e){var val=$(e.currentTarget).val();this.$wrap.find(".disk-result").html(val),this.updateTotalMoney()}),_domEvents),onReady:function(){var _this=this,self=this;this.render(),setTimeout(function(){_this.timeSelect=_widget2.default.create("monthly-time-select",{onChange:function(){self.updateTotalMoney()}}),_this.$wrap.find(".date-select").html(_this.timeSelect.getElement()),_this.updateDomByMenuType(),_this.createList()})}});window.PayController=PayController,exports.default=PayController},42:function(module,exports){module.exports='<div class="nav nav-pills">\n    <li class="top-level" menu-type="1">\n        <a href="javascript:;">全部应用</a>\n    </li>\n    <li class="top-level" menu-type="2">\n        <a href="javascript:;">批量续费</a>\n    </li>\n    <li role="presentation" class="dropdown  top-level">\n        <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown">\n            批量内存包月\n            <span class="memory-selected-text selected-text"></span>\n            <span class="caret"></span>\n        </a>\n        <ul class="dropdown-menu">\n            <li menu-type="3"><a href="javascript:;">选择时长</a></li>\n            <li menu-type="4"><a href="javascript:;">不选择时长</a></li>\n        </ul>\n    </li>\n    <li role="presentation" class="dropdown top-level">\n        <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown">\n            批量硬盘包月\n            <span class="disk-selected-text selected-text"></span>\n            <span class="caret"></span>\n        </a>\n        <ul class="dropdown-menu">\n            <li menu-type="5"><a href="javascript:;">选择时长</a></li>\n            <li menu-type="6"><a href="javascript:;">不选择时长</a></li>\n        </ul>\n    </li>\n</div>\n\n<div class="panel panel-default">\n    <div class="panel-body">\n        <div class="list-wrap"></div>\n        <p class="bg-info empty-info" style="text-align: center;display: none;">暂无记录</p>\n    </div>\n\n    <div class="panel-footer pay-renew-form" style="display: none;">\n\n        <form class="form-horizontal">\n            <div class="form-group  money-row">\n                <span class="control-label col-sm-2">\n                    费用总计:\n                </span>\n                <div class="col-sm-10 total-money-wrap form-control-static">\n                    <span style="font-size:">0.00</span> 元\n                </div>\n            </div>\n\n            <div class="form-group  dateRange-row">\n                <span class="control-label col-sm-2">\n                    选择时长:\n                </span>\n                <div class="col-sm-10 date-select">\n                    \n                </div>\n            </div>\n\n            <div class="form-group  diskRange-row">\n                <span class="control-label col-sm-2">\n                    磁盘额度:\n                </span>\n                <div class="col-sm-10 form-control-static">\n                    <input name="disk-range" style="display:inline-block;width:300px" type="range" min="1" max="200" value="1" />\n                    <span class="disk-result">1</span> G\n                </div>\n            </div>\n\n            <div class="form-group btns-row">\n                <span class="control-label col-sm-2">\n                    \n                </span>\n                <div class="col-sm-10">\n                    <span class="btn btn-success submit-memory-month">确认包月</span>\n                    <span class="btn btn-success submit-disk-month">确认包月</span>\n                    <span class="btn btn-success submit-renew">确认续费</span>\n                </div>\n            </div>\n        </form>\n    </div>\n</div>\n    \n    \n'},49:function(module,exports,__webpack_require__){"use strict";function noop(){}var _widget=__webpack_require__(0),_widget2=function(obj){return obj&&obj.__esModule?obj:{default:obj}}(_widget),_appApiCenter=__webpack_require__(1);_widget2.default.define("appDiskMonthly",{_defaultOption:{tpl:"<div></div>",onSuccess:noop,onFail:noop,onCancel:noop,tenantName:"",serviceAlias:""},_init:function(option){this.callParent(option),"appDiskMonthly"==this.ClassName&&(this._create(),this.bind())},_create:function(){this.callParent();var self=this;(0,_appApiCenter.getDiskMonthlyInfo)(self.option.tenantName,self.option.serviceAlias).done(function(data){self.showDiskMonthlyDialog(data,data.choosable)})},showDiskMonthlyDialog:function(data,choosable){var self=this,unitMoney=choosable?data.oneMonthOneGmoney:data.oneGmoney,needPay=unitMoney,form=_widget2.default.create("form",{rowNum:1,items:[{label:"包月时长",type:"info",name:"monthInfo",value:'<p class="the_same text-danger">磁盘与内存包月时长应保持一致，剩余时间<span  class="text-success">'+data.remainDay+'</span>天<span  class="text-success">'+data.remainHour+"</span>小时</p>"},{label:"包月时长",type:"info",name:"monthInput",value:'<input style="display:inline-block;width:60%" type="range" min="1" max="24" step="1" id="LongDisk" value="1"><span><cite id="LongDiskText" class="text-success">1</cite>个月</span>'},{label:"包月额度",type:"info",value:'<input style="display:inline-block;width:60%" type="range" min="1" max="200" step="1" id="LongDiskSize" value="1"><span><span><cite id="DiskSizeText" class="text-success">1</cite>G</span>'},{label:"费用总计",type:"info",value:'<span id="LongDiskMoney" class="text-success">'+needPay+"</span>元"}]}),dialog=_widget2.default.create("dialog",{title:"购买磁盘包月",content:form.getElement(),height:"300px",btns:[{classes:"btn btn-success",text:"确认付款"},{classes:"btn btn-default btn-cancel",text:"取消"}],domEvents:{".btn-success click":function(){var $wrap=dialog.getElement(),monthNum=$wrap.find("#LongDisk").val(),diskSize=$wrap.find("#LongDiskSize").val();(0,_appApiCenter.appDiskMonthly)(self.option.tenantName,self.option.serviceAlias,diskSize,monthNum).done(function(data){form.destroy(),dialog.destroy(),form=dialog=null,self.option.onSuccess()})},"#LongDisk input":function(){if(choosable){var $wrap=dialog.getElement();needPay=(unitMoney*$wrap.find("#LongDisk").val()*$wrap.find("#LongDiskSize").val()).toFixed(2),$("#LongDiskText").html($wrap.find("#LongDisk").val()),$("#LongDiskMoney").html(needPay)}},"#LongDiskSize input":function(){var $wrap=dialog.getElement();needPay=choosable?(unitMoney*$wrap.find("#LongDiskSize").val()*$wrap.find("#LongDisk").val()).toFixed(2):(unitMoney*$wrap.find("#LongDiskSize").val()).toFixed(2),$("#LongDiskMoney").html(needPay),$("#DiskSizeText").html($wrap.find("#LongDiskSize").val())}}});choosable?form.hideInput("monthInfo"):form.hideInput("monthInput")}})},50:function(module,exports,__webpack_require__){"use strict";function noop(){}var _widget=__webpack_require__(0),_widget2=function(obj){return obj&&obj.__esModule?obj:{default:obj}}(_widget),_appApiCenter=__webpack_require__(1);_widget2.default.define("appMemoryExpansion",{_defaultOption:{tpl:"<div></div>",onSuccess:noop,onFail:noop,onCancel:noop,tenantName:"",serviceAlias:""},_init:function(option){this.callParent(option),"appMemoryExpansion"==this.ClassName&&(this._create(),this.bind())},_create:function(){this.callParent();var self=this;(0,_appApiCenter.appMemoryMonthlyExpansionInfo)(self.option.tenantName,self.option.serviceAlias).done(function(data){self.showMemoryExpansionDialog(data)})},showMemoryExpansionDialog:function(data){function computedMemory(memory){return memory<1024?memory:1024*Math.floor(memory/1024)}function computedShowMemory(memory){return memory<1024?memory+" M":Math.floor(memory/1024)+" G"}function computedMoney(){var memory=computedMemory($memoryInput.val()),nodeNum=data.canSetNodeNums?$nodeNumInput.val():1,money=(nodeNum*memory-data.minMemory)*data.unitMoney;return $showMoney.html(money.toFixed(2)),money}var $nodeNumInput=null,$showMemory=null,$memoryInput=null,$showMoney=null,self=this,form=_widget2.default.create("form",{rowNum:1,items:[{label:"节点数",name:"nodeNum",type:"info",value:'<input style="display:inline-block;width:60%" type="range" min="'+data.minNode+'" max="20" step="1" id="NodeNum" value="'+data.minNode+'" /><span><cite id="NodeText" class="text-success">'+data.minNode+"</cite>个</span>"},{label:"单节点内存",type:"info",value:'<input style="display:inline-block;width:60%" type="range" min="'+data.minMemory+'" max="'+data.maxMemory+'" step="128" id="OneMemory" value="'+data.minMemory+'" ／><span><cite id="OneMemoryText" class="text-success"></cite></span>'},{label:"新增费用",type:"info",name:"money",value:'<span id="deployMoney" class="text-success">'+(data.payMoney||0)+"</span><span>元（按当前包月时长计算）</span>"}]}),dialog=_widget2.default.create("dialog",{title:"增加内存包月额度",content:form.getElement(),height:"300px",btns:[{classes:"btn btn-success",text:"确认付款"},{classes:"btn btn-default btn-cancel",text:"取消"}],domEvents:{".btn-success click":function(){computedMoney()<=0?(form.destroy(),dialog.destroy(),form=dialog=null):(0,_appApiCenter.postMemoryMonthlyExpansion)(self.option.tenantName,self.option.serviceAlias,computedMemory($memoryInput.val()),$("#NodeNum").val()).done(function(){form.destroy(),dialog.destroy(),form=dialog=null,self.option.onSuccess()})},"#NodeNum input":function(){data.canSetNodeNums&&($("#NodeText").html($("#NodeNum").val()),computedMoney())},"#OneMemory input":function(){$("#OneMemoryText").html(computedShowMemory(computedMemory($("#OneMemory").val()))),computedMoney()}}}),$dialog=dialog.getElement();$showMoney=$dialog.find("#deployMoney"),$dialog.find("#NodeText"),$nodeNumInput=$dialog.find("#NodeNum"),$showMemory=$dialog.find("#OneMemoryText"),$memoryInput=$dialog.find("#OneMemory"),$showMemory.html(computedShowMemory(data.minMemory)),data.canSetNodeNums||form.hideInput("nodeNum"),data.showMoney||form.hideInput("money")}})},51:function(module,exports,__webpack_require__){"use strict";function noop(){}var _widget=__webpack_require__(0),_widget2=function(obj){return obj&&obj.__esModule?obj:{default:obj}}(_widget),_appApiCenter=__webpack_require__(1);_widget2.default.define("appMemoryMonthly",{_defaultOption:{tpl:"<div></div>",onSuccess:noop,onFail:noop,onCancel:noop,tenantName:"",serviceAlias:""},_init:function(option){this.callParent(option),"appMemoryMonthly"==this.ClassName&&(this._create(),this.bind())},_create:function(){this.callParent();var self=this;(0,_appApiCenter.getMemoryMonthlyInfo)(this.option.tenantName,this.option.serviceAlias).done(function(data){data.choosable?self.handleMemorySelectTimePay(data):self.handleMemoryDirectPay(data)})},handleMemorySelectTimePay:function(data){var self=this,oneMonthMoney=data.oneMonthMoney,needPay=oneMonthMoney,form=_widget2.default.create("form",{rowNum:1,items:[{label:"包月时长",type:"info",value:'<input style="display:inline-block;width:60%" type="range" min="1" max="24" step="1" id="TimeLong" value="1"><span><cite id="TimeLongText" class="text-success">1</cite>个月</span>'},{label:"费用总计",type:"info",value:'<span id="TimeLongMoney" class="text-success">'+oneMonthMoney+"</span>元"}]}),dialog=_widget2.default.create("dialog",{title:"购买内存包月",content:form.getElement(),height:"250px",btns:[{classes:"btn btn-success",text:"确认付款"},{classes:"btn btn-default btn-cancel",text:"取消"}],domEvents:{".btn-success click":function(){var monthNum=dialog.getElement().find("#TimeLong").val();(0,_appApiCenter.appMemoryMonthly)(self.option.tenantName,self.option.serviceAlias,monthNum,needPay).done(function(data){form.destroy(),dialog.destroy(),form=dialog=null,self.option.onSuccess()})},"#TimeLong input":function(){needPay=(dialog.getElement().find("#TimeLong").val()*oneMonthMoney).toFixed(2),$("#TimeLongMoney").html(needPay),$("#TimeLongText").html($("#TimeLong").val())}}})},handleMemoryDirectPay:function(data){var self=this,form=_widget2.default.create("form",{rowNum:1,items:[{label:"包月时长",type:"info",value:'<p class="the_same text-danger">内存与磁盘包月时长应保持一致，剩余时间<span class="text-success day">'+data.remainDay+'</span>天<span  class="text-success hour">'+data.remainHour+"</span>小时</p>"},{label:"费用总计",type:"info",value:'<span id="TimeLongMoney" class="text-success">'+data.toPayMoney+"</span>元"}]}),dialog=_widget2.default.create("dialog",{title:"购买内存包月",content:form.getElement(),height:"250px",btns:[{classes:"btn btn-success",text:"确认付款"},{classes:"btn btn-default btn-cancel",text:"取消"}],domEvents:{".btn-success click":function(){(0,_appApiCenter.appMemoryMonthly)(self.option.tenantName,self.option.serviceAlias).done(function(data){form.destroy(),dialog.destroy(),form=dialog=null,self.option.onSuccess()})}}})}})},52:function(module,exports,__webpack_require__){"use strict";function noop(){}var _widget=__webpack_require__(0),_widget2=function(obj){return obj&&obj.__esModule?obj:{default:obj}}(_widget),_appApiCenter=__webpack_require__(1);_widget2.default.define("appMonthlyAddTime",{_defaultOption:{tpl:"<div></div>",onSuccess:noop,onFail:noop,onCancel:noop,tenantName:"",serviceAlias:""},_init:function(option){this.callParent(option),"appMonthlyAddTime"==this.ClassName&&(this._create(),this.bind())},_create:function(){this.callParent();var self=this;(0,_appApiCenter.getAppMonthlyInfo)(self.option.tenantName,self.option.serviceAlias).done(function(data){self.showMonthlyAddTimeDialog(data)})},showMonthlyAddTimeDialog:function(data){var self=this,oneMonthMoney=data.oneMonthMoney,needPay=oneMonthMoney,form=_widget2.default.create("form",{rowNum:1,labelCol:3,items:[{label:"包月时长",type:"info",value:'<input type="range" min="1" max="24" step="1" id="TimeLong" value="1" style="display:inline-block;width:60%"><span><cite id="TimeLongText" class="text-success">1</cite>个月</span>'},{label:"费用总计",type:"info",value:'<div><span id="TimeLongMoney" class="text-success">'+oneMonthMoney+"</span>元（按所有包月项目同步增加时长计算）</div>"}]}),dialog=_widget2.default.create("dialog",{title:"增加包月时长",content:form.getElement(),height:"300px",btns:[{classes:"btn btn-success",text:"确认付款"},{classes:"btn btn-default btn-cancel",text:"取消"}],domEvents:{".btn-success click":function(){var monthNum=dialog.getElement().find("#TimeLong").val();(0,_appApiCenter.appMonthlyAddTime)(self.option.tenantName,self.option.serviceAlias,monthNum).done(function(data){form.destroy(),dialog.destroy(),form=dialog=null,self.option.onSuccess()})},"#TimeLong input":function(){needPay=(dialog.getElement().find("#TimeLong").val()*oneMonthMoney).toFixed(2),$("#TimeLongMoney").html(needPay),$("#TimeLongText").html(dialog.getElement().find("#TimeLong").val())}}})}})},56:function(module,exports,__webpack_require__){"use strict";function noop(){}var _widget=__webpack_require__(0),_widget2=function(obj){return obj&&obj.__esModule?obj:{default:obj}}(_widget);__webpack_require__(64),_widget2.default.define("monthly-time-select",{_defaultOption:{tpl:'<div class="monthly-time-select"><span data-value="1">1</span><span data-value="2">2</span><span data-value="3">3</span><span data-value="4">4</span><span data-value="5">5</span><span data-value="6">6</span><span data-value="7">7</span><span data-value="8">8</span><span data-value="9">9</span><span data-value="10">10</span><span data-value="11">11个月</span><span data-value="12">1年</span><span data-value="24">2年</span></div>',value:1,onChange:noop,disabled:!1},_init:function(option){this.callParent(option),"monthly-time-select"==this.ClassName&&(this._create(),this.bind())},_create:function(){this.callParent(),this.setValue(this.option.value||1),this.option.disabled&&this.disable()},disable:function(){this.disabled=!0,this.element.addClass("disabled")},active:function(){this.disabled=!1,this.element.removeClass("disabled")},getValue:function(){return this.value},setValue:function(value){value<=0&&(value=1),value>12&&value<24&&(value=24),value>24&&(value=24),this.value=value,this.updateDom(),this.option.onChange(this.value)},updateDom:function(){var $span=this.element.find("span"),value=this.value;$span.removeClass("active"),$span.each(function(){Number($(this).attr("data-value"))<=value&&$(this).addClass("active")})},bind:function(){var self=this;this.element.delegate("span","click",function(){if(!self.disabled){var val=Number($(this).attr("data-value"));self.value!==val&&self.setValue(val)}})}})},58:function(module,exports,__webpack_require__){"use strict";function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(exports,"__esModule",{value:!0});var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){return protoProps&&defineProperties(Constructor.prototype,protoProps),staticProps&&defineProperties(Constructor,staticProps),Constructor}}(),PayAppADT=function(){function PayAppADT(app){_classCallCheck(this,PayAppADT),this.app=app||{}}return _createClass(PayAppADT,[{key:"getAppId",value:function(){return this.app.service_id||""}},{key:"getTenantId",value:function(){return this.app.tenant_id||""}},{key:"getAppName",value:function(){return this.app.service_cname||""}},{key:"getTenantName",value:function(){return this.app.tenant_name||""}},{key:"getAppAlias",value:function(){return this.app.service_alias||""}},{key:"isMemoryPayed",value:function(){return"prepaid"===this.app.memory_pay_method}},{key:"isDiskPayed",value:function(){return"prepaid"===this.app.disk_pay_method}},{key:"canAddMemoryDate",value:function(){return this.isMemoryPayed()}},{key:"canAddDiskDate",value:function(){return this.isDiskPayed()}},{key:"canAddMemorySize",value:function(){return this.isMemoryPayed()}},{key:"canAddDiskSize",value:function(){return!1}},{key:"getTotalMemory",value:function(unit){var memory=this.getNodeNum()*this.getNodeMemory();return!0===unit?memory+"M":memory}},{key:"getDisk",value:function(unit){var disk=this.app.disk||0;return disk%1024>0?disk=Math.round(disk/1024,2):disk/=1024,!0===unit?disk+"G":disk}},{key:"getNodeNum",value:function(){return this.app.min_node||0}},{key:"getNodeMemory",value:function(unit){var memory=this.app.min_memory||0;return!0===unit?memory+"M":memory}},{key:"getMemoryUnit",value:function(){return"M"}},{key:"getDiskUnit",value:function(){return"G"}},{key:"getEndDate",value:function(){return this.app.buy_end_time.split(" ")[0]}},{key:"getEndDateTime",value:function(){return this.app.buy_end_time}}]),PayAppADT}();exports.default=PayAppADT},61:function(module,exports,__webpack_require__){exports=module.exports=__webpack_require__(11)(void 0),exports.push([module.i,".monthly-time-select {border-radius:4px;height:30px;line-height: 30px;border:1px solid #4cae4c;border-right:none;display: inline-block;}\n.monthly-time-select span {display: inline-block;height:100%;padding:0 5px;min-width:30px;cursor:pointer;text-align: center;color:#555;background:#fff;border-right: 1px solid #4cae4c;}\n.monthly-time-select span.active {background:#5cb85c;color:#fff;border-right: 1px solid #4cae4c;}",""])},62:function(module,exports,__webpack_require__){exports=module.exports=__webpack_require__(11)(void 0),exports.push([module.i,".pay-renew-form {display: none;}\n.pay-renew-form .control-label {width:105px!important;}\n\n/* 已包月提示图标样式 */\n.status-tip{\n\tborder: 1px solid #e16e3c;\n    color: #e16e3c;\n    border-radius: 2px;\n    display: inline-block;\n    padding: 2px;\n    font-size: 12px;\n    line-height: 1em;\n    vertical-align: middle;\n}\n",""])},64:function(module,exports,__webpack_require__){var content=__webpack_require__(61);"string"==typeof content&&(content=[[module.i,content,""]]);var options={};options.transform=void 0;__webpack_require__(13)(content,options);content.locals&&(module.exports=content.locals)},65:function(module,exports,__webpack_require__){var content=__webpack_require__(62);"string"==typeof content&&(content=[[module.i,content,""]]);var options={};options.transform=void 0;__webpack_require__(13)(content,options);content.locals&&(module.exports=content.locals)},78:function(module,exports,__webpack_require__){module.exports=__webpack_require__(28)}},[78]);