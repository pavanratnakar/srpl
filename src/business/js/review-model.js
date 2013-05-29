/**
 * Business Review Model
 * @module srpl-business-review-model
*/
YUI.add('srpl-business-review-model', function(Y){
    var BusinessReview = function(){
        BusinessReview.superclass.constructor.apply(this, arguments);
    };

    // Attributes and static properties for srpl-business-review model which we are consuming
    BusinessReview.ATTRS = {
        'reviewCount' : null,
        'averageRating' : null,
        'reviewUrl' : null,
        'source' : null 
    };
    BusinessReview.NAME = 'businessReview';

    Y.extend(BusinessReview, Y.Model,{
        /**
        * The initializer function will run when a view is instantiated
        * Has a bunch of helper functions to convert the location to various formats
        * @method initializer
        * @return {void}
        */
        initializer: function(e){
            e = e || {};
            if (!e.id) {
                this.set('id',this.generateClientId());
            }
        }
    },{
        /**
        * statics
        * @method validate
        * @return {void}
        */
        validate:function(){}
    });

    Y.namespace('srpl.BusinessReview');
    Y.srpl.BusinessReview.Model = BusinessReview;

},'@VERSION@',{requires:['model']});