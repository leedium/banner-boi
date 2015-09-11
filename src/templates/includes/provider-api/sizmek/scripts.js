function checkInit() {
    EB.isInitialized() ? onInit() : EB.addEventListener(EBG.EventName.EB_INITIALIZED, onInit)
};
function onInit() {
    loadAssets()
}
checkInit();