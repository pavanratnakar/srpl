/**
 * yelp plugin which extends yelp view
 * @plugin srpl-yelp-plugin
 * @requires plugin, srpl-yelp-view
*/
YUI.add('srpl-yelp-plugin', function(Y){
    var YelpPlugin = function(config){
        YelpPlugin.superclass.constructor.apply(this, arguments);
        this.host = config.host;
    };

    YelpPlugin.NAME = 'yelpPlugin';
    YelpPlugin.NS = 'yelp';

    // Extend yelp view
    Y.extend(YelpPlugin, Y.srpl.Yelp.View, {});

    Y.namespace('srpl.Plugin');
    Y.srpl.Plugin.Yelp = YelpPlugin;

},'@VERSION@',{requires:['plugin','srpl-yelp-view']});