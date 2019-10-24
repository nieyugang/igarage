layui.define(['table', 'jquery', 'form'], function (exports) {
    "use strict";

    var MOD_NAME = 'tableSelect',
        $ = layui.jquery,
        table = layui.table,
        form = layui.form;
    var tableInfo;
    var tableSelect = function () {
        this.v = tableInfo;
    };

    /**
    * 初始化表格选择器
    */
    tableSelect.prototype.render = function (opt) {
        var elem = $(opt.elem);
        var tableDone = opt.table.done || function(){};
		
        //默认设置
        // opt.searchKey = opt.searchKey || 'keyword';
        // opt.searchPlaceholder = opt.searchPlaceholder || '关键词搜索';
        opt.checkedKey = opt.checkedKey;
        opt.table.page = opt.table.page || true;
        opt.table.height = opt.table.height || 315;

        elem.off('click').on('click', function(e) {
            e.stopPropagation();

            if($('div.tableSelect').length >= 1){
                return false;
            }

            var t = elem.offset().top + elem.outerHeight()+"px";
            var l = elem.offset().left +"px";
            var tableName = "tableSelect_table_" + new Date().getTime();
            var tableBox = '<div class="tableSelect layui-anim layui-anim-upbit" style="left:'+l+';top:'+t+';border: 1px solid #d2d2d2;background-color: #fff;box-shadow: 0 2px 4px rgba(0,0,0,.12);padding:10px 10px 0 10px;position: absolute;z-index:66666666;margin: 5px 0;border-radius: 2px;width:530px;">';
                tableBox += '<div class="tableSelectBar">';
                // tableBox += '<form class="layui-form" action="" style="display:inline-block;">';
                // tableBox += '<input style="display:inline-block;width:190px;height:30px;vertical-align:middle;margin-right:-1px;border: 1px solid #C9C9C9;" type="text" name="'+opt.searchKey+'" placeholder="'+opt.searchPlaceholder+'" autocomplete="off" class="layui-input"><button class="layui-btn layui-btn-sm layui-btn-primary tableSelect_btn_search" lay-submit lay-filter="tableSelect_btn_search"><i class="layui-icon layui-icon-search"></i></button>';
                // tableBox += '</form>';
                // tableBox += '<button style="float:right;" class="layui-btn layui-btn-sm tableSelect_btn_select">选择<span></span></button>';
                tableBox += '</div>';
                tableBox += '<table id="'+tableName+'" lay-filter="'+tableName+'"></table>';
                tableBox += '</div>';
                tableBox = $(tableBox);
            $('body').append(tableBox);

            //数据缓存
            var checkedData = [];

            //渲染TABLE
            opt.table.elem = "#"+tableName;
            opt.table.id = tableName;
            opt.table.done = function(res, curr, count){
                defaultChecked(res, curr, count);
                tableDone(res, curr, count);
            };
            var tableSelect_table = table.render(opt.table);
            tableInfo = opt.table;
            //分页选中保存数组
            table.on('radio('+tableName+')', function(obj){
                if(opt.checkedKey){
                    checkedData = table.checkStatus(tableName).data
                }
            })

            //写入默认选中值(puash checkedData)
            function defaultChecked (res, curr, count){

            }


			//FIX位置
			var overHeight = (elem.offset().top + elem.outerHeight() + tableBox.outerHeight() - $(window).scrollTop()) > $(window).height();
			var overWidth = (elem.offset().left + tableBox.outerWidth()) > $(window).width();
			    overHeight && tableBox.css({'top':'auto','bottom':'0px'});
			    overWidth && tableBox.css({'left':'auto','right':'5px'})

            //双击行选中
            table.on('row('+tableName+')', function(obj){
                var checkStatus = {data:[obj.data]};
                selectDone(checkStatus);
            })

            //写值回调和关闭
            function selectDone (checkStatus){
                if(opt.checkedKey){
                    var selected = [];
                    for(var i=0;i<checkStatus.data.length;i++){
                        selected.push(checkStatus.data[i].garageName)
                    }
                    $(elem).val(selected);
                }
                opt.done(elem, checkStatus);
                tableBox.remove();
                delete table.cache[tableName];
                checkedData = [];
            }

            //点击其他区域关闭
            $(document).mouseup(function(e){
                var userSet_con = $(''+opt.elem+',.tableSelect');
                if(!userSet_con.is(e.target) && userSet_con.has(e.target).length === 0){
                    tableBox.remove();
                    delete table.cache[tableName];
                    checkedData = [];
                }
            });
        })
    }

    /**
    * 隐藏选择器
    */
    tableSelect.prototype.hide = function (opt) {
        $('.tableSelect').remove();
    }

    //自动完成渲染
    var tableSelect = new tableSelect();

    //FIX 滚动时错位
    if(window.top == window.self){
        $(window).scroll(function () {
            tableSelect.hide();
        });
    }

    exports(MOD_NAME, tableSelect);
})
