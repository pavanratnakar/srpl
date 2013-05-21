/**
 * Search Model
 * @module srpl-search-model
*/
YUI.add('srpl-search-model', function(Y){
    var defaults = {
        params:{
            'id':          null,   // onebox query - Location / Business category or POI followed by location
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
        handleBusiness:function(data){
            return {
                business : Y.srpl.util.atPath(data, 'listing')
            };
        },
        /**
        * format business, location, direction response
        * @method formatResponse
        * @params {hash} data
        * @return {hash} response
        */
        formatResponse: function(data){
            var response = {};
            if (Y.srpl.util.atPath(data, 'local')) {
                response.local = this.handleBusiness(Y.srpl.util.atPath(data, 'local'));
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
                    id: options
                };
            }
            Y.srpl.jsonp((options.url || Y.srpl.config('search.server')) + '?' + Y.QueryString.stringify(t.queryOptions(options)),{
                on:{
                    success: function(data){
                        callback(null,t.formatResponse(data));
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
                    // if (data && data.ResultSet && data.ResultSet.Error === '0') {
                    //     return true;
                    // }
                    // else {
                    //     return false;
                    // }
                    return true;
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