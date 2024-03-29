var backServiceUrl = "/hqigservice/";
/**
 * 所有通过ajax请求的处理
 */
jQuery(document).ajaxStart(ajaxStart)
    .ajaxSend(ajaxSend)
    .ajaxComplete(ajaxComplete)
    .ajaxError(ajaxError);

/**
 * 显示loading
 */
function ajaxStart() {};

function ajaxSend(event, jqXHR, options) {
    var data;
    if (options.data == null || options.data == '') {
        data = {};
    } else {
        data = JSON.parse(options.data);
    }
    data.userInfo = userInfo;
    options.data = JSON.stringify(data);
};

/**
 * ajax结束后的处理
 */
function ajaxComplete(event, xhr, settings) {
    if (xhr) {
        if (xhr.responseJSON) {
            if (xhr.responseJSON.resFlag === "E") {
                if (xhr.responseJSON.resCode === "USER0002") { //用户会话超时，请重新登录
                    layer.open({
                        title: '异常警告',
                        closeBtn: 0,
                        icon: 5,
                        id: 'lay-login', //设定一个id，防止重复弹出
                        anim: 6,
                        content: xhr.responseJSON.resMsg,
                        yes: function (layero) {
                            layui.sessionData('userInfoStorage', null); //删除userInfoStorage
                            layui.sessionData('menuInfoStorage', null);
                            parent.location.href = window.location.origin + "/login.html";
                        }
                    });
                } else {
                    layer.open({
                        title: '异常警告',
                        closeBtn: 0,
                        id: 'lay-error', //设定一个id，防止重复弹出
                        icon: 5,
                        anim: 6,
                        content: xhr.responseJSON.resMsg,
                    });
                }
            }
        }
    }
};

/**
 * ajax错误处理
 * @param e
 * @param jqxhr
 * @param settings
 * @param exception
 */
function ajaxError(e, jqxhr, settings, exception) {
    if ("abort" == exception) { //创客端中断请求错误忽略
        return;
    }
    var response;
    try {
        response = jQuery.parseJSON(jqxhr.responseText);
    } catch (e) {

    }
    if (!response) {
        try {
            var responseText = jqxhr.responseText.substring(2);
            response = jQuery.parseJSON(responseText);
        } catch (e) {

        }
    }
    if (!response) {
        layer.open({
            title: '异常警告',
            closeBtn: 0,
            icon: 5,
            anim: 6,
            content: "请将浏览器刷新后重试，如出现重复错误请联系管理员",
            yes: function (layero) {
                layer.closeAll();
            }
        });
    } else {}
};

/**
 *
 *
 * @param {*} table layui table　模块
 * @param {*} title 定义 table 的大标题（在文件导出等地方会用到）
 * @param {*} elem table的ID
 * @param {*} limit　每页的行数
 * @param {*} url　请求url
 * @param {*} where 查询字段
 * @param {*} parseData 解析返回数据
 * @param {*} cols table的字段
 * @param {*} toolbar 表头工具栏 不显示表头传false。详情见https://www.layui.com/doc/modules/table.html#options
 * @param {*} done table加载完成执行的js
 * @returns
 */
function initTable(table, title, elem, limit, url, where, parseData, cols, toolbar, done, height) {
    return table.render({
        title: title == "" ? "列表信息" : title,
        elem: '#' + elem,

        method: 'POST',
        contentType: 'application/json',
        limit: limit,
        limits: [20, 50, 100],
        url: backServiceUrl + url,
        where: where,
        parseData: parseData,
        request: {
            pageName: 'pageNo', //页码的参数名称，默认：page
            limitName: 'pageSize' //每页数据量的参数名，默认：limit
        },
        page: true,
        cols: cols,
        toolbar: toolbar == "" ? false : toolbar,
        done: done
    });
};

function initNotPageTable(table, elem, url, where, parseData, cols, done) {
    return table.render({
        elem: '#' + elem,
        height: 'full-300',
        method: 'POST',
        url: backServiceUrl + url,
        where: where,
        contentType: 'application/json',
        cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
            ,
        parseData: parseData,
        cols: cols,
        page: false,
        done: done
    });
};

/**
 *table的relaod
 *
 * @param {*} table layui Table 模块
 * @param {*} where 查询字段
 */
function tableReload(table, where) {
    table.reload({
        where: where //设定异步数据接口的额外参数
            ,
        page: {
            curr: 1 //重新从第 1 页开始
        }
    });
};

