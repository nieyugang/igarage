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
    
  });
  