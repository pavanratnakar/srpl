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
            business : '#srpl-container'
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
            gwsServer: 'http://gws2.maps.yahoo.com',
            local_count:10
        },
        businesses:{
            domain : '', // relative
            hiConf : true,
            pageNumber : 1,
            hiConfCheckNumber : 5,
            ads : true,
            searchTerm : ' near ',
            percentBeforeRequery : 33
        },
        // http://wiki.corp.yahoo.com/view/GlobalMapsFE/srplSpaceId
        // http://i13n.corp.yahoo.com/wizard/
        // http://i13n.corp.yahoo.com/urlmap/?spaceid=1197116579&lookupsidbutton=Lookup+Spaceid
        // /site/maps/consumer/newmaps_one
        tracking:{
            enable: false,
            comscore : true,
            rapid : true,
            mainEvents : {}
        },
        misc: {
            cache:48*60*60*1000
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