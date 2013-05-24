/**
 * foursquare plugin which extends foursquare view
 * @plugin srpl-foursquare-plugin
 * @requires plugin, srpl-foursquare-view
*/
YUI.add('srpl-foursquare-plugin', function(Y){
    var FoursquarePlugin = function(config){
        FoursquarePlugin.superclass.constructor.apply(this, arguments);
        this.host = config.host;
    };

    FoursquarePlugin.NAME = 'foursquarePlugin';
    FoursquarePlugin.NS = 'foursquare';

    // Extend nearby view
    Y.extend(FoursquarePlugin, Y.srpl.Foursquare.View, {});

    Y.namespace('srpl.Plugin');
    Y.srpl.Plugin.Foursquare = FoursquarePlugin;

},'@VERSION@',{requires:['plugin','srpl-foursquare-view']});