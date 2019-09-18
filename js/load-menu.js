//菜单与图标对照表
//请勿修改或删除
 var _menuSlideIcon_=[
  {
    "menuId": 1,
    "icon": "address-card-o"
  },
  {
    "menuId": 2,
    "icon": "wrench"
  },
  {
    "menuId": 3,
    "icon": "television"
  },
  {
    "menuId": 41,
    "icon": "address-card-o"
  },
  {
    "menuId": 42,
    "icon": "credit-card"
  },
  {
    "menuId": 43,
    "icon": "gears"
  }
];

/**
 * 获取菜单数据，在异步回调中渲染侧边栏数据，并对二级菜单绑定监听事件（高亮、伸展）
*/
;(function() {
        // 侧边栏菜单数据动态渲染
        var hxConfigCenter = [];
        var hxPrdCenter = [];
        //侧边栏数据
        var menuInfoList =JSON.parse(layui.sessionData('menuInfoStorage').menuInfo);
        //侧边栏图标数据
        var _menuSlideIcon_ = window._menuSlideIcon_;
        //产品中心分割数据，分别进行配置中心、产品中心数据渲染
        for (var i = 0; i < menuInfoList.length; i++) {
          if (menuInfoList[i].menuName === "产品中心") {
            hxPrdCenter.push(menuInfoList[i]);
          } else {
            hxConfigCenter.push(menuInfoList[i]);
          }
        }
        var sSubmenu = "";
        sSubmenu += '<span class="heading" id="hx-config-center">配置中心</span>';
        submenuListFn(hxConfigCenter);
        sSubmenu += '<span class="heading" id="hx-prd-center">产品中心</span>';
        var hxPrdCenterList =hxPrdCenter[0].subMenuList;
        submenuListFn(hxPrdCenterList)
        $("#hx-slideMenu").html(sSubmenu);

        //侧边栏数据递归，加入图标
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
                    menuTitIcon = _menuSlideIcon_[j].icon;
                    break;
                  }
                }
                sSubmenu += '<li data-type="'+ menuType +'" attr="' + menuFunc + '"> <a href="#' + selectAttr + '" aria-expanded="false" data-toggle="collapse"><i class="fa fa-' + menuTitIcon + '"></i>' + menuTit + '</a>';
                submenuListFn(subMenuList, selectAttr)
                sSubmenu += '</li>';
              } else {
                sSubmenu += '<li attr="' + menuFunc + '"><a class="hx-sidebar-active" lay-href='+menuFunc+' lay-filter="menulist" data-change="tabChange" data-add="tabAdd" href="#" >' + subMenu[i].menuName + '</a></li>';
              }
            }
            sSubmenu += '</ul>';
          }
        }

        //侧边栏菜单遍历添加点击 高亮、伸展 事件
        var navMenuBar = $("#hx-slideMenu .list-unstyled li");
        for (var i = 0; i < navMenuBar.length; i++) {
          if(navMenuBar[i].getAttribute("data-type") !== "D"){
            navMenuBar[i].onclick = function(){
              return function(){
                // $scroll.css("height", $content.height() / $slideMenu.height() * $scroll_wrap.height() + "px");
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
                return false;
              }
            }()
          }
        }

      // ------------------------------------------------------ //
      // 设置自定义滚动条
      // ------------------------------------------------------ //
      var $content = $("#_hx_content");
      var $slideMenu = $("#hx-slideMenu");
      var $scroll_wrap = $("#_hx_scroll_wrap");
      var $scroll = $("#_hx_scroll");
      //document.body.clientHeight 可视区屏幕高度
      $content.css("height", document.body.clientHeight - $("#_hx_slidebar_header_").outerHeight(true) - $("#_hx_header_").outerHeight(true) + "px");
      $scroll_wrap.css("height", $content.height());
      // 点击侧边菜单栏
      $("#hx-slideMenu").on("click", ".list-unstyled li a", function () {
        if (!$(this).hasClass("hx-sidebar-active")) {
          hx_setScrollHeight.call(this);
        }
        // 监听slideMenu的滚动长度
        hx_onScroll()
      })
      // 监听slideMenu的滚动长度
      var hx_onScroll = function () {
        $content.on("scroll", function(){
          // 自定义的滑块随之滚动
          // 内部区滚动高度 / (盒子的高度 (超长的高度) - 内容区的高度 ) * (滑块区的高度 - 滑块的高度)
          var top = $content.scrollTop() / ($slideMenu.outerHeight(true) - $content.height()) * ($scroll_wrap.height()-$scroll.height());
          $scroll.css("top", top);
        })
      }
      // 设置滚动条高度（长度）
      var hx_setScrollHeight = function () {
        setTimeout(function() {
          if($slideMenu.outerHeight(true) > $content.height()){
            // 设置滑块高度(长度)
            $scroll.css("height", ($content.height() / $slideMenu.height() * $scroll_wrap.height())*8/10 + "px");
            var top = $content.scrollTop() / ($slideMenu.outerHeight(true) - $content.height()) * ($scroll_wrap.height()-$scroll.height());
            $scroll.css("top", top);
          }else {
            $scroll.css("height", "0px");
          }
        }, 400);
      }
      // ------------------------------------------------------ //

    window.hx_onScroll = hx_onScroll
    window.hx_setScrollHeight = hx_setScrollHeight

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
})()






















