YUI.add('srpl-config', function(Y){

    var config = {
        env:{
            intl:'en-US',
            lang: 'en-US',
            locale: 'en-US',
            countrycode: 'US', // required for locations
            version:YUI.version,
            cdnBase:'http://l.yimg.com/na/',
            combine: false,
            debug: true,
            country : 'United States'
        },
        ymaps:{
            appid: 'ymapsaura2',
            center: {
                'latitude' : '37.371609',
                'longitude' : '-122.038254'
            },
            zoomLevel: 10,
            pan : false,
            zoom : true,
            scale : false,
            keyboard : true,
            mouse : true,
            mapTypeControl : false,
            zoomControl : true,
            traffic : false,
            zoomThresholdLevel : 16,
            animatedTransitions : true // default true. Override it if required
        },
        transisition : {
            duration : 1,
            easing : 'ease-in-out',
            delay : 0
        },
        containers : {
            main : '#srpl-wrapper-container',
            business : '#srpl-container',
            loader : '#srpl-loader-container'
        },
        srpl:{
            version:'@VERSION@',
            target:'development'
        },
        app:{
            focusTimeout : 200
        },
        loader: {
            timer : 15000
        },
        pagination: {
            limit : 10
        },
        search:{
            server: 'http://maps.yahoo.com/myc-local'
        },
        business:{
            galleryCount : 4
        },
        tracking:{
            enable: false,
            comscore : true,
            rapid : true,
            mainEvents : {}
        },
        misc: {
            cache:48*60*60*1000
        },
        linking: {
            target : '_blank'
        }
    };

    Y.namespace('srpl');

    Y.srpl.config = function(key, _default){
        var val = Y.srpl.util.atPath(config, key);
        return (Y.Lang.isValue(val) ? val : _default);
    };

    Y.srpl.config.set = function(key, val){
        Y.srpl.util.setAtPath(config, key, val);
        return Y.srpl.config;
    };

    Y.srpl.config.paths = function(){
        var paths = Y.srpl.util.paths(config);
        return paths;
    };

    Y.srpl.config.set(window.srpl_config||{});

},'@VERSION@',{requires:['srpl-util', 'srpl-deferred']});