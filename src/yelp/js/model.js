/**
 * Yelp Model
 * @module srpl-yelp-model
*/
YUI.add('srpl-yelp-model', function(Y){
    var Yelp = function(){
        Yelp.superclass.constructor.apply(this, arguments);
    };

    // Attributes and static properties for srpl-yelp model which we are consuming
    Yelp.ATTRS = {};
    Yelp.NAME = 'yelp';

    Y.extend(Yelp, Y.Model,{
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

    Y.namespace('srpl.Yelp');
    Y.srpl.Yelp.Model = Yelp;

},'@VERSION@',{requires:['model']});
