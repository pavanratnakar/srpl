/**
 * Create a new srpl-foursquare view class that extends Y.View and renders the current
 * state of a srpl-foursquare instance.
 * @module srpl-foursquare-view
 * @requires
*/
YUI.add('srpl-foursquare-view', function(Y){

    var FoursquareView = function(){
        FoursquareView.superclass.constructor.apply(this, arguments);
    };

    // Attributes and static properties for srpl-foursquare View.
    FoursquareView.ATTRS = {
        container : null,
        model : null
    };

    Y.extend(FoursquareView, Y.View, {
        eventListners : [],
        template: Y.srpl.Foursquare.templates.base,
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

    Y.namespace('srpl.Foursquare');
    Y.srpl.Foursquare.View = FoursquareView;
}, '@VERSION@',{
    requires:[
        'view',
        'srpl-foursquare-model',
        'srpl-foursquare-css',
        'srpl-foursquare-templates',
        'srpl-util',
        'srpl-config'
    ]
});