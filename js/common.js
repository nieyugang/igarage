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
function ajaxStart() {
}

function ajaxSend(event, jqXHR, options) {
    var data;
    if (options.data == null || options.data == '') {
        data = {};
    } else {
        data = JSON.parse(options.data);
    }
    data.userInfo = {
        "userId": 1,
        "userName": "许明",
        "sessionId": "123456"
    };
    options.data = JSON.stringify(data);
}

/**
 * 隐藏loading
 */
function ajaxComplete(event, xhr, settings) {
}

/**
 * ajax错误处理
 * @param e
 * @param jqxhr
 * @param settings
 * @param exception
 */
function ajaxError(e, jqxhr, settings, exception) {
    if ("abort" == exception) {//创客端中断请求错误忽略
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
        $.gritter.add({text: "请将浏览器刷新后重试，如出现重复错误请联系管理员", class_name: "gritter-warning gritter-light"});
    } else {
    }
}

function getBaseUrl() {
    if (window.baseUrl) {
        return window.baseUrl;
    } else if (parent.window.baseUrl) {
        return parent.window.baseUrl;
    } else if (parent.parent.window.baseUrl) {
        return parent.parent.window.baseUrl;
    }
}

function initTable(table, elem, limit, url, where, parseData, cols, done) {
    return table.render({
        title: '车位类型表',
        elem: '#' + elem,
        height: 'full-300',
        method: 'POST',
        contentType: 'application/json',
        limit: limit,
        limits: [20, 50, 100],
        url: getBaseUrl() + url,
        where: where,
        parseData: parseData,
        request: {
            pageName: 'pageNo' //页码的参数名称，默认：page
            , limitName: 'pageSize' //每页数据量的参数名，默认：limit
        },
        page: true,
        cols: cols,
        done: done
    });
}

function initNotPageTable(table, elem, url, where, parseData, cols) {
    return table.render({
        elem: '#' + elem
        , height: 'full-300'
        , method: 'POST'
        , url: getBaseUrl() + url
        , where: where
        , contentType: 'application/json'
        , cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
        , parseData: parseData
        , cols: cols
        ,page: false
    });
}

function tableReload(table, where) {
    table.reload({
        where: where //设定异步数据接口的额外参数
        , page: {
            curr: 1 //重新从第 1 页开始
        }
    });
}

function noPageTableReload(table, where) {
    table.reload({
        where: where
    });
}

function initTree(ztree, elem, url, where, clickOrg) {
    var nodes = [];
    sendAjaxRequest("POST", url, "json", where, getOrgTreeSuccess, getOrgTreeError);

    function getOrgTreeSuccess(res) {
        //处理返回数据
        var orgTreeInfo = res.orgTreeInfo;// 顶层节点
        var childrens;
        childrens = getTreeJson(orgTreeInfo.childOrgList);
        var root_node = {
            "id": orgTreeInfo.orgId,
            "title": orgTreeInfo.orgName,
            "spread": true,
            "children": childrens
        };// 存放tree数据
        nodes.push(root_node);
        //渲染tree
        ztree.render({
            elem: elem
            , data: nodes
            , onlyIconControl: true  //是否仅允许节点左侧图标控制展开收缩
            , click: clickOrg
        });
    }

    function getOrgTreeError() {
        layer.msg("操作失败");
    }

    // js 递归返回的组织树
    function getTreeJson(childrens) {
        var child_node = [];
        for (var i in childrens) {
            var node = {
                "id": childrens[i].orgId,
                "title": childrens[i].orgName,
                "spread": true,
                "level": childrens[i].orgLevel
            };// 存放tree数据
            var childrens_node = childrens[i].childOrgList;
            if (childrens_node != 0) {
                var son = getTreeJson(childrens_node);
                node.children = son;
            }
            child_node.push(node);
        }
        return child_node;
    }
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
        url: getBaseUrl() + url,
        contentType: "application/json",
        dataType: dataType,
        data: data,
        success: successCallback,
        error: errorCallback
    })
}

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
}
