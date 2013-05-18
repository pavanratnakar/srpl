/**
 * http://fixsingle.corp.yahoo.com/rapid_api3/rapid_api3.php#simpleexample
 * comscore plugin
 * @srpl-instrumentation-pluginin
 * @requires
    plugin,
    srpl-config,
    srpl-util
*/
YUI.add('srpl-instrumentation-plugin', function(Y){

    var InstrumentationPlugin = function(config){
        this.host = config.host;
        InstrumentationPlugin.superclass.constructor.apply(this, arguments);
    };

    InstrumentationPlugin.NAME = 'instrumentationPlugin';
    InstrumentationPlugin.NS = 'instrumentation';

    // Attributes and static properties for srpl-waypoint-plugin.
    InstrumentationPlugin.ATTRS = {};

    Y.extend(InstrumentationPlugin, Y.Plugin.Base, {
        eventListeners : [],
        rapidScript : null,
        comscoreScript : null,
        /**
         * initialisation method for comScore. Dynmically loads comScore js file
         * @method comScoreInitializer
         * @return {void}
         */
        rapidInitializer : function(){
            var t = this,
                options = {
                    onFailure:function(){
                        Y.log('Instrumentation :: Rapid : Script could not be loaded');
                    },
                    attributes:{
                        async: true
                    },
                    onSuccess:function(){
                        Y.log('Instrumentation :: Rapid : Script Added');
                        if (Y.srpl.config('tracking.logger.enable')) t.plug(Y.srpl.Plugin.Tracker);
                    }
                },
                src = "http://l.yimg.com/ss/rapid-3.3.js";
            t.rapidScript = YUI().Get.script(src, options);
        },
        /**
         * @method checkRapid
         * @return {void}
         */
        checkRapid : function(callback){
            var t = this;
            callback = callback || function(){};
            if (Y.Lang.isUndefined(Y.srpl.util.namespaceExists('YAHOO.i13n'))) {
                t.rapidScript.execute(function(){
                    callback();
                });
            } else {
                callback();
            }
        },
        /**
         * initialisation method for comScore. Dynmically loads comScore js file
         * @method comScoreInitializer
         * @return {void}
         */
        comScoreInitializer : function(){
            var t = this,
                options = {
                    onFailure:function(){
                        Y.log('Instrumentation :: Comscore : Script could not be loaded');
                    },
                    attributes:{
                        async: true
                    },
                    onSuccess:function(){}
                },
                src = (document.location.protocol === "https:" ? "https://sec.yimg.com/us.js" : "http://l.yimg.com/d/lib/3pm/cs_0.2.js");

            t.comscoreScript = YUI().Get.script(src, options);
        },
        /**
         * @method checkRapid
         * @return {void}
         */
        checkComscore : function(callback){
            var t = this;
            callback = callback || function(){};
            if (Y.Lang.isUndefined(Y.srpl.util.namespaceExists('COMSCORE'))) {
                t.comscoreScript.execute(function(){
                    callback();
                });
            } else {
                callback();
            }
        },
        /**
        * The initializer function will run when the plugin is instantiated
        * @method initializer
        * @return {void}
        */
        initializer:function(config){
            this.eventListeners = [];
            // check if comscore is enabled
            if (Y.srpl.config('tracking.rapid')) this.rapidInitializer();
            if (Y.srpl.config('tracking.comscore')) this.comScoreInitializer();
        },
        /**
         * set current URL
         * @method setCurrentURL
         * @return {void}
         */
        setCurrentURL : function(){
            var url = window.location.href;

            url = url.split('#'); // remove hash parameters
            this.set('url',url[0]);
        },
        /**
         * @method clear
         * @return {void}
         */
         clear : function(e){},
        /**
         * trigger comScore call
         * @method comScoreFire
         * @return {void}
         */
        comScoreBeaconFire : function(pageType){
            var t = this;
            t.checkComscore(function(){
                Y.log('Instrumentation :: Comscore : Firing for '+pageType+' having spaceId : '+Y.srpl.config('tracking.mainEvents')[pageType].s);
                COMSCORE._mapsconf = {
                    c1:  2, // Beacon Type [Mandatory]
                    c2:  7241469, // Unique id for Yahoo Properties [Mandatory]
                    c3:  "", // Unique id for each content producer [Optional]
                    c4:  t.get('url'), // Curent URL without hash and query [recommended]
                    c5:  Y.srpl.config('tracking.mainEvents')[pageType].s, // Space Id [optional]
                    c6:  "", // Package [optional]
                    c15: "" // Cookie Value [optional]
                };
                COMSCORE.beacon(COMSCORE._mapsconf);
            });
        },
        /**
         * trigger rapid Beacon
         * @method rapidBeaconFire
         * @return {void}
         */
        rapidBeaconFire : function(pageType, meta){
            var t = this;
            t.checkRapid(function(){
                var data,
                    conf = Y.srpl.config('tracking.mainEvents')[pageType],
                    rapidData;

                data = Y.mix({
                   _E   : meta._event || conf.p || null
                }, data);

                rapidData = {
                    spaceid     : conf.s,
                    client_only : 1
                };
                //override referrer
                if (pageType !=='mapInit' && (meta._event.indexOf("Bookmark") === -1) && (meta._event.indexOf("Legacy") === -1)) {
                    rapidData['referrer']='';
                }
                rapidData['keys'] = data;
                if (t.get('rapid')) {
                    t.get('rapid').destroy();
                }
                t.set('rapid', new YAHOO.i13n.Rapid(rapidData));
                Y.log('Instrumentation :: Rapid : Details');
                Y.log(rapidData);
                t.get('rapid').init();
            });
        },
        /**
         * @method rtb_init
         * @param1 pageType - pageType to find the spaceid from YCB
         * @return {void}
         */
        rtb_init : function(pageType) {
            Y.log('Instrumentation ::: Rtb :: Init : ' + pageType + ' having spaceId '+Y.srpl.config('tracking.mainEvents')[pageType].s);
            if ("undefined" != typeof(rt_SetSpaceid)) {
                rt_SetSpaceid(Y.srpl.config('tracking.mainEvents')[pageType].s);
            }
            if ("undefined" != typeof(rt_Start)) {
                rt_Start();
            }
        },
        /**
         * @method rtb_done_default
         * @return {void}
         */
        rtb_done : function(desc) {
            Y.log('Instrumentation ::: Rtb :: Done : ' + desc);
            if ("undefined" != typeof(rt_SetComment)) {
                rt_SetComment(desc);
            }
            if ("undefined" != typeof(rt_Done)) {
                rt_Done();
            }
        },
        /**
        * @method destructor
        * @return {void}
        */
        destructor : function(){
            Y.srpl.util._destructor(this.eventListeners);
        }
    });

    Y.namespace('srpl.Plugin').Instrumentation = InstrumentationPlugin;

},'@VERSION@',{requires:['plugin','srpl-config','srpl-util']});