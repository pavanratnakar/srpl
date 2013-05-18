var _ = require('underscore'),
    fs = require('fs'),
    path = require('path'),
    compress = require('./helpers.js').compress,
    wrench = require('wrench');

module.exports = function(config) {
    var manifest = JSON.parse(fs.readFileSync(path.join(config.dest, 'development', 'manifest.json'), 'utf8')),
        deps = [],
        analyze = function(name) {
            var children = _(manifest.modules[name].requires || []).filter(function(m) {
                return _(deps).indexOf(m) === -1 && !! manifest.modules[m];
            });
            _.each(children, function(c) {
                analyze(c);
            });
            console.log(children);
            deps = _.uniq(deps.concat(children).concat(name));
        };
    return function(module, callback) {
        var jsbuffer = '', // put concatenated stuff here
            cssbuffer = '',
            deps = [],
            cssMods = [],
            content;
        analyze('myc-app-view');
        console.log(deps);
        _.each(deps, function(d) {
            if (manifest.modules[d].type === 'js') {
                // shove into jsbuffer
                content = fs.readFileSync(path.join(config.dest, 'development', manifest.modules[d].path), 'utf8');
                jsbuffer += (content + '\n');
            } else {
                // shove into cssbuffer
                content = fs.readFileSync(path.join(config.dest, 'development', manifest.modules[d].path), 'utf8');
                cssbuffer += (content + '\n');
            }
        });
        var dest = path.join(config.dest, 'development', 'packages', 'myc-app-view');
        wrench.mkdirSyncRecursive(dest);
        fs.writeFileSync(path.join(dest, 'script.js'), compress.js(jsbuffer), 'utf8');
        fs.writeFileSync(path.join(dest, 'style.css'), compress.css(cssbuffer), 'utf8');
    };
};