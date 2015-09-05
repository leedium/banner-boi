var bannerConfig = {
    dest: 'delivery',
    build : "DEV",
    campaignName : "leedium",
    providers : [
        {
            id:"dck",
            headerScript:'<script src="https://s0.2mdn.net/ads/studio/Enabler.js"></script>',
            footerScript:'<script type="text/javascript"> window.onload = function(){if (Enabler.isInitialized()){enablerInitHandler(); }else{ Enabler.addEventListener(studio.events.StudioEvent.INIT,  enablerInitHandler);}}; function enablerInitHandler() { startBanner(); } </script>'
        },
        {
            id:"sizmek",
            headerScript:'<script type="text/javascript" src="http://ds.serving-sys.com/BurstingScript/EBLoader.js"></script>',
            footerScript:'<script type="text/javascript">function checkInit(){EB.isInitialized()?onInit():EB.addEventListener(EBG.EventName.EB_INITIALIZED,onInit)};function onInit(){startBanner()}</script><script type="text/javascript">checkInit()</script>'
        }],
    sizes : ["120x600","120x240","160x600","300x250","250x250","300x600","336x280","728x90"],
    minifyCSS: false,
    reloadDelay:3000
}
module.exports = bannerConfig;
