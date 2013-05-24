/**
 * Create a new srpl-yelp view class that extends Y.View and renders the current
 * state of a srpl-yelp instance.
 * @module srpl-yelp-view
 * @requires
*/
YUI.add('srpl-yelp-view', function(Y){

    var YelpView = function(){
        YelpView.superclass.constructor.apply(this, arguments);
    };

    // Attributes and static properties for srpl-yelp View.
    YelpView.ATTRS = {
        container : null,
        model : null
    };

    Y.extend(YelpView, Y.View, {
        eventListners : [],
        template: Y.srpl.Yelp.templates.base,
        // Specify delegated DOM events to attach to the srpl-business container.
        events:{},
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
        }
    });

    Y.namespace('srpl.Yelp');
    Y.srpl.Yelp.View = YelpView;
}, '@VERSION@',{
    requires:[
        'view',
        'srpl-yelp-model',
        'srpl-yelp-css',
        'srpl-yelp-templates',
        'srpl-util',
        'srpl-config'
    ]
});