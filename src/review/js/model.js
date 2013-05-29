/**
 * Review Model
 * @module srpl-review-model
*/
YUI.add('srpl-review-model', function(Y){
    var Review = function(){
        Review.superclass.constructor.apply(this, arguments);
    };

    // Attributes and static properties for srpl-review model which we are consuming
    Review.ATTRS = {
        'reviewCount' : null,
        'averageRating' : null,
        'reviewUrl' : null,
        'source' : null
    };
    Review.NAME = 'Review';

    Y.extend(Review, Y.Model,{
        /**
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

    Y.namespace('srpl.Review');
    Y.srpl.Review.Model = Review;

},'@VERSION@',{requires:['model']});