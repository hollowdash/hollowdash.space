const errorBanner = document.getElementById("error-bar");

function showErrorBar() {
    errorBanner.classList.add("displayFlex");
}

errorBanner.addEventListener("animationend", () => {
    errorBanner.classList.remove("displayFlex");
});