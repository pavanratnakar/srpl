/**
 * Search Model
 * @module srpl-search-model
*/
YUI.add('srpl-search-model', function(Y){
    var defaults = {
        // one box query params - http://twiki.corp.yahoo.com/view/YGeo/YMIOneSearchAPI
        // and - http://twiki.corp.yahoo.com/view/Localeng/GalileoSpecifications#FindLocationAPI
        // these are NOT attributes of the model
        params:{
            'obq':          null,   // onebox query - Location / Business category or POI followed by location
            'q':            null,
            'l':            null,   // local term - Business category or a point of interest
            'z':            null,   // current zoom
            'gclat':        null,   // Center latitude of the current map view
            'gclon':        null,   // Center longitude of the current map view
            'startoffset':  null,   // Index of first local result to return (default: 0)
            'hits':         null,   // Number of local results to return (default: 10)
            'woeid':        null,   // WOEID
            'name':         null,   // POI/AOI name or 3-letter Airport code
                                    // Ignored if location parameter is provided
            'line1':        null,
            'line2':        null,
            'line3':        null,
            'house':        null,
            'street':       null,
            'unittype':     null,   // Unit type
            'unit':         null,   // Unit/Suite/Apartment/Box
            'xstreet':      null,
            'postal':       null,
            'level4':       null,
            'level3':       null,
            'level2':       null,
            'level1':       null,
            'level0':       null,

            'locale':       null,   // Default is "en_US" (English/US)
            'start':        null,   // 0 -99
            'count':        null,   // count
            'offset':       null,   // Location setback in meters, intended to approximate a building location offset from the road center-line
                                    // Range is 0 to 100 (default: 15)
                                    // I have NO idea what the above means.
            'flags':        'JX',   // Option flags (characters are concatenated together):
                                    // 'A': Return data in AMF format
                                    // 'B': Return business information element for each point result (match quality is 80 or greater)
                                    // 'C': Only return coordinate data and match quality elements; do not return address data elements
                                    // 'D': Return DMA information element for each result
                                    //  * - 'E': DO NOT return woeid element. This impacts the Radius output, see Output Elements
                                    // 'E': Get expanded location information (center point of local search)
                                    // 'G': Return global area elements instead of US-specific elements
                                    // 'H': Return v4 hash code
                                    // 'I': Only return WOEIDs for WOE entities (see WOEEntity section)
                                    // 'J': Return data in JSON format
                                    // 'K': Return location key element for each result
                                    // 'L': Disable OneBox (return location only) <-- !important
                                    // 'M': Return MapImage URL for each result
                                    // 'N': Return non-matching text in pretext and posttext (use with gflags=N)
                                    // 'P': Return data in Serialized PHP format
                                    // 'Q': Return nearest commercial airport code element for each result
                                    // 'R': Return telephone area code element for each result
                                    // 'S': Return detailed street attributes (Prefix, Body, Suffix, etc)
                                    // 'T': Return Timezone information element for each result
                                    // 'W': Return WOE information element for each result (see WOEEntity section)
                                    // 'X': Return bounding box element for each area result (match quality less than 70)
                                    // 'Y': Return area level names element for each result (not implemented)
            'gflags':       null,   // Geocoding option flags (characters are concatenated together):
                                    // 'A': Return neighborhood names for each result
                                    // 'C': Look up cross streets for each result
                                    // 'E': Return street edge IDs and details for each result (internal)
                                    // 'F': Return full result set (no auto disambiguation) -- under development, confirm before using
                                    // 'H': Disable "exception list"/"prominent cities" processing, internal, approval required for use
                                    // 'L': Limit results to the locale country
                                    // 'N': Disable use of Navteq data (Webraska back end), internal, approval required for use
                                    // 'P': Precise match only, see round-trip geocoding -- under development, approval required for use
                                    // 'Q': Quick mode, enable exact matches only for free-form input
                                    // 'R': Reverse geocode coordinates for each result
                                    // 'S': Disable exact match on line1-4 concatenated string (internal use only, subject to change)
                                    // 'T': Disable use of WOE data, internal, approval required for use
                                    // 'U': Exclude US results (sorta), internal, approval required for use
                                    // 'X': Return exit coordinates (if known) for each result (not implemented)
            'cflags':       null,   // Reverse Geocoding Constraint flags (not implemented):
                                    // 'P': Pedestrian only
                                    // 'C': Car only
                                    // Default is no constraint

            'imw':          null,   // The Map Image Web Service - Use this only on server side?
            'imh':          null,
            'imf':          null,
            'ims':          null,
            'imi':          null,


                                    // partner reporting. not sure we'll use it from the search model
            'oper':         null,   // Type of operation: start, pan, zoom, ...
            'cltype':       null,   // Client type: aura, gps, mobile, etc.
            'clid':         null,   // Client id: any string

            'appid':        Y.srpl.config('ymaps.appid'),
            'local_count':  null,    // local cound required
            'userLat':      null, // user lat
            'userLon':      null, // user lon
            'userRadius':   null, // user map view radius
            'obd':          null, // params passed by gossip
            'obflags':      'D'   // added to disable ResultSet.Result.directions.Result as part of response
        }
    };

    var SearchModel = function(){
        SearchModel.superclass.constructor.apply(this, arguments);
    };

    SearchModel.NAME = 'searchModel';

    Y.extend(SearchModel, Y.Model, {
        /**
        * query options
        * @method queryOptions
        * @params {hash} options
        * @return {hash} ret
        */
        queryOptions:function(options){
            var ret = {};
            Y.each(defaults.params, function(val, key){
                if (Y.Lang.isValue(options[key]) || Y.Lang.isValue(defaults.params[key])) {
                    ret[key] = options[key] || defaults.params[key];
                }
            });
            return ret;
        },
        /**
        * handle business response
        * @method handleBusiness
        * @params {hash} data
        * @return {hash} response
        */
        handleBusiness:function(data,q){
            q = q || null;
            var businesses = Y.Array(Y.srpl.util.atPath(data, 'local.listing'));
            businesses = Y.Array.filter(businesses,function(e){
                return e;
            });
            return {
                business : businesses[0]
            };
        },
        /**
        * format business, location, direction response
        * @method formatResponse
        * @params {hash} data
        * @params {string} q
        * @return {hash} response
        */
        formatResponse: function(data,q){
            var response = {};
            if (Y.srpl.util.atPath(data, 'ResultSet.Result')) {
                response.local = this.handleBusiness(Y.srpl.util.atPath(data, 'ResultSet.Result'),q);
            }
            return response;
        },
        /**
        * used to  fire service call
        * @method query
        * @params {hash} options
        * @params {function }callback
        * @return {void}
        */
        query: function(options, callback){ // callback should be called with (err, data)
            var t = this,
                success = false;

            options = options || {};
            if (typeof options === 'string') {
                options = {
                    obq: options
                };
            }
            Y.srpl.jsonp((options.url || Y.srpl.config('search.gwsServer')) + '/onebox?' + Y.QueryString.stringify(t.queryOptions(options)),{
                on:{
                    success: function(data){
                        callback(null,t.formatResponse(data,options.obq));
                    },
                    failure: function(err){
                        callback(err);
                    },
                    timeout: function(err){
                        callback(err);
                    }
                }
            },{
                // checking caching
                cacheWhen: function(data){
                    if (data && data.ResultSet && data.ResultSet.Error === '0') {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            });

            return t;
        }
    });

    Y.namespace('srpl.Search');
    Y.srpl.Search.Model = SearchModel;

}, '@VERSION@',{
    requires:['model', 'srpl-config','querystring', 'srpl-jsonp', 'srpl-business-model', 'srpl-util']
});