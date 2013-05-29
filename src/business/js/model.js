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
        "id": null,
        "lat" : {
            setter: function(value){
                if (typeof value === 'string'){
                    return parseFloat(value, 10);
                }
                return value;
            }
        },
        "lon" : {
            setter: function(value){
                if (typeof value === 'string'){
                    return parseFloat(value, 10);
                }
                return value;
            }
        },
        "title": null,
        "listing_status" : null,
        "primary_category": null,
        "categories": {
            '0': {
                'id': null,
                'url': null,
                'name': null
            },
            '1' : {
                'id': null,
                'url': null,
                'name': null
            },
            '2' : {
                'id': null,
                'url': null,
                'name': null
            }
        },
        "address": null,
        "phone": null,
        "website": {
            "url": null,
            "label": null
        },
        "description": null,
        "thumbnail": {
            "thumbnails" : {
                0: {
                    "id": null,
                    "href": null,
                    "src": null
                },
                1: {
                    "id": null,
                    "href": null,
                    "src": null
                },
                2: {
                    "id": null,
                    "href": null,
                    "src": null
                }
            },
            "count": null,
            "add_photo_link": null
        },
        "hours": {
            'status': null,
            'hours': {
                0: {
                    'desc' : null
                },
                1: {
                    'desc' : null
                },
                2: {
                    'desc' : null
                }
            }
        },
        "payment": null,
        "ambiance": null,
        "features": null,
        "attire": null,
        "price": null,
        "suggest_an_edit": null
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
            if (!e.id) {
                this.set('id',this.generateClientId());
            }
        },
        /**
        * @method geo
        * @return {geo} location geo object
        */
        geo: function(){
            return new Y.YMaps.GeoLocation({
                lat: this.get('lat'),
                lon: this.get('lon')
            });
        },
        /**
        * @method getNamedAddress
        * @return {string} displayValue+address
        */
        getNamedAddress : function(term){
            return this.get('title')+(term || ', ')+this.get('address');
        },
        /**
        * @method getBusinessUrl
        * @return {string}
        */
        getBusinessUrl : function(){
            return Y.srpl.config('business.localServer')+'/info-'+this.get('id');
        },
        getThumbnailGalleryPhotos : function(){
            return [];
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