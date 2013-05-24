/**
 * Create a new srpl-business view class that extends Y.View and renders the current
 * state of a srpl-business instance.
 * @module srpl-business-view
 * @requires
*/
YUI.add('srpl-business-view', function(Y){

    var BusinessView = function(){
        BusinessView.superclass.constructor.apply(this, arguments);
    };

    // Attributes and static properties for srpl-business View.
    BusinessView.ATTRS = {
        container : {
            valueFn: function(){
                return null;
            }
        },
        business : {
            valueFn: function(){
                return null;
            }
        },
        map : {
            valueFn: function(){
                return null;
            }
        },
        foursquare: {
            valueFn: function(){
                return new Y.srpl.Foursquare.View();
            }
        },
        yelp: {
            valueFn: function(){
                return new Y.srpl.Yelp.View();
            }
        },
        reviews: {
            valueFn: function(){
                return new Y.srpl.Reviews.View();
            },
            on : {
                'resize' : function(){
                    this._resize();
                }
            }
        },
        type : {
            valueFn: function(){
                return new Y.srpl.Yelp.View();
            }
        }
    };

    Y.extend(BusinessView, Y.View, {
        eventListners : [],
        pluginListners : [],
        // Specify delegated DOM events to attach to the srpl-business container.
        events:{
            'li .directions':{
                'click':     '_directionsClick'
            }
        },
        /**
        * The initializer function will run when a view is instantiated
        * @method initializer
        * @return {void}
        */
        initializer: function(config){
            var t = this;

            t.eventListeners = [];
            Y.each(BusinessView.ATTRS, function(spec, attrName){
                Y.each(['on', 'once', 'after', 'onceAfter'], function(type){
                    Y.each(spec[type], function(handler, evt){
                        t.get(attrName)[type](evt, Y.bind(handler,t));
                    });
                });
            });
            if (t.type === 'full') {
                Y.YMaps.init({
                    appid: Y.srpl.config('ymaps.appid')
                });
            }
        },
        /**
        * @method detachPluginListeners
        * @return {void}
        */
        detachPluginListeners: function(){
            if (this.pluginListners && this.pluginListners.length>0) {
                Y.each(this.pluginListners, function(l,i){
                    l.detach();
                    l = null;
                });
                this.pluginListners = [];
            }
        },
        /**
        * @method detachPlugins
        * @return {void}
        */
        detachPlugins: function(){
            this.detachPluginListeners();
            this.get('container').all('li.srpl-business').each(function(v,i){
                v.destroy(true);
            });
        },
        /**
        * @method plugFoursquare
        * @return {void}
        */
        plugFoursquare: function(node){
            node.plug(Y.srpl.Plugin.Foursquare,{
                container : node.one('.srpl-foursquare')
            });
            node.foursquare.render();
        },
        /**
        * @method plugYelp
        * @params {node object} node
        * @return {void}
        */
        plugYelp: function(node){
            node.plug(Y.srpl.Plugin.Yelp,{
                container : node.one('.srpl-yelp-reviews')
            });
            node.yelp.render();
        },
        /**
        * @method reviewsEvents
        * @params {node object} node
        * @return {void}
        */
        reviewsEvents: function(node){
            var t = this,
                reviewsListener;

            reviewsListener = node.reviews.on({
                'resize':function(e){
                    t._resize();
                }
            });
            this.pluginListners.push(reviewsListener);
        },
        /**
        * @method plugReviews
        * @params {node object} node
        * @return {void}
        */
        plugReviews: function(node){
            node.plug(Y.srpl.Plugin.Reviews,{
                container : node.one('.srpl-yahoo-reviews')
            });
            node.reviews.render();
            this.reviewsEvents(node);
        },
        /**
        * @method renderFull
        * @return {void}
        */
        renderFull : function(node,b){
            var t = this,
                headerHeight;

            if (!node.getContent()) {
                node.setContent(Y.srpl.Business.templates.full({
                    b : b
                }));
                headerHeight = t.get('container').one('.srpl-header').get('offsetHeight');
                node.one('img.hero').setStyle('height',headerHeight);
                t.set('map',new Y.srpl.Map({
                    'height' : headerHeight,
                    //'width' : t.get('container').one('.srpl-header').get('offsetWidth') - t.get('container').one('.srpl-hero-container').get('offsetWidth') - 1,
                    'traffic' : false,
                    'boundingBox' : node.one('.srpl-map'),
                    'center' : b.geo(),
                    'zoomLevel' : Y.srpl.config('ymaps.zoomThresholdLevel'),
                    'controls' : false,
                    'animatedTransitions' : Y.srpl.config('ymaps.animatedTransitions')
                }));
                t.get('map').render(function(){
                    t.get('map').setControls({
                        'zoomControl' : Y.srpl.config('ymaps.zoomControl'),
                        'scale' : Y.srpl.config('ymaps.scale'),
                        'mouse' : Y.srpl.config('ymaps.mouse'),
                        'keyboard' : Y.srpl.config('ymaps.keyboard')
                    });
                    var marker = new Y.YMaps.Marker({
                        geoLocation: b.geo(),
                        label: '*',
                        detailViewContent: ' ',
                        hoverOverMarkerContent: ' '
                    });
                    t.get('map').draw(marker);
                });
                if (b.get('id') !== '11138504') {
                    t.plugFoursquare(node);
                    t.plugYelp(node);
                    t.plugReviews(node);
                }
                node.setStyle('height',node.get('offsetHeight')+8);
            }
        },
        /**
        * @method renderMini
        * @return {void}
        */
        renderMini : function(node,b){
            var t = this,
                headerHeight;

            if (!node.getContent()) {
                node.setContent(Y.srpl.Business.templates.mini({
                    b : b
                }));
                t.plugFoursquare(node);
                t.plugYelp(node);
                t.plugReviews(node);
            }
        },
        /**
        * @method render
        * @return {boolean}
        */
        render: function(){
            // HACK FOR NEW
            this.get('business').setAttrs({
                'herophoto':'http://www.beaurivage.com/images/restaurants/restaurants_fine_jia.jpg'
            });
            var b = this.get('business'),
                node = this.get('container').one('#srpl-'+b.get('id'));

            this.get('container').addClass(this.get('type'));
            if (this.get('type') === 'full') {
                this.renderFull(node,b);
            } else if (this.get('type') === 'mini') {
                this.renderMini(node,b);
            }
        },
        /**
        * @method clear
        * @return {void}
        */
        clear: function(){
            this.detachPlugins();
        },
        /**
        * @method resizeRequired
        * @return {void}
        */
        resizeRequired : function(){
            this.fire('resize');
        },
        /**
        * @method destructor
        * @return {void}
        */
        destructor: function(){
            this.detachPlugins();
            this.eventListeners = Y.srpl.util._destructor(this.eventListeners);
        },

        // -- Event Handlers -------------------------------------------------------

        /**
        * @method _resize
        * @return {void}
        */
        _resize : function(){
            this.fire('resize');
        },
        /**
        * @method _directionsClick
        * @params {e} e
        * @return {void}
        */
        _directionsClick: function(e){
            var b = this.get('business');
            window.open('http://maps.yahoo.com/directions/?lat='+b.getLatitude()+'&lon='+b.getLongitude()+'&zoom='+Y.srpl.config('ymaps.zoomThresholdLevel')+'&d='+encodeURIComponent(b.getNamedAddress()),Y.srpl.config('linking.target'))
        }
    });

    Y.namespace('srpl.Business');
    Y.srpl.Business.View = BusinessView;
}, '@VERSION@',{
    requires:[
        'view',
        'srpl-business-model',
        'srpl-business-templates',
        'srpl-foursquare-plugin',
        'srpl-yelp-plugin',
        'srpl-reviews-plugin',
        'srpl-util',
        'srpl-config',
        'srpl-map-view',
        'srpl-business-css',
        'srpl-lib-css',
        'srpl-business-hero-css',
        'srpl-business-gallery-css',
        'srpl-config'
    ]
});