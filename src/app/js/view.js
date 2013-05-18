/**
 * Create a new srpl-app view class that extends Y.View and renders the current
 * state of a srpl-app instance.
 * @module srpl-app-view
 * @requires
*/
YUI.add('srpl-app-view',function(Y){
    "use strict";

    var AppView = function(config){
        // because of this bug - http://yuilibrary.com/projects/yui3/ticket/2528631
        // we need to populate the container
        Y.one(config.container).setContent(this.template());
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
        }
    };

    AppView.NAME = 'appView';
    AppView.NS = 'app';

    Y.extend(AppView, Y.View, {
        template: Y.srpl.App.templates.base,
        eventListeners : [],
        /**
        * The initializer function will run when a view is instantiated
        * @method initializer
        * params {hash} config
        * @return {void}
        */
        initializer: function(config){
            var t = this;
            t.eventListeners = [];
            Y.each(AppView.ATTRS, function(spec, attrName){
                Y.each(['on', 'once', 'after', 'onceAfter'], function(type){
                    Y.each(spec[type], function(handler, evt){
                        t.get(attrName)[type](evt, Y.bind(handler,t));
                    });
                });
            });
        },
        /**
        * @method render
        * @return {void}
        */
        render: function(e){
            var t = this;

            if (!t.get('container').one('#srpl-container')) {
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
            });
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
        'srpl-app-css',
        'srpl-app-button-css',
        'srpl-app-loader-css',
        'srpl-app-loader-view',
        'srpl-app-templates',
        'srpl-business-model',
        'srpl-business-view',
        'srpl-search-model',
        'srpl-instrumentation-plugin',
        'srpl-util'
    ]
});