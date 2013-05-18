var _ = require('underscore'),
    path = require('path');

exports.camel = function(str) {
    return str.replace(/(\-[a-z])/g,
    function($1) {
        return $1.toUpperCase().replace('-', '');
    });
};

exports.capitalize = function(str) {
    return str.charAt(0).toUpperCase() + str.substring(1);
};

exports.compress = {
    js: function(script){
        // remove logger statements
        // thanks to http://yui.github.com/shifter/
        var ylog_regex = /^.*?(?:window.logger|Y.log).*?(?:;|\).*;|(?:\r?\n.*?)*?\).*;).*;?.*?\r?\n/mg;
        var match;
        while (match = ylog_regex.exec(script)) {
            script = script.replace(match[0],'');
        }

        var uglify = require('uglify-js');
        var jsp = uglify.parser,
            pro = uglify.uglify;

        return pro.gen_code(pro.ast_mangle(pro.ast_squeeze(jsp.parse(script||''))));
    },
    css: function(css){
        return(require('./cssmin.js').cssmin(css));
    }
};

exports.analyze = {
    js: function(script, module, file, config){
        var burrito = require('burrito');
        var ret ={};

        burrito(script, function(node){
            var value = _.flatten(node.node.slice(1));
            if (node.name === 'object' && value[0] === 'requires') {
                var parent = node.parent();
                if (parent && parent.node[1]) {
                    var n = parent.node[1];
                    if (n[0] === 'dot' && n[2] === 'add') {
                        // success! get meta data now
                        var requires = eval(node.source());
                        var name = _.flatten(parent.node[2])[1];

                        ret = {
                            name:name,
                            requires:requires,
                            type:'js'
                        };

                    }
                }
            }
        });
        return ret;
    },
    css: function(css, module, file, config){
        var name = path.basename(file, '.css') === module ?
            [config.namespace, module, 'css'].join('-') :
            [config.namespace, module, path.basename(file, '.css'), 'css'].join('-');

        var ret = {
            name: name,
            requires: [],
            type: 'css'
        };
        return ret;
    }
};

exports.instrument={
    js: function(script){
        // for now, return script
        return script;
    },
    css: function(css){
        return css;
    }
};

exports.dest = function(config){
    return path.join(config.dest, config.versionify? (config.version||'@VERSION@') : config.target);
};