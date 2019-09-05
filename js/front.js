$(document).ready(function() {
  
    // ------------------------------------------------------ //
    // 设置主题
    // ------------------------------------------------------ //
    var stylesheet = $("link#theme-stylesheet");
    $("<link id='new-stylesheet' rel='stylesheet'>").insertAfter(stylesheet);
    var alternateColour = $("link#new-stylesheet");
    if (getCookie("theme_csspath")) {
      alternateColour.attr("href","../../"+getCookie("theme_csspath"));
    }
    
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

  
});
