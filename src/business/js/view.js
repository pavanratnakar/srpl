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
        container : null,
        business : {},
        map : null,
        type : null
    };

    Y.extend(BusinessView, Y.View, {
        eventListners : [],
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
            this.eventListeners = [];
            if (this.type === 'full') {
                Y.YMaps.init({
                    appid: Y.srpl.config('ymaps.appid')
                });
            }
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
                    'width' : t.get('container').one('.srpl-header').get('offsetWidth') - t.get('container').one('.srpl-hero-container').get('offsetWidth') - 1,
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
                        detailViewContent: '',
                        hoverOverMarkerContent: ''
                    });
                    t.get('map').draw(marker);
                });
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