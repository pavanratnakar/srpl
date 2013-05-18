/**
 * Create a new srpl-app-loader view class that extends Y.View and renders the current
 * state of a srpl-app-loader instance.
 * @module srpl-app-loader-view
 * @requires
    node,
    srpl-app-templates,
    srpl-util,
    srpl-config
*/
YUI.add('srpl-app-loader-view',function(Y){

    var AppLoaderView = function(){
        AppLoaderView.superclass.constructor.apply(this, arguments);
    };
    // Attributes and static properties for srpl-app-loader View.
    AppLoaderView.ATTRS = {
        container : '',
        app : '',
        wait : ''
    };

    AppLoaderView.NAME = 'appLoaderView';
    AppLoaderView.NS = 'app';

    Y.extend(AppLoaderView, Y.View, {
        // Assign base template that will be used to render view
        template: Y.srpl.App.templates.loader,
        /**
        * @method cancelWait
        * @return {void}
        */
        cancelWait : function(){
            if (this.get('wait')) {
                this.get('wait').cancel();
            }
        },
        /**
        * @method countDown
        * @return {void}
        */
        countDownBegin : function(){
            var t = this;

            t.cancelWait();
            t.set('wait',Y.later( Y.srpl.config('loader.timer'), {}, function () {
                if (!Y.srpl.util.checkNodeHidden(t.get('container'))) {
                    t.hide();
                    t.fire('error');
                }
            }));
        },
        /**
        * The initializer function will run when a view is instantiated
        * @method initializer
        * params {hash} config
        * @return {void}
        */
        initializer: function(config){
            Y.one('body').appendChild(this.template());
        },
        /**
        * show loader
        * @method render
        * @return {void}
        */
        render: function(){
            this.get('container').setStyles({
                display : 'block',
                visibility : 'visible',
                height : this.get('app').get('body').height,
                width :  this.get('app').get('body').width
            });
            Y.all('.ymap-tilebody').addClass('blurry');
            this.countDownBegin();
        },
        /**
        * hide loader
        * @method hide
        * @return {void}
        */
        hide: function(){
            this.get('container').hide();
            Y.all('.ymap-tilebody').removeClass('blurry');
        },
        /**
        * resize loader container
        * @method resize
        * @return {void}
        */
        resize : function(e){
            this.get('container').setStyles({
                height : e.height,
                width :  e.width
            });
        }
    });

    Y.namespace('srpl.App.Loader');
    Y.srpl.App.Loader.View = AppLoaderView;

}, '@VERSION@',{
    requires:[
        'node',
        'srpl-app-templates',
        'srpl-util',
        'srpl-config'
    ]
});