var bannerConfig = {
    dest: 'dist',
    build : "DEV",
    campaignName : "demo",
    providers : [
        {
            id:"dck",
            headerScript:'<script src="https://s0.2mdn.net/ads/studio/Enabler.js"></script>',
            footerScript:'<script type="text/javascript"> function enablerInitialized(){Enabler.isVisible()?adVisible():Enabler.addEventListener(studio.events.StudioEvent.VISIBLE,adVisible)};function adVisible(){loadAssets()};function bgExitHandler(){Enabler.exit("Main Banner Exit")}Enabler.isInitialized()?enablerInitialized():Enabler.addEventListener(studio.events.StudioEvent.INIT,enablerInitialized);</script>'
        },
        {
            id:"sizmek",
            headerScript:'<script type="text/javascript" src="http://ds.serving-sys.com/BurstingScript/EBLoader.js"></script>',
            footerScript:'<script type="text/javascript">function checkInit(){EB.isInitialized()?onInit():EB.addEventListener(EBG.EventName.EB_INITIALIZED,onInit)};function onInit(){loadAssets()}</script><script type="text/javascript">checkInit()</script>'
        },
        {
            id:"adrime",
            headerScript:'<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>',
            footerScript:'<script type="text/javascript">function bgExitHandler(){};$(document).ready(function(){loadAssets();})</script>'
        }

    ],
    sizes : ["120x600","120x240","160x600","300x250","250x250","300x600","336x280","728x90","970x250"],
    minifyCSS: false,
    reloadDelay:3000
}
module.exports = bannerConfig;
