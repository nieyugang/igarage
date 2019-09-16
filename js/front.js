$(document).ready(function () {
  /**
   * 检查是否有登陆信息
   */
  var userInfoStorage = layui.sessionData('userInfoStorage').userInfo;
  if (userInfoStorage == null || userInfoStorage == undefined || userInfoStorage == "") {
    location.href =window.location.origin+ "/login.html";
  } else {
    location.href = window.location.origin+"/index.html";
  }
});

(function () {
  function setThemeSetCss() {
    var stylesheet = $("link#layui-theme-stylesheet");
    if (getCookie("theme_csspath")) {
      stylesheet.attr("href", "../../css/layui." + getCookie("theme_csspath") + ".css");
    }
  }
  // ------------------------------------------------------ //
  // 设置主题
  // ------------------------------------------------------ //
  var stylesheet = $("link#layui-theme-stylesheet");
  if (getCookie("theme_csspath")) {
    stylesheet.attr("href", "../../css/layui." + getCookie("theme_csspath") + ".css");
  } else {
    stylesheet.attr("href", "../../css/layui.default.css");
  }

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

  window.setThemeSetCss = setThemeSetCss;
})();