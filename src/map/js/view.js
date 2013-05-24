YUI.add('srpl-map-view', function(Y){

    var Map = function(){
        Map.superclass.constructor.apply(this, arguments);
    };

    Map.NAME = Y.YMaps.Map.NAME;
    Y.extend(Map, Y.YMaps.Map,{
        /**
        * @method render
        * @return function
        */
        render: function(callback){
            callback = callback || function(){};
            if (!this.get('_isRenderComplete')) {
                this.onceAfter('renderComplete', callback);
                if (!this._rendering) {
                    this._rendering = true;
                    Y.YMaps.Map.prototype.render.apply(this, arguments);
                }
            } else {
                callback();
            }
        },
        /**
        * @method setControls
        * @return {object}
        */
        setControls: function(config){
            var t = this,
                zoom,
                scale,
                mouse,
                keyboard,
                traffic;

            if (config.zoomControl) {
                zoom = new Y.YMaps.ControlSmallSimpleZoom({ map: this });
                zoom.get('boundingBox').setStyles({
                    top: '10px',
                    left: '10px'
                });
                this.draw(zoom);
            }

            if (config.scale) {
                scale = new Y.YMaps.ControlScale({ map: this });
                this.draw(scale);
            }

            if (config.mouse) {
                mouse = new Y.YMaps.ControlMouse({ map: this });
                this.draw(mouse);
            }

            if (config.keyboard) {
                keyboard = new Y.YMaps.ControlKeyboard({ map: this });
                this.draw(keyboard);
            }
        },
        /**
        * rem objects map
        * @method remove
        * @return {void}
        */
        rem : function(object){
            if (object) {
                if(object instanceof Y.YMaps.RouteUI) {
                    object.fire("route:routeReset");
                }
                this.remove(object);
            }
        },
        /**
        * @method clear
        * @return {object}
        */
        clear : function(){}
    });

    Y.namespace('srpl');
    Y.srpl.Map = Map;

}, '@VERSION@', {requires:['ymaps','srpl-map-css']});