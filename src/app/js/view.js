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
            valueFn: function(){
                return {
                    width : this.get('type') === 'mini' ? (this.get('width') || this.get('container').get('offsetWidth') || '600') : '900',
                    height : Y.one('body').get('offsetHeight')
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
        * overlay
        */
        overlay : {
            valueFn: null
        },
        /**
        * carousel
        */
        carousel : {
            valueFn: null
        },
        /**
        * business-model-list
        */
        businessModelList : {
            valueFn: function(){
                return new Y.srpl.Business.Model.List();
            }
        },
        // USER CONTROLLED ATTRIBUTES
        /**
        * businessess
        */
        businessess : {
            valueFn: null
        },
        /**
        * active
        */
        active : {
            valueFn: null
        },
        /**
        * width
        */
       width : {
            value : 'null'
       }
       // END OF USER CONTROLLED ATTRIBUTES
    };

    AppView.NAME = 'appView';
    AppView.NS = 'app';

    Y.extend(AppView, Y.View, {
        template: Y.srpl.App.templates.base,
        eventListeners : [],
        // Specify delegated DOM events to attach to the srpl-view container.
        events:{
            '.close':{
                'click':'_overlayClose'
            },
            '.prev':{
                'click':'_carouselMoveLeft'
            },
            '.next':{
                'click':'_carouselMoveRight'
            }
        },
        /**
         * overlayInitilize
         * @return {void}
        */
        overlayInitilize : function(){
            this.set('overlay',new Y.Overlay({
                zIndex: Y.srpl.config('overlay.zIndex'),
                centered : true,
                bodyContent: this.template(),
                width :Y.srpl.config('overlay.width')
            }));
            this.get('overlay').get('boundingBox').addClass("srpl-overlay");
            this.get('overlay')
                .render()
                .hide();
        },
        /**
        * @method overlayClose
        * @params {e} e
        * @return {void}
        */
        overlayClose: function(e){
            if (this.get('overlay') && this.get('overlay').get('boundingBox').one('.srpl') && !this.get('overlay').get('boundingBox').hasClass('yui3-overlay-hidden')){
                this.get('overlay').hide();
                Y.srpl.util.hideFader();
            }
        },
        /**
        * @method overlayRender
        * @params {e} e
        * @return {void}
        */
        overlayRender: function(e){
            var t = this,
                selectedItem = Y.Array.indexOf(t.get('businessess'),t.get('active'));

            t.get('loader').render();
            Y.srpl.util.showFader();
            t.get('carousel').set('selectedItem',selectedItem);
            t.get('carousel').render();
            t.get('carousel').scrollTo(selectedItem);
            t.show();
            t.carouselNavigationControls(selectedItem);

        },
        /**
        * @method overlayLayout
        * @return {void}
        */
        syncUI: function(){
            var activeBusinessContainer = this.get('container').one('#srpl-'+this.get('active'));

            if (this.get('overlay') && activeBusinessContainer.hasClass('active')) {
                Y.log('Srpl :: AppView : syncUI : called');
                var activeBusinessHeight = activeBusinessContainer.get('offsetHeight'),
                    height = Math.min(activeBusinessHeight,(Y.one('body').get('offsetHeight')-2*Y.srpl.config('overlay.offset')));
                Y.log('Srpl :: AppView : syncUI : height = '+height);
                this.get('carousel')._uiSetHeight(height);
                this.get('carousel')._uiSetHeightCB(height);
                this.get('container').show();
                this.get('container').one(Y.srpl.config('containers.business')).setStyle('height',activeBusinessHeight);
                this.get('overlay').setAttrs({
                    'height' : height,
                    'centered' : 'body'
                });
                this.get('overlay').show();
            }
        },
        /**
        * @method overlayShow
        * @return {void}
        */
        overlayShow: function(){
            if (this.get('overlay')) {
                this.syncUI();
            }
            this.get('loader').hide();
        },
        /**
         * carouselInitilize
         * @return {void}
        */
        carouselInitilize : function(){
            this.set('carousel',new Y.Carousel({
                boundingBox: Y.srpl.config('containers.carousel'),
                contentBox: Y.srpl.config('containers.business'),
                carouselItemEl : Y.srpl.config('containers.carouselItemEl'),
                numVisible : Y.srpl.config('carousel.numVisible'),
                hidePagination : Y.srpl.config('carousel.hidePagination'),
                scrollIncrement : Y.srpl.config('carousel.scrollIncrement'),
                isCircular : Y.srpl.config('carousel.isCircular')
            }));
            this.get('carousel').plug(Y.CarouselAnimPlugin,{animation:{speed: 0.5}});
        },
        /**
        * @method carouselNavigationControls
        * @return {void}
        */
        carouselNavigationControls: function(index){
            if (this.get('carousel')) {
                var prev,
                    next,
                    c = this.get('container');

                if (this.get('businessess').length > 1) {
                    if (index === 0) {
                        next = true;
                    } else if (index === this.get('businessess').length - 1) {
                        prev = true;
                    } else {
                        next = true;
                        prev = true;
                    }
                }
                if (prev) {
                    c.one('.prev').show();
                } else {
                    c.one('.prev').hide();
                }
                if (next) {
                    c.one('.next').show();
                } else {
                    c.one('.next').hide();
                }
            }
        },
        /**
        * @method carouselMove
        * @return {void}
        */
        carouselMove: function(type){
            var index;

            if (type === 'next') {
                index = this.get('carousel').get('selectedItem') + 1;
            } else {
                this.get('carousel').scrollPageBackward();
                index = this.get('carousel').get('selectedItem') - 1;
            }
            this.get('carousel').scrollTo(index);
            this.set('active',this.get('businessess')[index]);
            this.show();
            this.carouselNavigationControls(index);
        },
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
        * global events
        * @method globalEvents
        * @return {void}
        */
        globalEvents : function(){
            var t = this,
                windowresizeListener,
                globalEvents;

            windowresizeListener = Y.on('windowresize', function(){
                Y.fire('srpl:resize');
            },null);
            t.eventListeners.push(windowresizeListener);

            globalEvents = Y.on({
                'srpl:resize' : function(){
                    t.resize();
                },
                'srpl::keydown:escape' : function(){
                    t.overlayClose();
                }
            });
            t.eventListeners.push(globalEvents);
        },
        /**
         * initEvents
         * @return {void}
        */
        initEvents : function(){
            this.keyEvents();
            this.globalEvents();
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

            Y.each(AppView.ATTRS, function(spec, attrName){
                Y.each(['on', 'once', 'after', 'onceAfter'], function(type){
                    Y.each(spec[type], function(handler, evt){
                        t.get(attrName)[type](evt, Y.bind(handler,t));
                    });
                });
            });
            // append myc fader
            if (!Y.one(Y.srpl.config('containers.fader'))) {
                Y.one('body').appendChild(Y.srpl.App.templates.fader());
            }
            t.overlayInitilize();
            t.set('container',t.get('overlay').get('boundingBox'));
            t.get('container')
                .one(Y.srpl.config('containers.main'))
                .setContent(Y.srpl.App.templates.overlay())
                .setStyles({
                    'width' : this.get('viewport').width
                });
            Y.each(t.get('businessess'),function(b,i){
                t.get('container').one(Y.srpl.config('containers.business')).append(Y.srpl.App.templates.list({'b':b,'width':t.get('viewport').width}));
            });
            t.carouselInitilize();
            t.initEvents();
        },
        /**
        * @method resize
        * @return {void}
        */
        resize: function(){
            if (this.get('overlay')) {
                this.get('overlay').set("centered", "body");
            }
            Y.srpl.util.resizeFader();
            this.get('loader').resize();
            this.syncUI();
        },
        /**
        * @method show
        * @return {void}
        */
        show: function(){
            var t = this,
                activeNode = t.get('container').one('#srpl-'+t.get('active'));

            activeNode
                .addClass('active')
                .siblings()
                    .removeClass('active');
            if (activeNode && !activeNode.getContent()) {
                window.response.business.id = t.get('active');
                this.get('businessModelList').add(window.response.business);
                var businessView = new Y.srpl.Business.View({
                    container: '#srpl-'+t.get('active'),
                    model: this.get('businessModelList').getById(t.get('active')),
                    hero: new Y.srpl.BusinessHero.Model(window.response.hero),
                    review: new Y.srpl.BusinessReview.Model(window.response.review)
                });
                businessView.on('resize',function(){
                    Y.log('BUSINESS VIEW RESIZE');
                    t.syncUI();
                });
                businessView.render();
                t.overlayShow();
                //             'business' : new Y.srpl.Business.Model(e.local.business)
                //         });
                // t.get('searchModel').query({
                //     'id': t.get('active')
                // },function(err,e){
                //     if (err) {
                //         Y.log('Srpl :: AppView : Error');
                //         Y.log(err);
                //         t.get('loader').hide();
                //         t.get('fader').hide();
                //     } else {
                //         Y.log(e.local.business);
                //         t.get('businessView').set('business',new Y.srpl.Business.Model(e.local.business));
                //         t.get('businessView').render();
                //         if (t.get('overlay')) {
                //             t.overlayShow();
                //         }
                //     }
                // });
            } else {
                this.get('businessModelList').getById(t.get('active')).set('state',true);
                if (t.get('overlay')) {
                    t.overlayShow();
                }
            }
        },
        /**
        * @method render
        * @return {void}
        */
        render: function(e){
            this.overlayRender();
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
        clear : function(){},

        // -- Event Handlers -------------------------------------------------------

        /**
        * @method _overlayClose
        * @params {e} e
        * @return {void}
        */
        _overlayClose: function(e){
            this.overlayClose();
        },
        /**
        * @method _carouselMoveLeft
        * @params {e} e
        * @return {void}
        */
        _carouselMoveLeft: function(e){
            this.carouselMove('previous');
        },
        /**
        * @method _carouselMoveRight
        * @params {e} e
        * @return {void}
        */
        _carouselMoveRight: function(e){
            this.carouselMove('next');
        }
    });

    Y.namespace('srpl.App');
    Y.srpl.App.View = AppView;

}, '@VERSION@',{
    requires:[
        'node',
        'view',
        'overlay',
        'cssgrids',
        'gallery-carousel',
        'gallery-carousel-anim',
        'substitute',
        'srpl-app-css',
        'srpl-app-button-css',
        'srpl-app-loader-view',
        'srpl-app-templates',
        'srpl-business-view',
        'srpl-search-model',
        'srpl-instrumentation-plugin',
        'srpl-util',
        'srpl-business-hero-model',
        'srpl-business-review-model',
        'srpl-business-model-list'
    ]
});