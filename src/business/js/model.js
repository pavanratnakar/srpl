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
        "accountid" : null,
        "addr" : null,
        "ambiance" : null,
        "bizcard" : null,
        "bppurl" : null,
        "brands" : null,
        "chainid" : null,
        "chainurl" : null,
        "city" : null,
        "closed_business" : null,
        "corrections" : null,
        "crawled_photos" : null,
        "crawled_videos" : null,
        "crossstreet" : null,
        "csubmitclosed" : null,
        "cuisine" : null,
        "department" : null,
        "desc" : null,
        "detailurl" : null,
        "dinmenuurl" : null,
        "dinresurl" : null,
        "directiontourl" : null,
        "disphoo" : null,
        "distance" : null,
        "dphone" : null,
        "dresscode" : null,
        "dtitle" : null, // title stripped of html tags

        "full_size_photos" : null,


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
        "latestreview" : null,
        "categories" : null
    };
    Business.NAME = 'business';

    Y.extend(Business, Y.Model,{
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
                t.set('id',t.generateClientId());
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
            return this.get('dtitle');
        },
        /**
        * @method getNamedAddress
        * @return {string} displayValue+address
        */
        getNamedAddress : function(term){
            return this.displayValue()+(term || ', ')+this.address();
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
        },
        /**
        * @method getPrimaryCategory
        * @return {string}
        */
        getPrimaryCategory : function(){
            if (this.get('ycatsprimary')) {
                if (Y.Lang.isArray(this.get('ycatsprimary').data)) {
                    return this.get('ycatsprimary').data[0].name;
                }
                return this.get('ycatsprimary').data.name;
            }
            return false;
        },
        /**
        * @method getPrimaryCategory
        * @return {string}
        */
        getThumbnailGalleryPhotos : function(){
            var photos = [];
            if (this.get('full_size_photos') && this.get('full_size_photos').count > 0) {
                if (Y.Lang.isArray(this.get('full_size_photos').photo)) {
                    Y.each(this.get('full_size_photos').photo,function(p,i){
                        photos.push(p['full']['url']);
                    });
                } else {
                    photos.push(this.get('full_size_photos').photo.full.url);
                }
            }
            return photos;
        },
        /**
        * @method getBusinessUrl
        * @return {string}
        */
        getBusinessUrl : function(){
            return Y.srpl.config('business.localServer')+'/info-'+this.get('id');
        },
        /**
        * @method getCateoryUrl
        * @return {string}
        */
        getCateoryUrl : function(category){
            return Y.srpl.config('business.searchServer')+'?p='+category.name+'&addr='+encodeURIComponent(this.address())+'&limcat='+category.ycat+'';
        },
        /**
        * @method getCategories
        * @return {array}
        */
        getCategories : function(){
            var categories = [];
            if (Y.Lang.isArray(this.get('ycats').data)) {
                Y.each(this.get('ycats').data,function(c,i){
                    if (c) {
                        categories.push(c);
                    }
                });
            } else if (this.get('ycats').data) {
                categories.push(this.get('ycats').data);
            }
            return categories;
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
