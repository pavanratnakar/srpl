YUI.add('srpl-template', function(Y){
    // template helpers
    var $ = {
        translate: function(){}
    };
	// from jammit's jst.js
	var template = function (str) {
        var fn = new Function('obj', 'var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push(\'' + str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/<%=([\s\S]+?)%>/g, function (match, code) {
            return "'," + code.replace(/\\'/g, "'") + ",'";
        }).replace(/<%([\s\S]+?)%>/g, function (match, code) {
            return "');" + code.replace(/\\'/g, "'").replace(/[\r\n\t]/g, ' ') + "__p.push('";
        }).replace(/\r/g, '\\r').replace(/\n/g, '\\n').replace(/\t/g, '\\t') + "');}return __p.join('');");
        return (function(options){
            options = options||{};
            options.Y = options.Y || Y;
            // todo - helpers: translate
            options.assets = options.assets || Y.srpl.util.assets;
            options.translate = options.translate || $.translate;
            options.sanitize = options.sanitize || Y.srpl.util.sanitize;
            return fn(options);
        });
    };
    Y.template = template;
},'@VERSION@', {requires:['base', 'srpl-util']});