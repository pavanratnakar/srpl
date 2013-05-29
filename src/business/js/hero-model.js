/**
 * Business Hero Model
 * @module srpl-business-hero-model
*/
YUI.add('srpl-business-hero-model', function(Y){
    var BusinessHero = function(){
        BusinessHero.superclass.constructor.apply(this, arguments);
    };

    // Attributes and static properties for srpl-business-hero model which we are consuming
    BusinessHero.ATTRS = {
        'image' : {
            'src' : null,
            'height' : null,
            'width' : null
        },
        'palette' : {
            'button' : null,
            'text' : null
        }
    };
    BusinessHero.NAME = 'businessHero';

    Y.extend(BusinessHero, Y.Model,{
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

    Y.namespace('srpl.BusinessHero');
    Y.srpl.BusinessHero.Model = BusinessHero;

},'@VERSION@',{requires:['model']});