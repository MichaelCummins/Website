
function openNav() {
    if(screen.width < 1000){
        document.getElementById("sidebar").style.width = "100vw";
        document.getElementById("main").style.marginLeft = "0vw";
        //document.getElementById("navBar").style.marginLeft = "0px";
        //document.getElementById("navBar").style.width = "0px";
    }else{
        document.getElementById("sidebar").style.width = "25vw";
        document.getElementById("main").style.marginLeft = "10vw";
        document.getElementById("navBar").style.marginLeft = "25vw";
        document.getElementById("navBar").style.width = "75vw";
    }
}

function closeNav() { 
    document.getElementById("sidebar").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
    document.getElementById("navBar").style.marginLeft = "0";
    document.getElementById("navBar").style.width = "100%";    
}



function toggleSideBar(){
    var navSize = document.getElementById("sidebar").style.width;
    
    if(screen.width < 1000){
        if(navSize == "100vw"){
            return closeNav();
        }else{
            return openNav();
        }
    }else{
        if(navSize == "25vw"){
            return closeNav();
        }else{
            return openNav();
        }
    }
}

function on() {
  document.getElementById("overlay").style.display = "block";
}

function off() {
  document.getElementById("overlay").style.display = "none";
}
