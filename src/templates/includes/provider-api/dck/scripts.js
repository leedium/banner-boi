function enablerInitialized() {
    Enabler.isVisible() ? adVisible() : Enabler.addEventListener(studio.events.StudioEvent.VISIBLE, adVisible)
};
function adVisible() {
    loadAssets();
};
function bgExitHandler() {
    Enabler.exit("Main Banner Exit")
}
Enabler.isInitialized() ? enablerInitialized() : Enabler.addEventListener(studio.events.StudioEvent.INIT, enablerInitialized);