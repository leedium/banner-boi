var bannerConfig = {
    dest: 'dist',
    campaignName : "banner-boi-preview",
    providers : [
        {
            id:"dck",
            clickTag:"https://www.doubleclickbygoogle.com/"
        }
        //{
        //    id:"sizmek",
        //     clickTag:"http://www.sizmek.com"

        //},
        //{
        //    id:"adrime",
        //     clickTag:"http://www.sizmek.com"
        //}
    ],
    sizes : ["300x250","336x280","120x600", "160x600","300x600","728x90","468x60","970x250"],
    minifyCSS: true,
    loops:3,
    reloadDelay:3000,
    gsapSize:29.3,
    backupImageType:'.gif'
}
module.exports = bannerConfig;
