/**
 * Business Model
 * @module srpl-business-model
*/
YUI.add('srpl-business-model', function(Y){
    var Business = function(){
        Business.superclass.constructor.apply(this, arguments);
    };

    // Attributes and static properties for srpl-business model which we are consuming
    Business.ATTRS = {
        "addr" : null,
        "city" : null,
        "closed_business" : null,
        "crossstreet" : null,
        "desc" : null,
        "detailurl" : null,
        "distance" : null,
        "dphone" : null, // phone number without code styling
        "dtitle" : null, // title stripped of html tags
        "hiconf" : null,
        "hideaddr" : null, // not using
        "id" : null,
        "lat" : {
            setter: function(value){
                if (typeof value === 'string'){
                    return parseFloat(value, 10);
                }
                return value;
            }
        },
        "listing_status" : null,
        "lon" : {
            setter: function(value){
                if (typeof value === 'string'){
                    return parseFloat(value, 10);
                }
                return value;
            }
        },
        "mapurl" : null,
        "nrating" : null,
        "nreview" : null,
        "phone" : null,
        "rating" : null,
        "readreviewsurl" : null,
        "reviewurl" : null,
        "state" : null,
        "title" : null,
        "type" : null,
        "website" : null,
        "websitelabel" : null,
        "zip" : null,
        "ycatsprimary" : null,
        "latestreview" : null
    };

    Business.NAME = 'business';

    Y.extend(Business, Y.View,{
        /**
        * The initializer function will run when a view is instantiated
        * Has a bunch of helper functions to convert the location to various formats
        * @method initializer
        * @return {void}
        */
        initializer: function(e){
            e = e || {};
            var t = this;

            if(!e.id){
                t.set('id',this.generateClientId());
            }
            // convert values to float
            Y.each(['lat', 'lon', 'rating'], function(a){
                if(Y.Lang.isNumber(parseFloat(t.get(a),10))){
                    t.set(a, parseFloat(t.get(a),10));
                }
            });
        },
        /**
        * @method geo
        * @return {geo} location geo object
        */
        geo: function(){
            return new Y.YMaps.GeoLocation({
                lat: this.getLatitude(),
                lon: this.getLongitude()
            });
        },
        /**
        * get business specific display value
        * @method displayValue
        * @return {string} dtitle
        */
        displayValue:function(){
            //return this.get('title'); // switched to dtitle as title has html tag present within it
            return this.get('dtitle');
        },
        /**
        * get business specific address
        * @method address
        * @return {string} address
        */
        address:function(){
            var addr='';

            if(this.get('addr')){
                addr += this.get('addr')+', ';
            }
            if(this.get('city')){
                addr += this.get('city')+', ';
            }
            if(this.get('state')){
                addr += this.get('state');
            }
            return addr;
        },
        /**
        * get full business address including the zip code
        * @method address
        * @return {string} address
        */
        fullAddress:function(){
            if (this.get('zip')) {
                return this.address() + ' ' + this.get('zip');
            } else {
                return this.address();
            }
        },
        /**
        * @method getLatitude
        * @return {tl} top left geo location object.
        */
        getLatitude : function(){
            return this.get('lat');
        },
        /**
        * @method getLongitude
        * @return {tl} top left geo location object.
        */
        getLongitude : function(){
            return this.get('lon');
        }
    },{
        /**
        * statics
        * @method validate
        * @return {void}
        */
        validate:function(){}
    });

    Y.namespace('srpl.Business');
    Y.srpl.Business.Model = Business;

},'@VERSION@',{requires:['model']});
