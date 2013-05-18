var globsync = require('glob-whatev'),
    path = require('path'),
    fs = require('fs'),
    _ = require('underscore'),
    $ = require('./helpers.js'),
    wrench = require('wrench');

module.exports = function(config){

    function _tpls(module){
        var ret = {};
        globsync.glob(path.join(config.src, module, 'templates/*.*.html')).sort().forEach(function(file){
            var name = path.basename(file).split('.')[0];
            var template = fs.readFileSync(file, 'utf8');
            ret[name] = template;
        });
        return ret;
    }

    return(function(module, callback){

        console.log('templates: start', module||'*');

        _.each(module ? [module] : config.modules, function(m){
            var tpls = _tpls(m);
            if (!_.isEmpty(tpls)) {
                var script = _.template(fs.readFileSync(path.join(config.templates, 'mvc-templates.js'), 'utf8'))({
                    scripts: tpls,
                    namespace: config.namespace,
                    module: m,
                    MODULE: $.capitalize($.camel(m))
                });
                var dest = path.join(config.src, m, 'js/templates.js' );

                wrench.mkdirSyncRecursive(path.dirname(dest));
                fs.writeFileSync(dest, script, 'utf8');
                console.log('templates:', dest);
            }
        });

        (callback||function(){})();
    });
};