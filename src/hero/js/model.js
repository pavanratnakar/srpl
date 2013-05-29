/**
 * Hero Model
 * @module srpl-hero-model
*/
YUI.add('srpl-hero-model', function(Y){
    var Hero = function(){
        Hero.superclass.constructor.apply(this, arguments);
    };

    // Attributes and static properties for srpl-hero model which we are consuming
    Hero.ATTRS = {
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
    Hero.NAME = 'Hero';

    Y.extend(Hero, Y.Model,{
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

    Y.namespace('srpl.Hero');
    Y.srpl.Hero.Model = Hero;

},'@VERSION@',{requires:['model']});