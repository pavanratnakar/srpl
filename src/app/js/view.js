/**
 * Create a new srpl-app view class that extends Y.View and renders the current
 * state of a srpl-app instance.
 * @module srpl-app-view
 * @requires
*/
YUI.add('srpl-app-view',function(Y){
    "use strict";

    var AppView = function(config){
        // Have to append aria container due to above bug
        // One box needs the container to be present
        Y.one('body')
            .append(Y.srpl.App.templates.aria({
                id : 'srpl'
            }));
        AppView.superclass.constructor.apply(this, arguments);
    };

    AppView.ATTRS = {
        /**
        * viewport
        */
        viewport : {
            getter: function(){
                return {
                    height : Y.one('body').get('offsetHeight'),
                    width : Y.one('body').get('offsetWidth')
                };
            }
        },
        /**
        * loader
        */
        loader : {
            valueFn: function(){
                return new Y.srpl.App.Loader.View({
                    container : Y.srpl.config('containers.loader'),
                    app : this
                });
            }
        },
        /**
        * events specific to search model
        */
        searchModel: {
            valueFn: function(){
                return new Y.srpl.Search.Model();
            }
        },
        /**
        * events specific to business view
        */
        businessView: {
            valueFn: function(){
                return new Y.srpl.Business.View({
                    container: Y.srpl.config('containers.business')
                });
            }
        },
        /**
        * overlay
        */
        overlay : {
            valueFn: null
        }
    };

    AppView.NAME = 'appView';
    AppView.NS = 'app';

    Y.extend(AppView, Y.View, {
        template: Y.srpl.App.templates.base,
        eventListeners : [],
        /**
        * key events
        * @method keyEvents
        * @return {void}
        */
        keyEvents : function(e){
            var t = this,
                keydownListener;

            keydownListener = Y.one('body').on('keydown', function(e){
                switch(e.keyCode) {
                    case 27: // escape key press
                        Y.fire('srpl::keydown:escape');
                    break;

                    default:
                      // do noting
                    break;
                }
            });
            t.eventListeners.push(keydownListener);
        },
        /**
        * @method initEvents
        * @return {void}
        */
        overlayEvents : function(){
            var t = this,
                overlayCloseListener,
                resizeListener,
                keydownEscListener;

            overlayCloseListener =  t.get('overlay').get('boundingBox').delegate({
                'click' : function(e){
                    t.overlayClose(e);
                }
            },'.close');
            t.eventListeners.push(overlayCloseListener);

            resizeListener = Y.on('srpl:resize',function(){
                t.resize();
            });
            t.eventListeners.push(resizeListener);

            keydownEscListener = Y.on('srpl::keydown:escape',function(e){
                t.overlayClose();
            });
            t.eventListeners.push(keydownEscListener);
        },
        /**
         * initEvents
         * @param  {object} t
         * @return {void}
        */
        initEvents : function(t){
            var windowresizeListener = Y.on('windowresize', function(){
                Y.fire('srpl:resize');
            },null);
            this.eventListeners.push(windowresizeListener);
        },
        /**
        * The initializer function will run when a view is instantiated
        * @method initializer
        * params {hash} config
        * @return {void}
        */
        initializer: function(config){
            config = config || {};
            var t = this;
            t.eventListeners = [];
            Y.each(AppView.ATTRS, function(spec, attrName){
                Y.each(['on', 'once', 'after', 'onceAfter'], function(type){
                    Y.each(spec[type], function(handler, evt){
                        t.get(attrName)[type](evt, Y.bind(handler,t));
                    });
                });
            });
            if (config.overlay === true) {
                // append myc fader
                if (!Y.one('#srpl-fader-container')) {
                    Y.one('body').appendChild(Y.srpl.App.templates.fader());
                }
                this.set('overlay',new Y.Overlay({
                    zIndex: 10001,
                    centered : true
                }));
                this.get('overlay').get('boundingBox').addClass("srpl-overlay");
                this.overlayEvents();
                this.keyEvents();
            }
            this.initEvents();
        },
        /**
        * @method resize
        * @return {void}
        */
        resize: function(){
            if (this.get('overlay')) {
                this.get('overlay').set("centered", "body");
            }
        },
        /**
        * @method render
        * @return {void}
        */
        render: function(e){
            var t = this;

            if (t.get('overlay')) {
                t.get('loader').render();
                Y.srpl.util.showFader();
                t.get('overlay').setAttrs({
                    bodyContent: t.template(),
                    width: 900
                });
                t.get('overlay').render();
                t.get('overlay').hide();
            } else if (!t.get('container').one('#srpl-container')) {
                t.get('container').setContent(t.template());
            }
            t.get('searchModel').query({
                'local_count': Y.srpl.config.local_count,
                'obq': 'pizza near new york',
                'userLat': 12.96698,
                'userLon': 77.58729
            },function(err,e){
                if (err) {
                    Y.log('Srpl :: AppView : Error');
                    Y.log(err);
                } else {
                    Y.log(e.local.business);
                    t.get('businessView').setAttrs({
                        'business' : new Y.srpl.Business.Model(e.local.business)
                    });
                }
                t.get('businessView').render();
                if (t.get('overlay')) {
                    t.get('overlay').set("centered", "body");
                    t.get('overlay').show();
                }
                t.get('loader').hide();
            });
        },
        /**
        * @method close popup
        * @return {void}
        */
        overlayClose: function(){
            if (this.get('overlay').get('boundingBox').one('.srpl') && !this.get('overlay').get('boundingBox').hasClass('yui3-overlay-hidden')){
                this.get('overlay').hide();
                this.get('overlay').get('boundingBox').hide();
                Y.srpl.util.hideFader();
            }
        },
        /**
        * @method destructor
        * @return {void}
        */
        destructor : function(){
            this.eventListeners = Y.srpl.util._destructor(this.eventListeners);
        },
        /**
        * @method clear
        * @return {void}
        */
        clear : function(){}
    });

    Y.namespace('srpl.App');
    Y.srpl.App.View = AppView;

}, '@VERSION@',{
    requires:[
        'node',
        'view',
        'overlay',
        'srpl-app-css',
        'srpl-app-button-css',
        'srpl-app-loader-view',
        'srpl-app-templates',
        'srpl-business-model',
        'srpl-business-view',
        'srpl-search-model',
        'srpl-instrumentation-plugin',
        'srpl-util'
    ]
});