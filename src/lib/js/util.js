YUI.add('srpl-util',function(Y){
    "use strict";

    // https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Array/Reduce#Browser_compatibility
    if (!Array.prototype.reduce) {
      Array.prototype.reduce = function reduce(accumulator){
        if (this===null || this===undefined) throw new TypeError("Object is null or undefined");
        var i = 0, l = this.length >> 0, curr;

        if(typeof accumulator !== "function") // ES5 : "If IsCallable(callbackfn) is false, throw a TypeError exception."
          throw new TypeError("First argument is not callable");

        if(arguments.length < 2) {
          if (l === 0) throw new TypeError("Array length is 0 and no second argument");
          curr = this[0];
          i = 1; // start accumulating at the second element
        }
        else
          curr = arguments[1];

        while (i < l) {
          if(i in this) curr = accumulator.call(undefined, curr, this[i], i, this);
          ++i;
        }

        return curr;
      };
    }

    // some modding to the environment
    var Util = {
        debounce : function(func, wait, immediate){
            var timeout;
            return function () {
                var context = this,
                    args = arguments;
                var later = function () {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow){
                    func.apply(context, args);
                }
            };
        },
        atPath: function(o, path){
            var pointer = o;
            var failed = false;
            Y.each(path.split('.'), function(p){
                if(Y.Lang.isValue(pointer[p]) && !failed)
                    pointer = pointer[p];
                else
                    failed = true;
            });
            return failed? null : pointer;
        },
        setAtPath: function(o, key, val){
            if (typeof key === 'string') {
                var path = key.split('.');
                var node = o || {};
                Y.times(path.length - 1 , function(i){
                    var _node = node[path[i]];
                    if(!Y.Lang.isValue(_node)){
                        _node = node[path[i]] = {};
                    }
                    node = _node;
                });
                node[path[path.length-1]] = val;
            }
            else{
                //setting object hash by deepcopy
                var t = this;
                Y.each(this.paths(key), function(p, i){
                    t.setAtPath(o, p.key, p.value);
                });
            }
        },
        paths: function(o){
            // enumerate json paths to all leaves
            var paths = [];
            Y.each(Y.Object.keys(o), function(k){
                var _t = typeof o[k];
                if ((!Y.Lang.isValue(o[k])) || _t==='string' || _t==='number' || Y.Lang.isArray(o[k])  || _t==='boolean') {
                    paths.push({
                        key:k,
                        value: o[k]
                    });
                    return;
                } else {
                    var childPaths = Y.srpl.util.paths(o[k]);
                    paths = paths.concat(Y.times(childPaths.length, function(i){
                        return({
                            key:k + '.' + childPaths[i].key,
                            value: childPaths[i].value
                        });
                    }));
                }
            });
            return paths;
        },
        assets: function(path){
            Y.srpl._assets = Y.srpl._assets || {};


            // todo - cleanup this final url generation logic to handle cdns, etc.
            // separate into module and path
            path = path.split('/');
            var module = path[0];
            path.splice(0,1);
            path = path.join('/');
            // for now just use base + path
            if(YUI_config.groups.srpl.combine===true){
                // harcoding cdnbase for now, need a cleaner way to do this (though I doubt it'll change any time soon)
                // [bug 5892107] as we are now removing the hash file and depending on the version number for cache busting
                //return 'http://l.yimg.com/' + YUI_config.groups.srpl.root + module + '/' + (((Y.srpl._assets[module]||{})[path]) || path);
                return 'http://l.yimg.com/' + YUI_config.groups.srpl.root + module + '/' + path;
                // return (YUI_config.groups.srpl.base + module + '/' + (((Y.srpl._assets[module]||{})[path]) || path));
            }
            return YUI_config.groups.srpl.base + module + '/' + path;
        },
        /**
        * Accessibility best focus
        * @method bestFocus
        * @param {object} data
        * @return {void}
        */
        bestFocus:function(data){
            var focus = false;
            data.container.all(data.type).some(function(node,index) {
                if (!node.get('value')) {
                    if (!Y.one('#' + node.get('id') + ':focus')) {
                        Y.later(Y.srpl.config('app.focusTimeout'), {}, function(){
                            node.focus();
                        });
                        focus = true;
                        return true;
                    }
                }
            });
            if (!focus) {
                data.container.all(data.type).item(0).focus();
            }
        },
        /**
        * @method showFader
        * @return {void}
        */
        showFader : function(){
            Y.one('#srpl-fader-container').setStyles({
                display : 'block',
                visibility : 'visible',
                height : Y.one('body').get('offsetHeight'),
                width :  Y.one('body').get('offsetWidth')
            });
            Y.one('#srpl-fader-overlay').addClass('anim');
        },
        /**
        * @method hideFader
        * @return {void}
        */
        hideFader : function(){
            Y.one('#srpl-fader-overlay').removeClass('anim');
            Y.one('#srpl-fader-container').hide();
        },
        /**
        * @method resizeFader
        * @return {void}
        */
        resizeFader : function(e){
            e = e || {};
            Y.one('#srpl-fader-container').setStyles({
                height : e.height || Y.one('body').get('offsetHeight'),
                width :  e.width || Y.one('body').get('offsetWidth')
            });
        },
        /**
        * @method tinifyURL
        * @return {void}
        */
        tinifyURL : function(url, callback){
            Y.YQL('INSERT INTO yahoo.y.ahoo.it (url) values ("'+url+'")', function(r) {
                callback && callback (Y.srpl.util.atPath(r, 'query.results.url'));
            });
        },
        /**
        * @method checkNodeHidden
        * @return {void}
        */
        checkNodeHidden : function(node){
            if ((node.get('offsetWidth') === 0 && node.get('offsetHeight') === 0) || node.getStyle('display') === 'none') {
                return true;
            } else {
                return false;
            }
        },
        /**
        * @method cleanArray
        * @return {array}
        */
        cleanArray: function(a){
            return Y.Array.filter(a,function(e){
                return e;
            });
        },
        /**
        * @method namespaceExists
        * @return {function}
        */
        namespaceExists : function (namespace) {
            var tokens = namespace.split('.');
            return tokens.reduce(function(prev, curr) {
                return (typeof prev == "undefined") ? prev : prev[curr];
            }, window);
        },
        /**
        * @method sanitize
        * @return {string}
        */
        sanitize: function(str){
            return Y.Escape.html(str);
        },
        /**
        * @method truncator
        * @return {string}
        */
        stringTruncator : function(str,limit){
            if (str.length < limit ) return str;
            return str.slice(0,limit )+'<span> ...</span><a href="javascript:void(0);" class="srpl-more">more</a>'+
                '<span style="display:none;">'+ str.slice(limit ,str.length)+'<span> ...</span><a href="javascript:void(0);" class="srpl-less">less</a></span>';
        },
        /**
        * TODO : Needs translation
        * @method truncator
        * @return {string}
        */
        domTruncator : function(container,el,limit,type){
            type = type || 'hide';
            if (container.all(el).size() > limit) {
                if (type === 'hide') {
                    container.one('.srpl-more-details')
                        .one('a')
                            .setContent('View More Details');
                } else {
                    container.one('.srpl-more-details')
                        .one('a')
                            .setContent('View Less Details');
                }
                container.one('.srpl-more-details').show();
                container.all(el).slice(limit).toggleClass('hide');
                container.one('.srpl-more-details').toggleClass('srpl-view-more');
            }
        },
        /**
        * @method _destructor
        * @return {array}
        */
        _destructor: function(eventListeners){
            if (eventListeners && eventListeners.length > 0) {
                Y.Array.each(eventListeners,function(e,i){
                    e.detach();
                    e = null;
                });
                eventListeners = [];
            }
            return [];
        }
    };

    Y.namespace('srpl');
    Y.srpl.util = Util;


},'@VERSION@',{requires:['oop', 'node', 'transition', 'escape']});
