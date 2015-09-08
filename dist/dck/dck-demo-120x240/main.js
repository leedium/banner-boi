function startBanner() {
    var tl = new TimelineLite();
    var bannerSize = document.getElementById('app').getAttribute('data-type');
    tl.stop();
    var tl = new TimelineLite();
    console.log(bannerSize);
    switch (bannerSize) {
        case "size-300x250":
        case "size-336x280":
        case "size-250x250":
            tl.fromTo('#product',1.2,{y:'150%',display:'none'}, {display:'block', y:'0%',ease:Back.easeInOut});
            tl.to('#product',.6,{y:'110%',display:'none',ease:Back.easeInOut},'+=2.5');
            tl.to('#promologo',.7, {autoAlpha:1,ease:Quint.easeOut},'-=.2');
            tl.fromTo('#copy1',1,{y:'100%',display:'none'}, {autoAlpha:1, display:'block', y:'0%',ease:Quint.easeOut});
            tl.to('#copy1',.5,{autoAlpha:0, y:'130%',display:'none',ease:Back.easeInOut},'+=2.5');
            tl.fromTo('#copy2',1,{y:'100%',display:'none'}, {autoAlpha:1, display:'block', y:'0%',ease:Quint.easeOut});
            tl.fromTo('.cta',.9,{autoAlpha:0,y:'110%',display:'none'}, {autoAlpha:1,display:'block', y:'0%',ease:Quint.easeOut},'-=.5');

            break;
        case "size-300x600":
        case "size-120x600":
        case "size-160x600":
            tl.fromTo('#product',1.2,{y:'190%',display:'none'}, {display:'block', y:'0%',ease:Back.easeInOut});
            tl.to('#promologo',.7, {autoAlpha:1,ease:Quint.easeOut},'-=.2');
            tl.fromTo('#copy1',1,{autoAlpha:0, y:'100%',display:'none'}, {autoAlpha:1, display:'block', y:'0%',ease:Quint.easeOut});
            tl.to('#copy1',.5,{autoAlpha:0, y:'130%',display:'none',ease:Back.easeInOut},'+=2.5');
            tl.fromTo('#copy2',1,{autoAlpha:0, y:'100%',display:'none'}, {autoAlpha:1, display:'block', y:'0%',ease:Quint.easeOut});
            //tl.to('#product',.6,{y:'110%',display:'none',ease:Back.easeInOut},'+=2.5');
            tl.fromTo('.cta',.9,{autoAlpha:0,y:'110%',display:'none'}, {autoAlpha:1,display:'block', y:'0%',ease:Quint.easeOut},'-=.5');

            break;
        case "size-970x250":
        case "size-728x90":
            tl.fromTo('#product',1.2,{y:'190%',display:'none'}, {display:'block', y:'0%',ease:Back.easeInOut});
            tl.to('#promologo',.7, {autoAlpha:1,ease:Quint.easeOut},'-=.2');
            tl.fromTo('#copy1',1,{autoAlpha:0, y:'100%',display:'none'}, {autoAlpha:1, display:'block', y:'0%',ease:Quint.easeOut});
            tl.to('#copy1',.5,{autoAlpha:0, y:'130%',display:'none',ease:Back.easeInOut},'+=2.5');
            tl.fromTo('#copy2',1,{autoAlpha:0, y:'100%',display:'none'}, {autoAlpha:1, display:'block', y:'0%',ease:Quint.easeOut});
            //tl.to('#product',.6,{y:'110%',display:'none',ease:Back.easeInOut},'+=2.5');
            tl.fromTo('.cta',.9,{autoAlpha:0,y:'110%',display:'none'}, {autoAlpha:1,display:'block', y:'0%',ease:Quint.easeOut},'-=.5');


            break;
    }
    tl.play();
}
document.getElementById('main').addEventListener('click', bgExitHandler, false);

