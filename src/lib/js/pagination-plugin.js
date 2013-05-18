YUI.add('srpl-lib-pagination-plugin', function(Y){

    // patching up search model with a little viewery. Acts as a binder.
    var PaginationPlugin = function(config){
        this.host = config.host;
        PaginationPlugin.superclass.constructor.apply(this, arguments);
    };

    var defaults = {
        // Works well with maxNumericLinks set as an odd number
        maxNumericLinks : 5
    };

    PaginationPlugin.NAME = 'paginationPlugin';
    PaginationPlugin.NS = 'pagination';

    PaginationPlugin.ATTRS = {
        current : null,
        limit : null,
        total : null
    };

    Y.extend(PaginationPlugin, Y.Plugin.Base, {
        eventListeners : [],
        /**
        * @method initEvents
        * @return {void}
        */
        initEvents : function(){
            var t = this,
                index,
                previousClickHandler,
                paginateClickHandler,
                nextClickHandler;

            previousClickHandler = t.get('host').delegate({
                click: function (e) {
                    index = t.get('host').one('.active').getData('paginate');
                    t.fire('paginate',{
                        number : (parseInt(index,10) - 1)
                    });
                }
            }, '.previous');
            t.eventListeners.push(previousClickHandler);

            paginateClickHandler = t.get('host').delegate({
                click: function (e) {
                    t.fire('paginate',{
                        number : parseInt(e.currentTarget.getData('paginate'),10)
                    });
                }
            }, '.paginate');
            t.eventListeners.push(paginateClickHandler);

            nextClickHandler = t.get('host').delegate({
                click: function (e) {
                    index = t.get('host').one('.active').getData('paginate');
                    t.fire('paginate',{
                        number : (parseInt(index,10) + 1)
                    });
                }
            }, '.next');
            t.eventListeners.push(nextClickHandler);
        },
        /**
            * The initializer function will run when the plugin is instantiated
        * @method initializer
        * @return {void}
        */
        initializer:function(config){
            this.eventListeners = [];
            this.initEvents();
        },
        /**
        * @method render
        * @return {void}
        */
        render : function(){
            var t = this,
                current = t.get('current') || 1,
                totalNumberOfPages = Math.ceil(t.get('total')/t.get('limit')),
                navCount = Math.min(Math.ceil(t.get('total')/t.get('limit')), defaults.maxNumericLinks),
                previous = (t.get('current')!==1)? true : false,
                next = (t.get('current') !== totalNumberOfPages) ? true : false,
                navStart = 1;

            if (current > Math.ceil(defaults.maxNumericLinks/2) ) {
                while(navStart+navCount <= totalNumberOfPages && navStart < (current - Math.floor(defaults.maxNumericLinks/2))) {
                    navStart++;
                }
            }

            t.get('host').append(Y.srpl.Lib.templates.pagination({
                previous : previous,
                next : next,
                selected : current,
                start : (current-1)*t.get('limit')+1,
                end : (current*t.get('limit') > t.get('total')) ? t.get('total') : current*t.get('limit'),
                total : t.get('total'),
                navStart : navStart,
                navCount : navCount
            }));
        },
        /**
        * @method destructor
        * @return {void}
        */
        destructor : function(){
            this.eventListeners = Y.srpl.util._destructor(this.eventListeners);
        }
    });

    Y.namespace('srpl.Plugin');
    Y.srpl.Plugin.Pagination = PaginationPlugin;

},'@VERSION@',{requires:['plugin','srpl-lib-css','srpl-lib-templates']});