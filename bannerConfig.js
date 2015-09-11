var bannerConfig = {
    dest: 'dist',
    campaignName : "demo",
    providers : [
        {
            id:"dck"
        },
        {
            id:"sizmek"
        },
        {
            id:"adrime"
        }
    ],
    sizes : ["120x600","120x240","160x600","300x250","250x250","300x600","336x280","728x90","970x250"],
    minifyCSS: false,
    reloadDelay:3000
}
module.exports = bannerConfig;
