//Obj
const closeWindowsObj = document.getElementById("closeWindow");

// Events
closeWindowsObj.addEventListener("click", closeWindow);

function closeWindow() {
    window.close()
}