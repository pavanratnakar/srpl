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
        map : null
    };

    Y.extend(BusinessView, Y.View, {
        // Assign base location template that will be used to render the srpl-business.
        template: Y.srpl.Business.templates.base,
        eventListners : [],
        // Specify delegated DOM events to attach to the srpl-business container.
        events:{},
        /**
        * The initializer function will run when a view is instantiated
        * @method initializer
        * @return {void}
        */
        initializer: function(config){
            this.eventListeners = [];
            Y.YMaps.init({
                appid: Y.srpl.config('ymaps.appid')
            });
        },
        /**
        * @method focus
        * @return {void}
        */
        focus : function(){},
        /**
        * @method render
        * @return {boolean}
        */
        render: function(type){
            type = type || 'append';
            // HACK FOR NEW
            this.get('business').setAttrs({
                'herophoto':'http://www.beaurivage.com/images/restaurants/restaurants_fine_jia.jpg',
                'height':'315',
                'width':'851'
            });
            var t = this,
                b = this.get('business'),
                node = Y.Node.create('<li class="srpl-business"></li>'),
                headerHeight;

            if (type === 'append') {
                t.get('container').append(node);
            } else {
                t.get('container').prepend(node);
            }
            node.setContent(t.template({
                b : b
            }));
            headerHeight = t.get('container').one('.srpl-header').get('offsetHeight');
            node.one('img.hero').setStyle('height',headerHeight);
            t.set('map',new Y.srpl.Map({
                'height' : headerHeight,
                'width' : Y.one(Y.srpl.config('containers.main')).get('offsetWidth') - t.get('container').one('.srpl-hero-container').get('offsetWidth') - 1,
                'traffic' : false,
                'boundingBox' : node.one('.srpl-map'),
                'center' : b.geo(),
                'zoomLevel' : Y.srpl.config('ymaps.zoomThresholdLevel'),
                'controls' : false
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