function changeCheckBoxImage()
{
    var img = document.getElementById("menuimage");
    var checkbox = document.getElementById("tabcheckbox");
    var navigation = document.getElementById("navigationpanel");
    
    if (checkbox.checked == true) {
        img.src = "assets/images/close.png";
        navigation.style.display = "block";
    } else {
        img.src = "assets/images/menu.png";
        navigation.style.display = "none";
    }

    return false;
}

    window.onscroll = function () {
        closeNavigation();
      }
  
function closeNavigation()
{
    var checkbox = document.getElementById("tabcheckbox");
    var img = document.getElementById("menuimage");
    var navigation = document.getElementById("navigationpanel");

    if (checkbox.checked == true) {
        img.src = "assets/images/menu.png";
        navigation.style.display = "none";
        checkbox.checked = false;
    }
}