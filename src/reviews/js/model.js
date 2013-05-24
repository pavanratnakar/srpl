/**
 * Reviews Model
 * @module srpl-reviews-model
*/
YUI.add('srpl-reviews-model', function(Y){
    var Reviews = function(){
        Reviews.superclass.constructor.apply(this, arguments);
    };

    // Attributes and static properties for srpl-reviews model which we are consuming
    Reviews.ATTRS = {};
    Reviews.NAME = 'reviews';

    Y.extend(Reviews, Y.Model,{
        /**
        * @method initializer
        * @return {void}
        */
        initializer: function(e){}
    },{
        /**
        * statics
        * @method validate
        * @return {void}
        */
        validate:function(){}
    });

    Y.namespace('srpl.Reviews');
    Y.srpl.Reviews.Model = Reviews;

},'@VERSION@',{requires:['model']});
