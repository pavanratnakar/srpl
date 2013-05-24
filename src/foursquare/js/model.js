/**
 * Foursquare Model
 * @module srpl-foursquare-model
*/
YUI.add('srpl-foursquare-model', function(Y){
    var Foursquare = function(){
        Foursquare.superclass.constructor.apply(this, arguments);
    };

    // Attributes and static properties for srpl-foursquare model which we are consuming
    Foursquare.ATTRS = {};
    Foursquare.NAME = 'foursquare';

    Y.extend(Foursquare, Y.Model,{
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

    Y.namespace('srpl.Foursquare');
    Y.srpl.Foursquare.Model = Foursquare;

},'@VERSION@',{requires:['model']});
