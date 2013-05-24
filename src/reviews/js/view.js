/**
 * Create a new srpl-reviews view class that extends Y.View and renders the current
 * state of a srpl-reviews instance.
 * @module srpl-reviews-view
 * @requires
*/
YUI.add('srpl-reviews-view', function(Y){

    var ReviewsView = function(){
        ReviewsView.superclass.constructor.apply(this, arguments);
    };

    // Attributes and static properties for srpl-reviews View.
    ReviewsView.ATTRS = {
        container : null,
        model : null
    };

    Y.extend(ReviewsView, Y.View, {
        eventListners : [],
        template: Y.srpl.Reviews.templates.base,
        // Specify delegated DOM events to attach to the srpl-business container.
        events:{
            '.srpl-reviews-tools button' : {
                'click' : '_showReviewType'
            }
        },
        /**
        * The initializer function will run when a view is instantiated
        * @method initializer
        * @return {void}
        */
        initializer: function(config){
            this.eventListeners = [];
        },
        /**
        * @method render
        * @return {boolean}
        */
        render: function(){
            this.get('container')
                .setContent(this.template())
                .show();
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
        * @method _showReviewType
        * @params {e} e
        * @return {void}
        */
        _showReviewType: function(e){
            var target = e.currentTarget,
                activeReviewContainer = this.get('container').one('.srpl-'+target.getData('type')+'-reviews');

            activeReviewContainer
                .show()
                .siblings()
                    .hide();
            target.ancestor('li')
                .addClass('active')
                .siblings()
                    .removeClass('active');
            this.fire('resize');
        }
    });

    Y.namespace('srpl.Reviews');
    Y.srpl.Reviews.View = ReviewsView;
}, '@VERSION@',{
    requires:[
        'view',
        'srpl-reviews-model',
        'srpl-reviews-css',
        'srpl-reviews-templates',
        'srpl-util',
        'srpl-config'
    ]
});