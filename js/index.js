layui.use('element', function(){
    // ------------------------------------------------------- //
    // Search Box
    // ------------------------------------------------------ //
    $("#search").on("click", function(e) {
      e.preventDefault();
      $(".search-box").fadeIn();
    });
    $(".dismiss").on("click", function() {
      $(".search-box").fadeOut();
    });

    // ------------------------------------------------------- //
    // Card Close
    // ------------------------------------------------------ //
    $(".card-close a.remove").on("click", function(e) {
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
    $(".dropdown").on("show.bs.dropdown", function() {
      $(this)
        .find(".dropdown-menu")
        .first()
        .stop(true, true)
        .fadeIn();
    });
    $(".dropdown").on("hide.bs.dropdown", function() {
      $(this)
        .find(".dropdown-menu")
        .first()
        .stop(true, true)
        .fadeOut();
    });

    // ------------------------------------------------------- //
    // Sidebar Functionality
    // ------------------------------------------------------ //
    $("#toggle-btn").on("click", function(e) {
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
    $(".form-validate").each(function() {
      $(this).validate({
        errorElement: "div",
        errorClass: "is-invalid",
        validClass: "is-valid",
        ignore:
          ":hidden:not(.summernote, .checkbox-template, .form-control-custom),.note-editable.card-block",
        errorPlacement: function(error, element) {
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
      .filter(function() {
        return $(this).val() !== "";
      })
      .siblings(".label-material")
      .addClass("active");

    // move label on focus
    materialInputs.on("focus", function() {
      $(this)
        .siblings(".label-material")
        .addClass("active");
    });

    // remove/keep label on blur
    materialInputs.on("blur", function() {
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
    $(document).on("sidebarChanged", function() {
        adjustFooter();
    });
    $(window).on("resize", function() {
        adjustFooter();
    });
    function adjustFooter() {
        var footerBlockHeight = $(".main-footer").outerHeight();
        contentInner.css("padding-bottom", footerBlockHeight + "px");
    }

    // ------------------------------------------------------ //
    // 设置侧边栏登录信息 客户头像点击，资料密码弹框控制功能
    // ------------------------------------------------------ //
    var timerTitShow;
    var timerTitHide;
    $("#personalPopverA").on("click", function () {
        if (!$("#personalPopverList").hasClass("show")){
            if(timerTitShow) {
                clearTimeout(timerTitShow);
            }
            if (!$(".managerTit").hasClass("managerTitHide") && !$(".side-navbar").hasClass("shrinked") ){
                $(".managerTit").addClass("managerTitHide");
                $(".managerTit").hide();
            }
        }else{
            if(timerTitHide) {
                clearTimeout(timerTitHide);
            }
            if ($(".managerTit").hasClass("managerTitHide") && !$(".side-navbar").hasClass("shrinked") ){
                    timerTitShow = setTimeout(function(){
                        $(".managerTit").removeClass("managerTitHide");
                        $(".managerTit").show();
                }, 200)
            }
        }     
    });
    $("#personalPopverLists").on("hide.bs.dropdown", function () {
        if(timerTitShow) {
            clearTimeout(timerTitShow);
        }
        if ($(".managerTit").hasClass("managerTitHide") && !$(".side-navbar").hasClass("shrinked") ){
            timerTitHide = setTimeout(function(){ 
                $(".managerTit").removeClass("managerTitHide");
                $(".managerTit").show();
            }, 200);
        }
    });   
    $("#_slideMenuToggle_ #toggle-btn").on("click", function(){
        //console.log($(".side-navbar").hasClass("shrinked"))
        if($(".side-navbar").hasClass("shrinked")){  //侧边栏合并
            if (!$(".managerTit").hasClass("managerTitHide")){
                $(".managerTit").addClass("managerTitHide");
                $(".managerTit").hide();
            }
            if($("#hx-slideMenu").hasClass("hx-slideMenuTitPadding")){
                $("#hx-slideMenu").removeClass("hx-slideMenuTitPadding")
            }      
        }else{  //侧边栏展开
            if ($(".managerTit").hasClass("managerTitHide")){
                $(".managerTit").removeClass("managerTitHide");
                $(".managerTit").show();
            }
            if(!$("#hx-slideMenu").hasClass("hx-slideMenuTitPadding")){
                $("#hx-slideMenu").addClass("hx-slideMenuTitPadding")
            } 
        }
    });
    
    // ------------------------------------------------------ //
    // 设置主题
    // ------------------------------------------------------ //
    var stylesheet = $("link#theme-stylesheet");
    $("<link id='new-stylesheet' rel='stylesheet'>").insertAfter(stylesheet);
    var alternateColour = $("link#new-stylesheet");
    if (getCookie("theme_csspath")) {
      alternateColour.attr("href",getCookie("theme_csspath"));
    }
    $("#selfDefiningTheme ul li").on("click", function() {
      if ($(this).attr("data-settheme") !== "") {
        var theme_csspath = "css/style." + $(this).attr("data-settheme") + ".css";
        alternateColour.attr("href", theme_csspath);
        setCookie("theme_csspath",theme_csspath, 365 );
      }
    });
  
    function setCookie(cname, cvalue, exdays){
      var d = new Date();
      d.setTime(d.getTime()+(exdays*24*3600*1000));
      var expires = "expires="+d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
    function getCookie(cname){
      var name = cname + "=";
      var decodedCookie = decodeURIComponent(document.cookie);
      if(decodedCookie){
        var ca = decodedCookie.split(";");
        for(var i = 0; i < ca.length; i++){
          var c = ca[i];
          while(c.charAt(0) === ""){
            c = c.substring(1);
          }
          if(c.indexOf(name) === 0){
            return c.substring(name.length, c.length);
          }
        }
      }    
      return "";
    } 

  // ------------------------------------------------------ //
  // 每隔60s发送ajax交易获取提示信息 与 message
  // ------------------------------------------------------ //
  var getTopBarMessageData = function() {
    //console.log("每隔60s发送ajax交易获取提示信息 与 message");
    // 假设此处已经ajax获取到了 警告信息 与 站内信
    var topbarData =  {
      alert : {
        data: [
            { message: '警告消息12354235234234234234234234234234234234', type: "fa fa-address-card-o", time: '2019-09-01 15:42:36' },
            { message: '警告消息2', type: "fa fa-wrench", time: '2019-09-01 15:42:36' },
            { message: '警告消息3', type: "fa fa-address-card-o", time: '2019-09-01 15:42:36' },
            { message: '警告消息4', type: "fa fa-wrench", time: '2019-09-01 15:42:36' },
        ],
        total: '12'
      },
      mail : {
        data: [
          { name: '李白', avatar: 'img/doggy.jpg' },
          { name: '杜甫', avatar: 'img/doggy.jpg' },
          { name: '王安石', avatar: 'img/doggy.jpg' },
        ],
        total: '8'
      }
    }

    // 警告信息
    var _alert_dom_html_ = ''
    for(var i = 0; i < topbarData.alert.data.length; i ++) {
      _alert_dom_html_ = _alert_dom_html_ +
        '<li><a rel="nofollow" href="#" class="dropdown-item"><div class="notification"><div class="notification-content"><i class="'+
        topbarData.alert.data[i].type +
        '"></i>' +
        topbarData.alert.data[i].message +
        '</div><div class="notification-time"><small>' +
        topbarData.alert.data[i].time +
        '</small></div></div></a></li>'
    }
    _alert_dom_html_ =
      '<a id="notifications" rel="nofollow" data-target="#" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="nav-link"><i class="fa fa-bell-o"></i><span class="badge bg-red badge-corner">' +
      topbarData.alert.total +
      '</span></a><ul aria-labelledby="notifications" class="dropdown-menu">' +
      _alert_dom_html_ +
      '<li><a rel="nofollow" id="_readall_alert_" href="javascript:void(0);" class="dropdown-item all-notifications text-center"><strong>查看所有报警</strong></a></li></ul>'
    $("#_topbar_alert_").html(_alert_dom_html_)
    
    // 站内信
    var _mail_dom_html_ = ''
    for(var i = 0; i < topbarData.mail.data.length; i ++) {
      _mail_dom_html_ = _mail_dom_html_ +
      '<li><a rel="nofollow" href="#" class="dropdown-item d-flex"><div class="msg-profile"><img src="' +
      topbarData.mail.data[i].avatar + 
      '" alt="..." class="img-fluid rounded-circle"></div><div class="msg-body"><h3 class="h5">' +
      topbarData.mail.data[i].name +
      '</h3><span>来信</span></div></a></li>'
    }
    _mail_dom_html_ = 
      '<a id="messages" rel="nofollow" data-target="#" href="#" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="nav-link"><i class="fa fa-envelope-o"></i><span class="badge bg-orange badge-corner">' +
      topbarData.mail.total +
      '</span></a><ul aria-labelledby="notifications" class="dropdown-menu">' +
      _mail_dom_html_ +
      '<li><a rel="nofollow" id="_readall_mail_" href="javascript:void(0);" class="dropdown-item all-notifications text-center"><strong>查看所有来信</strong></a></li>'
      $("#_topbar_mail_").html(_mail_dom_html_)
  }
  getTopBarMessageData()
  var timeId = -1;
  clearInterval(timeId);
  timeId = setInterval(getTopBarMessageData, 60000);

  // ------------------------------------------------------ //
  // iframe tab标签页
  // ------------------------------------------------------ //
  var element = layui.element; //Tab的切换功能，切换事件监听等，需要依赖element模块
  //触发事件
  var active = {
      tabAdd: function(e){
          var siderBarName = e[0].innerText;
          var siderBarID = e[0].getAttribute("lay-href");
          //新增一个Tab项
          element.tabAdd('_tab_iframe_', {
              title: siderBarName,
              content: createFrame("html/"+siderBarID),
              id: siderBarID
          })
          //每次新增Tab项，就重新对Tab栏每个tab项绑定，对应侧边栏对应标题改变颜色的方法
          changeSlideMenuColor();
          //每次新增Tab项，就重新对Tab栏每个tab项清除绑定，对应侧边栏对应标题改变颜色的方法
          //delSlideMenuColor();
      },
      tabChange: function(e){
          var siderBarID = e[0].getAttribute("lay-href");
          //切换到指定Tab项
          element.tabChange('_tab_iframe_', siderBarID);
      }
  }

  // 添加 与 切换
  $('#hx-slideMenu').on('click', ".site-demo-active", function(){
      var othis = $(this);
      var add = othis.data('add');
      var change = othis.data('change');
      var _tab_layid = []
      for(var i = 0; i < $(".layui-tab-title li").length; i ++) {
          _tab_layid.push($(".layui-tab-title li")[i].getAttribute("lay-id"))
      }
      if (_tab_layid.indexOf(othis.attr("lay-href")) === -1) {
          active[add] ? active[add].call(this, othis) : '';
          active[change] ? active[change].call(this, othis) : '';
      }else {
          active[change] ? active[change].call(this, othis) : '';
      }
  });
  // 删除
  

  var createFrame = function (url) {
      var iframe = '<iframe scrolling="auto" frameborder="0" src="' +url+ '" style="width: 100%;height: 100%;display: block;"></iframe>';
      return iframe;
  }

  

  // 侧边栏菜单数据动态渲染 
  var hxConfigCenter = [];
  var hxPrdCenter = [];
  for (var i = 0; i < menuInfoList.length; i++) {
    if (menuInfoList[i].menuName === "产品中心") {
      hxPrdCenter.push(menuInfoList[i]);
    } else {
      hxConfigCenter.push(menuInfoList[i]);
    }
  }

  var sSubmenu = "";
  function submenuListFn(subMenu, selectAttr) {
    if (!subMenu) return;
    if (subMenu.length > 0) {
      if (selectAttr) {
        sSubmenu += '<ul id="' + selectAttr + '" class="collapse list-unstyled ">';
      } else {
        sSubmenu += '<ul class="list-unstyled">';
      }
      for (var i = 0; i < subMenu.length; i++) {
        var subMenuList = subMenu[i].subMenuList;
        var selectAttr = subMenu[i].menuFunc + subMenu[i].menuId;
        var menuTit = subMenu[i].menuName;
        var menuTitIcon = "";
        var menuFunc = subMenu[i].menuFunc;
        var menuType = subMenu[i].menuType;
        if (subMenuList.length > 0 && subMenu[i].menuType === "D") {
          //便利_menuSlideIcon_ 获取slideMenu 图标
          for(var j = 0; j < _menuSlideIcon_.length; j++){
            if(_menuSlideIcon_[j].menuId === subMenu[i].menuId){
              //console.log(_menuSlideIcon_[j].icon);
              menuTitIcon = _menuSlideIcon_[j].icon;
              break;
            }           
          }
          sSubmenu += '<li data-type="'+ menuType +'" attr="' + menuFunc + '"> <a href="#' + selectAttr + '" aria-expanded="false" data-toggle="collapse"><i class="fa fa-' + menuTitIcon + '"></i>' + menuTit + '</a>';
          submenuListFn(subMenuList, selectAttr)
          sSubmenu += '</li>';
        } else {
          sSubmenu += '<li attr="' + menuFunc + '"><a class="site-demo-active" lay-href='+menuFunc+' lay-filter="menulist" data-change="tabChange" data-add="tabAdd" href="#" >' + subMenu[i].menuName + '</a></li>';
        }
      }
      sSubmenu += '</ul>';
    }
  }
  sSubmenu += '<span class="heading" id="hx-config-center">配置中心</span>';
  submenuListFn(hxConfigCenter);
  sSubmenu += '<span class="heading" id="hx-prd-center">产品中心</span>';
  var hxPrdCenterList = hxPrdCenter[0].subMenuList;
  submenuListFn(hxPrdCenterList)
  $("#hx-slideMenu").html(sSubmenu);

  //动态添加navMenuList 标题颜色
  var navMenuBar = $("#hx-slideMenu .list-unstyled li");
  for (var i = 0; i < navMenuBar.length; i++) {
    if(navMenuBar[i].getAttribute("data-type") !== "D"){
      navMenuBar[i].onclick = function(){
        return function(){
          var dataAttr = this.getAttribute("attr");
          for(var j = 0; j < navMenuBar.length; j++){
            if(navMenuBar[j].getAttribute("data-type")!== "D"){
              if(navMenuBar[j].getAttribute("data-type") !== dataAttr){
                $(navMenuBar[j]).removeClass("active");
              }else{
                $(this).addClass("active");
              }
            }
          }
          if(this.getAttribute("data-type") !== "D"){
            $(this).addClass("active");
          }
          scrollTopFn ? scrollTopFn() : window.scrollTopFn();
          return false;
        }
      }()
    }
  }
  function scrollTopFn(){
    $('html, body').animate({scrollTop: "0px"});
  }

   //内容区域tab标题栏 切换 更改对应的slidMenu 颜色
   function changeSlideMenuColor(){
        var layUiTabTits = $(".layui-tab-title li");  
        for(var i = 0; i < layUiTabTits.length; i++){
            layUiTabTits[i].onclick = function(){
            return function(){
                var layId = this.getAttribute("lay-id");
                var navMenuBar = $("#hx-slideMenu .list-unstyled li");
                for(var j = 0; j < navMenuBar.length; j++){
                    if(navMenuBar[j].getAttribute("attr") !== layId){
                        $(navMenuBar[j]).removeClass("active");
                    }else{
                        $(navMenuBar[j]).addClass("active");
                        //console.log($(navMenuBar[j]).parents("ul").siblings("a"));
                        var toggleA = $(navMenuBar[j]).parents("ul").siblings("a");
                        //console.log(toggleA);
                        $(toggleA).attr("aria-expanded", "true");
                        $(toggleA).attr("class", "");
                        var toggleUl = $(navMenuBar[j]).parents("ul");
                        $(toggleUl).attr("class", "list-unstyled collapse show");
                    }
                }
            }
            }()
        }
    }
    //内容区域tab标题栏 删除 更改对应的slidMenu 颜色
    $(".layui-tab").on('click', function(e){   
      var navMenuBar = $("#hx-slideMenu .list-unstyled li");
      if($(e.target).is(".layui-tab-close")){
        var targetLayId = $(".layui-tab-title .layui-this").attr("lay-id");
        for(var j = 0; j < navMenuBar.length; j++){
          if(navMenuBar[j].getAttribute("data-type")!== "D"){
            if(navMenuBar[j].getAttribute("attr") !== targetLayId){
              $(navMenuBar[j]).removeClass("active");
            }else{
              $(navMenuBar[j]).addClass("active");
            }
          }
        }
      }
    })
})