function noPageTableReload(table, where) {
    table.reload({
        where: where
    });
};

/**
 *初始化Tree
 * @param {*} ztree layui Tree组件
 * @param {*} elem 指向容器选择器
 * @param {*} url　请求url
 * @param {*} where 数据源
 * @param {*} clickOrg 节点被点击回调
 * @param {*} operateOrg 操作节点回调
 * @param {*} edit ['add','update','del']
 * @returns
 */
function initTree(ztree, elem, url, where, clickOrg, operateOrg, edit) {
    var nodes = [];
    sendAjaxRequest("POST", url, "json", where, getOrgTreeSuccess, getOrgTreeError);

    function getOrgTreeSuccess(res) {
        if (res.resFlag == "N") {
            //处理返回数据
            var orgTreeInfo = res.orgTreeInfo; // 顶层节点
            var childrens;
            childrens = getTreeJson(orgTreeInfo.childOrgList);
            var root_node = {
                "id": orgTreeInfo.orgId,
                "title": orgTreeInfo.orgName,
                "spread": true,
                "children": childrens
            }; // 存放tree数据
            nodes.push(root_node);
            //渲染tree
            ztree.render({
                id: elem,
                elem: elem,
                data: nodes,
                showLine: false, //是否开启连接线
                onlyIconControl: true, //是否仅允许节点左侧图标控制展开收缩
                click: clickOrg,
                edit: edit,
                operate: operateOrg
            });
        }
    };

    function getOrgTreeError() {
        layer.msg("网络通信异常", {
            icon: 2
        });
    };

    /**
     *递归重组返回的组织树
     * @param {*} childrens
     * @returns
     */
    function getTreeJson(childrens) {
        var child_node = [];
        for (var i in childrens) {
            if (childrens.hasOwnProperty(i)) {
                var node = {
                    "id": childrens[i].orgId,
                    "title": childrens[i].orgName,
                    // "spread": true,
                    "level": childrens[i].orgLevel
                }; // 存放tree数据
                var childrens_node = childrens[i].childOrgList;
                if (childrens_node != 0) {
                    var son = getTreeJson(childrens_node);
                    node.children = son;
                }
                child_node.push(node);
            }
        }
        return child_node;
    };
    return nodes;
}

/**
 * 封装ajax方法
 * @param type 类型
 * @param url 路径 post，get
 * @param dataType 返回类型
 * @param data 参数
 * @param successCallback 成功事件
 * @param errorCallback 失败事件
 */
function sendAjaxRequest(type, url, dataType, data, successCallback, errorCallback) {
    $.ajax({
        type: type,
        url: backServiceUrl + url,
        contentType: "application/json",
        dataType: dataType,
        data: data,
        success: successCallback,
        error: errorCallback
    })
};

/**
 *
 *通用删除方法
 * @param {*} url 后台服务接口地址
 * @param {*} data 请求参数
 * @param {*} tableIns 实例化的table
 */
function sendDelRequest(url, data, tableIns) {
    layer.confirm('确定删除吗？', function (index) {
        sendAjaxRequest("POST", url, "json", data, getOrgTreeSuccess, getOrgTreeError);

        function getOrgTreeSuccess(res) {
            if (res.resFlag == "N") {
                layer.msg('操作成功', {
                    icon: 1
                });
                setTimeout(function () {
                    tableReload(tableIns)
                }, 2000);

            }
        };

        function getOrgTreeError() {
            layer.msg("网络通信异常", {
                icon: 2
            });
        };
    });
};

/**
 *通用form提交方法 默认post 提交
 * @param {*} url 请求url
 * @param {*} data form表单数据
 */
function sendSubmitRequest(url, data) {
    sendAjaxRequest("POST", url, "json", data, successCallback, errorCallback);

    function successCallback(res) {
        if (res.resFlag == "N") {
            layer.msg('操作成功', {
                icon: 1
            });
            setTimeout(function () {
                window.parent.layer.closeAll(); //关闭弹窗
            }, 3000);
        }
    };

    function errorCallback() {
        layer.msg('通信异常', {
            icon: 2
        });
    };
};

$.fn.serializeObject = function () {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function () {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
//获取url中"?"符后的字串'./userAdd.html?orgId='+node_id,  例如：var orgId= RequestParameter()[orgId]
function RequestParameter() {
    var url = window.location.search;
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theRequest[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
        }
    }
    return theRequest
}