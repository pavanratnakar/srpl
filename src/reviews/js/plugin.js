/**
 * reviews plugin which extends yelp view
 * @plugin srpl-reviews-plugin
 * @requires plugin, srpl-reviews-view
*/
YUI.add('srpl-reviews-plugin', function(Y){
    var ReviewsPlugin = function(config){
        ReviewsPlugin.superclass.constructor.apply(this, arguments);
        this.host = config.host;
    };

    ReviewsPlugin.NAME = 'reviewsPlugin';
    ReviewsPlugin.NS = 'reviews';

    // Extend reviews view
    Y.extend(ReviewsPlugin, Y.srpl.Reviews.View, {});

    Y.namespace('srpl.Plugin');
    Y.srpl.Plugin.Reviews = ReviewsPlugin;

},'@VERSION@',{requires:['plugin','srpl-reviews-view']});