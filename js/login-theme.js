$(document).ready(function() {

  $(".form-validate").each(function() {
      $(this).validate({
      errorElement: "div",
      errorClass: "is-invalid",
      validClass: "is-valid",
      ignore: ":hidden:not(.summernote, .checkbox-template, .form-control-custom),.note-editable.card-block",
      errorPlacement: function(error, element) {
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

  // ------------------------------------------------------ //
  // 设置主题
  // ------------------------------------------------------ //
  var stylesheet = $("link#theme-stylesheet");
  if (getCookie("theme_csspath")) {
    stylesheet.attr("href","css/style." +  getCookie("theme_csspath") + ".css");
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
        if(c.trim().indexOf(name) === 0){
          return c.trim().substring(name.length, c.length);
        }
      }
    }    
    return "";
  } 
  
});
