var slider = new IScroll('#indexContent', {
    scrollbars:false,
    fadeScrollbars:true,
    bounceLock:true,
    probeType: 3,
    momentum:false
});
slider.on('scroll', function(){
    if(this.y > 50){
        console.log(this.y);
    }
});