layui.use(["element", "layer"], function () {
  var layer = layui.layer;
  /**
   * 页面加载时检查是否登陆
   */

  var userInfoStorage = layui.sessionData('userInfoStorage').userInfo;
  if (userInfoStorage == null || userInfoStorage == undefined || userInfoStorage == "") {
    location.href = "./login.html";
  } else {
    location.href = "#";
  }

  /**
   *退出
   */
  $("#logout").on("click", function () {
    //删除userInfoStorage
    layui.sessionData('userInfoStorage', null);
    layui.sessionData('menuInfoStorage', null);
    location.href = "../login.html";
  });

  /**
   * 动态展示 managerTit
   */
  userInfoStorage = JSON.parse(userInfoStorage);
  var userId =userInfoStorage.userId;
  $("#managerTit h1").html(userInfoStorage.userName);

  now = new Date(), hour = now.getHours()
  if (hour < 6) {
    $("#managerTit p").html("凌晨好！")
  } else if (hour < 9) {
    $("#managerTit p").html("早上好！")
  } else if (hour < 12) {
    $("#managerTit p").html("上午好！")
  } else if (hour < 14) {
    $("#managerTit p").html("中午好！")
  } else if (hour < 17) {
    $("#managerTit p").html("下午好！")
  } else if (hour < 19) {
    $("#managerTit p").html("傍晚好！")
  } else if (hour < 22) {
    $("#managerTit p").html("晚上好！")
  } else {
    $("#managerTit p").html("夜里好！")
  }

  /**
   * 个人信息
   */
  $("#myInfo").bind("click", function () {
    layer.open({
      type: 2,
      title: false,
      anim: 1,
      area: ['700px', '600px'],
      content: '/html/config/myInformation.html?userId=' + userId,
    });
  });
  /**
   * 修改密码
   */
  $("#changePwd").bind("click", function () {
    layer.open({
      type: 2,
      title: false,
      anim: 1,
      area: ['780px', '300px'],
      content: '/html/config/changePwd.html?userId=' + userId,
    });
  });
  /**
   * 开启提醒
   */
  $("#remind").bind("click", function () {
    layer.msg("还没做好哎！", function () {});
  });

  // ------------------------------------------------------- //
  // Search Box
  // ------------------------------------------------------ //
  $("#search").on("click", function (e) {
    e.preventDefault();
    $(".search-box").fadeIn();
  });
  $(".dismiss").on("click", function () {
    $(".search-box").fadeOut();
  });

  // ------------------------------------------------------- //
  // Card Close
  // ------------------------------------------------------ //
  $(".card-close a.remove").on("click", function (e) {
    e.preventDefault();
    $(this)
      .parents(".card")
      .fadeOut();
  });

  // ------------------------------------------------------- //
  // Tooltips init
  // ------------------------------------------------------ //
  $('[data-toggle="tooltip"]').tooltip();

  // ------------------------------------------------------- //
  // Adding fade effect to dropdowns
  // ------------------------------------------------------ //
  $(".dropdown").on("show.bs.dropdown", function () {
    $(this)
      .find(".dropdown-menu")
      .first()
      .stop(true, true)
      .fadeIn();
  });
  $(".dropdown").on("hide.bs.dropdown", function () {
    $(this)
      .find(".dropdown-menu")
      .first()
      .stop(true, true)
      .fadeOut();
  });

  // ------------------------------------------------------- //
  // Sidebar Functionality
  // ------------------------------------------------------ //
  $("#toggle-btn").on("click", function (e) {
    e.preventDefault();
    $(this).toggleClass("active");

    $(".side-navbar").toggleClass("shrinked");
    $(".content-inner").toggleClass("active");
    $(document).trigger("sidebarChanged");

    if ($(window).outerWidth() > 1183) {
      if ($("#toggle-btn").hasClass("active")) {
        $(".navbar-header .brand-small").hide();
        $(".navbar-header .brand-big").show();
      } else {
        $(".navbar-header .brand-small").show();
        $(".navbar-header .brand-big").hide();
      }
    }

    if ($(window).outerWidth() < 1183) {
      $(".navbar-header .brand-small").show();
    }
  });

  // ------------------------------------------------------- //
  // Universal Form Validation
  // ------------------------------------------------------ //
  $(".form-validate").each(function () {
    $(this).validate({
      errorElement: "div",
      errorClass: "is-invalid",
      validClass: "is-valid",
      ignore: ":hidden:not(.summernote, .checkbox-template, .form-control-custom),.note-editable.card-block",
      errorPlacement: function (error, element) {
        // Add the `invalid-feedback` class to the error element
        error.addClass("invalid-feedback");
        console.log(element);
        if (element.prop("type") === "checkbox") {
          error.insertAfter(element.siblings("label"));
        } else {
          error.insertAfter(element);
        }
      }
    });
  });

  // ------------------------------------------------------- //
  // Material Inputs
  // ------------------------------------------------------ //
  var materialInputs = $("input.input-material");

  // activate labels for prefilled values
  materialInputs
    .filter(function () {
      return $(this).val() !== "";
    })
    .siblings(".label-material")
    .addClass("active");

  // move label on focus
  materialInputs.on("focus", function () {
    $(this)
      .siblings(".label-material")
      .addClass("active");
  });

  // remove/keep label on blur
  materialInputs.on("blur", function () {
    $(this)
      .siblings(".label-material")
      .removeClass("active");

    if ($(this).val() !== "") {
      $(this)
        .siblings(".label-material")
        .addClass("active");
    } else {
      $(this)
        .siblings(".label-material")
        .removeClass("active");
    }
  });

  // ------------------------------------------------------- //
  // Footer
  // ------------------------------------------------------ //
  var contentInner = $(".content-inner");
  $(document).on("sidebarChanged", function () {
    adjustFooter();
  });
  $(window).on("resize", function () {
    adjustFooter();
  });

  function adjustFooter() {
    var footerBlockHeight = $(".main-footer").outerHeight();
    contentInner.css("padding-bottom", footerBlockHeight + "px");
  }

  // ------------------------------------------------------ //
  // 设置侧边栏登录信息 客户头像点击，弹框资料密码提醒控制功能
  // ------------------------------------------------------ //
  var timerTitShow;
  var timerTitHide;
  $("#personalPopverA").on("click", function () {
    if (!$("#personalPopverList").hasClass("show")) {
      if (timerTitShow) {
        clearTimeout(timerTitShow);
      }
      if (
        !$(".managerTit").hasClass("managerTitHide") &&
        !$(".side-navbar").hasClass("shrinked")
      ) {
        $(".managerTit").addClass("managerTitHide");
        $(".managerTit").hide();
      }
    } else {
      if (timerTitHide) {
        clearTimeout(timerTitHide);
      }
      if (
        $(".managerTit").hasClass("managerTitHide") &&
        !$(".side-navbar").hasClass("shrinked")
      ) {
        timerTitShow = setTimeout(function () {
          $(".managerTit").removeClass("managerTitHide");
          $(".managerTit").show();
        }, 200);
      }
    }
  });
  $("#personalPopverLists").on("hide.bs.dropdown", function () {
    if (timerTitShow) {
      clearTimeout(timerTitShow);
    }
    if (
      $(".managerTit").hasClass("managerTitHide") &&
      !$(".side-navbar").hasClass("shrinked")
    ) {
      timerTitHide = setTimeout(function () {
        $(".managerTit").removeClass("managerTitHide");
        $(".managerTit").show();
      }, 200);
    }
  });
  $("#_slideMenuToggle_ #toggle-btn").on("click", function () {
    //console.log($(".side-navbar").hasClass("shrinked"))
    if ($(".side-navbar").hasClass("shrinked")) {
      //侧边栏合并
      if (!$(".managerTit").hasClass("managerTitHide")) {
        $(".managerTit").addClass("managerTitHide");
        $(".managerTit").hide();
      }
      if ($("#hx-slideMenu").hasClass("hx-slideMenuTitPadding")) {
        $("#hx-slideMenu").removeClass("hx-slideMenuTitPadding");
      }
    } else {
      //侧边栏展开
      if ($(".managerTit").hasClass("managerTitHide")) {
        $(".managerTit").removeClass("managerTitHide");
        $(".managerTit").show();
      }
      if (!$("#hx-slideMenu").hasClass("hx-slideMenuTitPadding")) {
        $("#hx-slideMenu").addClass("hx-slideMenuTitPadding");
      }
    }
  });

  // ------------------------------------------------------ //
  // 设置主题
  // ------------------------------------------------------ //
  var stylesheet = $("link#theme-stylesheet");
  if (getCookie("theme_csspath")) {
    stylesheet.attr("href", "css/style." + getCookie("theme_csspath") + ".css");
  }
  $("#selfDefiningTheme ul li").on("click", function () {
    if ($(this).attr("data-settheme") !== "") {
      var theme_csspath = "css/style." + $(this).attr("data-settheme") + ".css";
      stylesheet.attr("href", theme_csspath);
      setCookie("theme_csspath", $(this).attr("data-settheme"), 365);
      //动态为iframe设置主题色
      for (var i = 0; i < $(".layui-tab-item").length; i++) {
        var aChildWindow = $(".layui-tab-item")[i].children[0];
        if (aChildWindow) {
          if (aChildWindow.tagName === "IFRAME") {
            aChildWindow.contentWindow.setThemeSetCss();
          }
        }
      }
    }
  });



  // ------------------------------------------------------ //
  // 每隔60s发送ajax交易获取设备预警和站内信
  // ------------------------------------------------------ //
  var getTopBarMessageData = function () {
    $.getJSON("mock/alert-mail-data.json", function (res) {
      if (res.resFlag === "N") {
        console.log("局部刷新设备预警和站内信");
        var topbarData = res;
        // 警告信息
        var _alert_dom_html_ = "";
        for (var i = 0; i < topbarData.alert.data.length; i++) {
          _alert_dom_html_ =
            _alert_dom_html_ +
            '<li><a rel="nofollow" href="javascript:void(0);" class="dropdown-item"><div class="notification"><div class="notification-content"><i class="' +
            topbarData.alert.data[i].type +
            '"></i>' +
            topbarData.alert.data[i].message +
            '</div><div class="notification-time"><small>' +
            topbarData.alert.data[i].time +
            "</small></div></div></a></li>";
        }
        _alert_dom_html_ =
          '<a id="notifications" rel="nofollow" data-target="#" href="javascript:void(0);" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="nav-link"><i class="fa fa-bell-o"></i><span class="badge bg-red badge-corner">' +
          topbarData.alert.total +
          '</span></a><ul aria-labelledby="notifications" class="dropdown-menu">' +
          _alert_dom_html_ +
          '<li><a rel="nofollow" id="_readall_alert_" data-name="设备预警" lay-href="work/alert.html" data-change="tabChange" data-add="tabAdd" href="javascript:void(0);" class="dropdown-item all-notifications text-center"><strong>查看所有报警</strong></a></li></ul>';
        $("#_topbar_alert_").html(_alert_dom_html_);

        // 站内信
        var _mail_dom_html_ = "";
        for (var i = 0; i < topbarData.mail.data.length; i++) {
          _mail_dom_html_ =
            _mail_dom_html_ +
            '<li><a rel="nofollow" href="javascript:void(0);" class="dropdown-item d-flex"><div class="msg-profile"><img src="' +
            topbarData.mail.data[i].avatar +
            '" alt="..." class="img-fluid rounded-circle"></div><div class="msg-body"><h3 class="h5">' +
            topbarData.mail.data[i].name +
            "</h3><span>来信</span></div></a></li>";
        }
        _mail_dom_html_ =
          '<a id="messages" rel="nofollow" data-target="#" href="javascript:void(0);" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="nav-link"><i class="fa fa-envelope-o"></i><span class="badge bg-orange badge-corner">' +
          topbarData.mail.total +
          '</span></a><ul aria-labelledby="notifications" class="dropdown-menu">' +
          _mail_dom_html_ +
          '<li><a rel="nofollow" id="_readall_mail_" data-name="站内信" lay-href="work/mail.html" data-change="tabChange" data-add="tabAdd" href="javascript:void(0);" class="dropdown-item all-notifications text-center"><strong>查看所有来信</strong></a></li>';
        $("#_topbar_mail_").html(_mail_dom_html_);
      }
    });
  };
  getTopBarMessageData();
  timeId = setInterval(getTopBarMessageData, 60000);

  // ------------------------------------------------------ //
  // iframe tab标签页
  // ------------------------------------------------------ //
  var element = layui.element; //Tab的切换功能，切换事件监听等，需要依赖element模块
  //触发事件
  var active = {
    tabAdd: function (e) {
      var siderBarName = e[0].innerHTML;
      siderBarName = /<[^>]+>/g.test(siderBarName) ?
        e[0].getAttribute("data-name") :
        siderBarName;
      var siderBarID = e[0].getAttribute("lay-href");
      //新增一个Tab项
      element.tabAdd("_tab_iframe_", {
        title: siderBarName,
        content: createFrame("html/" + siderBarID),
        id: siderBarID
      });
      //每次新增Tab项，就重新对Tab栏每个tab项绑定，对应侧边栏对应标题改变颜色的方法
      changeSlideMenuColor();
    },
    tabChange: function (e) {
      var siderBarID = e[0].getAttribute("lay-href");
      //切换到指定Tab项
      element.tabChange("_tab_iframe_", siderBarID);
    }
  };

  // 侧边栏 添加 与 切换
  $("#hx-slideMenu").on("click", ".hx-sidebar-active", function (e) {
    _add_ifram_tab_.call(this, null);
  });

  // 头部 站内信 警告信息 添加与切换
  $("#_topbar_alert_").on("click", "#_readall_alert_", function () {
    _add_ifram_tab_.call(this, "alert");
  });
  $("#_topbar_mail_").on("click", "#_readall_mail_", function () {
    _add_ifram_tab_.call(this, "mail");
  });
  // type: null 侧边栏点击 alert 警告信息点击 mail 站内信点击
  function _add_ifram_tab_(type) {
    var othis = $(this);
    var add = othis.data("add");
    var change = othis.data("change");
    var _tab_layid = [];
    for (var i = 0; i < $(".layui-tab-title li").length; i++) {
      _tab_layid.push($(".layui-tab-title li")[i].getAttribute("lay-id"));
    }
    if (_tab_layid.indexOf(othis.attr("lay-href")) === -1) {
      active[add] ? active[add].call(this, othis) : "";
      active[change] ? active[change].call(this, othis) : "";
    } else {
      active[change] ? active[change].call(this, othis) : "";
    }
    // 站内信 警告信息 添加与切换时，同步侧边栏
    if (type) {
      var layId = othis.attr("lay-href");
      var navMenuBar = $("#hx-slideMenu .list-unstyled li");
      for (var j = 0; j < navMenuBar.length; j++) {
        if (navMenuBar[j].getAttribute("attr") !== layId) {
          $(navMenuBar[j]).removeClass("active");
        } else {
          $(navMenuBar[j]).addClass("active");
          var toggleA = $(navMenuBar[j])
            .parents("ul")
            .siblings("a");
          $(toggleA).attr("aria-expanded", "true");
          $(toggleA).attr("class", "");
          var toggleUl = $(navMenuBar[j]).parents("ul");
          $(toggleUl).attr("class", "list-unstyled collapse show");
          /* -----点击站内信 警告信息 侧边栏锚点定位----- */
          navMenuBar[j].scrollIntoView(false)
          /* ------------------------------- */
          /* -----点击站内信 警告信息  显示侧边栏滚动条----- */
          hx_setScrollHeight()
          hx_onScroll()
        }
      }
    }
  }

  // 动态添加iframe
  var createFrame = function (url) {
    var iframe =
      '<iframe scrolling="auto" frameborder="0" src="' +
      url +
      '" style="width: 100%;height: 100%;display: block;"></iframe>';
    return iframe;
  };

  //内容区域tab标题栏 切换 更改对应的slidMenu 颜色
  function changeSlideMenuColor() {
    var layUiTabTits = $(".layui-tab-title li");
    for (var i = 0; i < layUiTabTits.length; i++) {
      layUiTabTits[i].onclick = (function () {
        return function (e) {
          console.log($(e.target).attr("lay-id"));

          if (!$(e.target).is(".layui-tab-close")) {
            var layId = this.getAttribute("lay-id");
            var navMenuBar = $("#hx-slideMenu .list-unstyled li");
            for (var j = 0; j < navMenuBar.length; j++) {
              if (navMenuBar[j].getAttribute("attr") !== layId) {
                $(navMenuBar[j]).removeClass("active");
              } else {
                //此标题变色，菜单展开
                $(navMenuBar[j]).addClass("active");
                var toggleA = $(navMenuBar[j])
                  .parents("ul")
                  .siblings("a");
                $(toggleA).attr("aria-expanded", "true");
                $(toggleA).attr("class", "");
                var toggleUl = $(navMenuBar[j]).parents("ul");
                $(toggleUl).attr("class", "list-unstyled collapse show");
                /* -----点击tab 侧边栏锚点定位----- */
                navMenuBar[j].scrollIntoView(false)
                /* ------------------------------- */
                /* -----点击tab 显示侧边栏滚动条----- */
                hx_setScrollHeight()
              }
            }
          }
        };
      })();
    }
  }

  //内容区域tab标题栏 删除 更改对应的slidMenu 颜色
  $(".layui-tab").on("click", function (e) {
    var navMenuBar = $("#hx-slideMenu .list-unstyled li");
    if ($(e.target).is(".layui-tab-close")) {
      var targetLayId = $(".layui-tab-title .layui-this").attr("lay-id");
      for (var j = 0; j < navMenuBar.length; j++) {
        if (navMenuBar[j].getAttribute("data-type") !== "D") {
          if (navMenuBar[j].getAttribute("attr") !== targetLayId) {
            $(navMenuBar[j]).removeClass("active");
          } else {
            // console.log(navMenuBar[j]);
            $(navMenuBar[j]).addClass("active");
            var toggleA = $(navMenuBar[j])
              .parents("ul")
              .siblings("a");
            $(toggleA).attr("aria-expanded", "true");
            $(toggleA).attr("class", "");
            var toggleUl = $(navMenuBar[j]).parents("ul");
            $(toggleUl).attr("class", "list-unstyled collapse show");
            /* -----点击tab删除 侧边栏锚点定位----- */
            navMenuBar[j].scrollIntoView(false)
            /* ------------------------------- */
            /* -----点击tab删除 显示侧边栏滚动条----- */
            hx_setScrollHeight()
          }
        }
      }
    }
  });

  // ------------------------------------------------------ //
  // 封装layui弹框
  // ------------------------------------------------------ //
  var layer = layui.layer;
  // 多窗口模式，层叠置顶
  var setTop = function (offsetModal) {
    layer.open(offsetModal);
  };
  // 配置一个透明的询问框
  var confirmTrans = function (message, confirmTransModal) {
    layer.msg(message, confirmTransModal);
  };
  // 示范一个公告层
  var notice = function (noticeModal) {
    layer.open(noticeModal);
  };
  // 上下左右弹出
  var offset = function (offsetModal) {
    layer.open(offsetModal);
  };
  // layui.closeAll
  var closeAll = function () {
    layer.closeAll();
  };
  // layui.setTop
  var hx_setTop = function (layero) {
    layer.setTop(layero);
  }


  window.setTop = setTop;
  window.confirmTrans = confirmTrans;
  window.notice = notice;
  window.offset = offset;
  window.closeAll = closeAll;
  window.hx_setTop = hx_setTop;
});

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 3600 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  if (decodedCookie) {
    var ca = decodedCookie.split(";");
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      if (c.trim().indexOf(name) === 0) {
        return c.trim().substring(name.length, c.length);
      }
    }
  }
  return "";
}
//删除cookies
function delCookie(name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie(name);
  if (cval != null)
    document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
}