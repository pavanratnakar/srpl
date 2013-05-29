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
        model : Y.srpl.Business.Model,
        hero : Y.srpl.Hero.Model,
        review : Y.srpl.Review.Model,
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
            }
        }
    };

    Y.extend(BusinessView, Y.View, {
        eventListners : [],
        // Specify delegated DOM events to attach to the srpl-business container.
        events:{
            '.srpl-directions':{
                'click': '_directionsClick'
            },
            '.srpl-more':{
                'click': '_moreClick'
            },
            '.srpl-less':{
                'click': '_lessClick'
            },
            '.srpl-more-details a':{
                'click': '_moreDetailsClick'
            }
        },
        /**
        * The initializer function will run when a view is instantiated
        * @method initializer
        * @return {void}
        */
        initializer: function(config){

            var t = this,
                modelListener;

            t.eventListeners = [];
            Y.YMaps.init({
                appid: Y.srpl.config('ymaps.appid')
            });
            modelListener = t.get('model').on('stateChange', function(){
                t.render();
            });
            t.eventListeners.push(modelListener);
        },
        /**
        * @method renderFull
        * @return {void}
        */
        renderFull : function(){
            var t = this,
                headerHeight,
                node = t.get('container'),
                b = t.get('model');

            if (!node.getContent()) {
                node.setContent(Y.srpl.Business.templates.full({
                    b : b,
                    h : t.get('hero'),
                    r : t.get('review')
                }));
                if (t.get('container').one('.srpl-detail-container')) {
                    Y.srpl.util.domTruncator(t.get('container').one('.srpl-detail-container'),'.srpl-container-sub',Y.srpl.config('business.detailLimit'));
                }
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
                    t.get('foursquare')
                        .set('container',t.get('container').one('.srpl-foursquare'))
                        .render();
                    t.get('yelp')
                        .set('container',t.get('container').one('.srpl-yelp-reviews'))
                        .render();
                    t.get('reviews')
                        .set('container',t.get('container').one('.srpl-yahoo-reviews'))
                        .render();
                }
                node.setStyle('height',node.get('offsetHeight')+8);
            }
        },
        /**
        * @method render
        * @return {void}
        */
        render: function(){
            this.get('container').addClass(this.get('type'));
            this.renderFull();
        },
        /**
        * @method clear
        * @return {void}
        */
        clear: function(){},
        /**
        * @method destructor
        * @return {void}
        */
        destructor: function(){
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
            var b = this.get('model');
            window.open('http://maps.yahoo.com/directions/?lat='+b.get('lat')+'&lon='+b.get('lon')+'&zoom='+Y.srpl.config('ymaps.zoomThresholdLevel')+'&d='+encodeURIComponent(b.getNamedAddress()),Y.srpl.config('linking.target'));
        },
        /**
        * @method _moreClick
        * @params {e} e
        * @return {void}
        */
        _moreClick: function(e){
            var target = e.currentTarget;

            e.preventDefault();
            target.hide().previous().hide();
            target.next().show();
            this.fire('resize');
        },
        /**
        * @method _moreClick
        * @params {e} e
        * @return {void}
        */
        _lessClick: function(e){
            var target = e.currentTarget;

            e.preventDefault();
            target.get('parentNode').hide().previous().show().previous().show();
            this.fire('resize');
        },
        /**
        * @method _moreDetailsClick
        * @params {e} e
        * @return {void}
        */
        _moreDetailsClick: function(e){
            var target = e.currentTarget;

            e.preventDefault();
            Y.srpl.util.domTruncator(
                target.ancestor('.srpl-detail-container'),
                '.srpl-container-sub',
                Y.srpl.config('business.detailLimit'),
                target.get('parentNode').hasClass('srpl-view-more') ? 'more' : 'hide'
            );
            this.fire('resize');
        }
    });

    Y.namespace('srpl.Business');
    Y.srpl.Business.View = BusinessView;
}, '@VERSION@',{
    requires:[
        'view',
        'srpl-business-model',
        'srpl-hero-model',
        'srpl-review-model',
        'srpl-business-templates',
        'srpl-hero-templates',
        'srpl-foursquare-view',
        'srpl-yelp-view',
        'srpl-reviews-view',
        'srpl-util',
        'srpl-config',
        'srpl-map-view',
        'srpl-business-css',
        'srpl-lib-css',
        'srpl-hero-css',
        'srpl-business-gallery-css',
        'srpl-config'
    ]
});