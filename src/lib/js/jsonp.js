YUI.add('srpl-jsonp', function(Y){

    /*
    * https://github.com/IntoMethod/Lightweight-JSONP
    * Lightweight JSONP fetcher
    * Copyright 2010-2012 Erik Karlsson. All rights reserved.
    * BSD licensed
    */


    /*
    * Usage:
    *
    * JSONP.get( 'someUrl.php', {param1:'123', param2:'456'}, function(data){
    *   //do something with data, which is the JSON object you should retrieve from someUrl.php
    * });
    */
    var timeout = 10000; // 10 second default timeout. No more headaches.

    var JSONP = (function(){
        var counter = 0, head, query, key, window = this, config = {};
        function load(url) {
            var script = document.createElement('script'),
                done = false;
            script.src = url;
            script.async = true;
     
            script.onload = script.onreadystatechange = function() {
                if ( !done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") ) {
                    done = true;
                    script._loaded = true;
                    script.onload = script.onreadystatechange = null;
                    if ( script && script.parentNode ) {
                        script.parentNode.removeChild( script );
                    }
                }
            };
            if ( !head ) {
                head = document.getElementsByTagName('head')[0];
            }
            head.appendChild( script );
            return script;
        }
        function encode(str) {
            return encodeURIComponent(str);
        }

        function selfDestruct(cbName){
            if(window[cbName]){
                window[cbName] = function(){
                    try {
                        delete window[ cbName ];
                    } catch (e) {}
                    window[ cbName ] = null;
                };
            }
        }

        function jsonp(url, params, callback, callbackName) {
            query = (url||'').indexOf('?') === -1 ? '?' : '&';
            params = params || {};
            for ( key in params ) {
                if ( params.hasOwnProperty(key) ) {
                    query += encode(key) + "=" + encode(params[key]) + "&";
                }
            }
            // var jsonp = "json" + (++counter);
            var jsonp = "srpljson" + (++counter);
            // jsonp.
            window[ jsonp ] = function(data){
                callback(data);
                try {
                    delete window[ jsonp ];
                } catch (e) {}
                window[ jsonp ] = null;
            };
     
            var script = load(url + query + (callbackName||config['callbackName']||'callback') + '=' + jsonp);
            var ret = {
                timeout: function(time, fn){
                    var startTime = new Date().getTime();
                    setTimeout(function(){
                        if(!script._loaded){
                            script.onload = script.onreadystatechange = null;
                            script.src='';
                            if ( script && script.parentNode ) {
                                script.parentNode.removeChild( script );

                            }
                            selfDestruct(jsonp);
                            fn && fn('timed out');
                        }
                        
                    }, Y.Lang.isValue(time)?time:timeout);
                    return this;
                },
                failure: function(fn){
                    script.onerror = function(e){
                        if(!script._loaded){
                            script.onload = script.onreadystatechange = null;
                            script.src='';
                            if ( script && script.parentNode ) {
                                script.parentNode.removeChild( script );
                            }
                            selfDestruct(jsonp);
                            fn && fn(e);
                        }
                        return this;
                        
                    };
                }
            };

            return ret;
        }
        function setDefaults(obj){
            config = obj;
        }
        return {
            get:jsonp,
            init:setDefaults
        };
    }());

    var cache = new Y.CacheOffline({
        sandbox:'srpl-jsonp',
        expires: Y.srpl.config('misc.cache') || (24*2*60*60*1000),    // 48 hours. could be longer, no?
        max: 1000    // a thousand entries
    });

    Y.namespace('srpl');
    // WARNING this changes signature from Y.jsonp. specifically, args is replaced by options, and does not get encoded in url

    Y.srpl.jsonp = function(url, c, options){
        url = url+'';

        options = options|| {};
        var success,
            complete,
            _c = (Y.Lang.isFunction(c) ? c : (c.on||{}).success)||function(){};
        success = function(data){
            var cacheable = true;
            if(Y.Lang.isFunction(options.cacheWhen) && !options.cacheWhen(data)){
                cacheable = false;
            }
            if(options.noCache){
                cacheable = false;
            }
            cacheable && (!cache.retrieve(url)) && cache.add(url, data);
            _c(data);
        };

        if(Y.Lang.isFunction(c)){
            c = {on:{success:success}};
        }
        else{
            c.on = c.on || {};
            c.on.success = success;
        }

        complete = c.on.complete || function(){};

        // todo - handle args (maybe not required, but must investigate)
        
        if(!cache.retrieve(url) || options.noCache){
            cache.fire('miss');

            JSONP.get(url,{}, function(response){
                c.on.success(response);
            }, options.callbackName||'callback').timeout(options.timeout || timeout, c.on.timeout).failure(c.on.failure);
            // Y.jsonp(url, c, args);
        }
        else{
            cache.fire('hit',{key:url, val:cache.retrieve(url)});
            success(cache.retrieve(url).response);
            complete();
        }
    };

    // expose cache
    Y.srpl.jsonp.cache = cache;

},'@VERSION@',{requires:['jsonp','jsonp-url','cache-offline', 'srpl-config']});