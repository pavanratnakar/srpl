var fs = require('fs'),
    _ = require('underscore'),
    globsync = require('glob-whatev'),
    wrench = require('wrench'),
    $ = require('./helpers.js'),
    path = require('path');

module.exports = function(config){
    return (function(name, callback){
        console.log('create: start');
        // first make base dir
        fs.mkdirSync(path.join(config.src, name));
        // then make supporting folders
        _.each(['css', 'img', 'js', 'samples', 'templates', 'tests'], function(f) {
            fs.mkdirSync(path.join(config.src, name, f));
        });

        globsync.glob(path.join(config.templates, 'module-template', '**/*.*')).forEach(function(f){
            var code = fs.readFileSync(f, 'utf8'),
                _p = path.dirname(f),
                _f = path.basename(f),
                // todo - this will be buggy
                _target = path.join(_p.replace(path.join(config.templates, 'module-template'), path.join(config.src, name)), _f);

            console.log('create:', _target);

            if(!(f.indexOf('.ejs.html')>=0)){
                code = _.template(code)({
                    namespace: config.namespace,
                    module: name,
                    MODULE: $.capitalize($.camel(name))
                });
            }
            fs.writeFileSync(_target, code, 'utf8');
            
        });
        console.log('create: done!');
        callback && callback();
    });
};