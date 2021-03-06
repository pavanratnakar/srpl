// todo - -debug.js files
var burrito = require('burrito'),
    fs = require('fs'),
    path = require('path'),
    _ = require('underscore'),
    globsync = require('glob-whatev'),
    $ = require('./helpers.js'),
    wrench = require('wrench'),
    copy = require('./copy.js').copyFileSync;

module.exports = function(config){

    var assets = {}; // maintain a map of assets and their hashified targets

    var _assets = {};

    function cdnify (file, css){
        var url_regex = /url\(\'*\"*([\-\_:a-zA-Z0-9\/.]+)\'*\"*\)/ig,
            _css = css + '',
            match,
            _url,
            basepath;

        while (match = url_regex.exec(css)) {
            _url = match[1];
            
            if (match[1].indexOf('http') === 0) {
                // absolute url
                console.log('-------\nWARNING:', file, 'references an absolute url:', match[1], '\n-------');
            } else if (match[1].charAt(0) === '/') {
                // points to base of server. simply concatenate and send back
                _url = path.join(config.cdnBase, match[1]);
            } else {
                // relative url.
                basepath = path.relative(config.src, path.join(path.dirname(file), match[1]));
                if (!assets[basepath]) {
                    console.log('-------\nWARNING:', file, 'references an image that doesn\'t exist:', match[1], '\n-------');
                }
                _url = path.join(config.cdnBase, config.versionify? config.version : config.target, basepath);
            }
            // stupid bugfix because of path join
            if (_url.indexOf('http:/')===0 && _url.indexOf('http://') !== 0) {
                _url = _url.replace('http:/', 'http://');
            }
            _css = _css.replace(match[1], _url);
        }
        return _css;
    }

    // compiles/analyzes a given file
    function compile(file, module){
        // store generated versions of the file
        var targets = {
            raw:fs.readFileSync(file, 'utf8')||''
        };
        // get the type of the file (js, css)
        var type = path.extname(file).split('.')[1];

        // versionify the output
        if (config.versionify) {
            targets.raw = targets.raw.replace(/@VERSION@/g, config.version);
        }
        // rewrite paths to point to assets
        if (config.combine && type === 'css') {
            // this is mainly for css, but we're not going to check type here.
            targets.raw = cdnify(file, targets.raw);
        }
        // compress
        if (config.minify) {
            targets.minified = $.compress[type](targets.raw);
        }
        // analyze the source
        // will generate a spec for the file
        var analyzed = $.analyze[type](targets.raw, module, file, config);

        if (type === 'css' && targets.raw.indexOf('yui3-css-stamp')===-1) {
            var cssStamping = '\n\n/* YUI CSS Detection Stamp */\n#yui3-css-stamp.'+ analyzed.name +' { display: none; }';
            if (config.minify) {
                cssStamping = $.compress.css(cssStamping);
            }
            fs.appendFile(file,cssStamping, function (err) {
            if (err) throw err;
                console.log('CSS Stamping was appended to '+file);
            });
        }
        // return results in this object
        var ret = {};

        _.each(targets, function(val, key){
            ret[key] = {
                name: analyzed.name,
                code: val,
                type: type,
                requires: analyzed.requires ||[]
            };
        });
        return ret;
    }

    return(function(environment, callback){ //todo - environment?
        var startTime = new Date().getTime();
        // store generated manifests
        var manifests = {};

        // first do a clean
        require('./clean.js')(config)();

        // then compile all templates
        require('./templates.js')(config)();

        // /img/**/*.*
        _.each(config.modules, function(m){
            globsync.glob(path.join(config.src, m,'img/**/*.*')).sort().forEach(function(file){
                var extname = path.extname(file),
                    basepath = path.relative(config.src, file),
                    dest = path.join($.dest(config), basepath);

                // update assets hash to hold this for future reference
                assets[basepath] = basepath;

                _assets[m] = _assets[m] || {};
                _assets[m][path.relative(path.join(config.src, m), file)] = path.relative(path.join($.dest(config), m));

                // write both versions to destination
                wrench.mkdirSyncRecursive(path.dirname(dest));

                copy(file, dest);
                console.log('asset:', file);
            });
            // write assets descriptor file
            var sx = fs.readFileSync(path.join(config.templates, 'assets.js'), 'utf8');
            sx = _.template(sx)({
                namespace: config.namespace,
                module: m,
                MODULE: $.capitalize($.camel(m)),
                assets: _assets[m]
            });

            var assets_desc_path = path.join(config.src, m, 'js', 'assets.js');
            // [bug 5892107] commenting out the assets file writing so that no files are created
            // fs.writeFileSync(assets_desc_path, sx, 'utf8');
            console.log('build: assets:', assets_desc_path);
        });

        // now the meat and potatoes
        _.each(config.modules, function(m){

            // get all files to be compiled
            var cssfiles = globsync.glob(path.join(config.src, m, 'css/*.css')).sort(),
                jsfiles = globsync.glob(path.join(config.src, m, 'js/*.js')).sort(),
                files = jsfiles.concat(cssfiles);

            files.forEach(function(file){
                console.log('starting', file);
                var extname = path.extname(file);
                var type = extname.split('.')[1];
                // hardcode skipping of our generated yui file
                if (file.indexOf('simpleyui.js') >= 0) {
                    var dest = path.join($.dest(config), m, 'js', 'simpleyui.js');
                    fs.writeFileSync(dest, fs.readFileSync(file), 'utf8');
                    return;
                }

                // compile all files, and store results for now
                var specs = compile(file, m);
                // target destinations for compiled versions
                var dests = {
                    raw : path.join(m, type, path.basename(file)),
                    minified : path.join(m, type, path.basename(file, extname) + '.min' + extname),
                    instrumented : path.join(m, type, path.basename(file, extname) + '.instrumented' + extname)
                };
                // write all target files, and update manifests
                _.each(specs, function(s, target){
                    // write each file
                    var dest = path.join($.dest(config), dests[target]);
                    wrench.mkdirSyncRecursive(path.dirname(dest));

                    fs.writeFileSync(dest, '/* ' + m + ': ' + path.basename(file) + ' */\n' + s.code + '\n', 'utf8');

                    // if YUI module was found, update manifests
                    if (s.name) {
                        manifests[target] = manifests[target] || {};
                        manifests[target][s.name] = {
                            requires: s.requires,
                            path: dests[target],
                            type: type
                        };
                    }
                });
                console.log('build:', type +':', file);
            });
        });

        // write all manifests
        var manifest_dests = {
            raw:            'manifest.js',
            minified:       'manifest.min.js',
            json:           'manifest.json'
        };

        _.each(manifests, function(manifest, target){
            var str;
            // generate manifest script
            if (config.src === './src/embed-app')
                str = _.template(fs.readFileSync(path.join(config.templates,'embed-manifest.js'), 'utf8'))({
                    config:config,
                    manifest:manifest,
                    path: path
                });
            else {
                str = _.template(fs.readFileSync(path.join(config.templates,'manifest.js'), 'utf8'))({
                    config:config,
                    manifest:manifest,
                    path: path
                });
            }
            // if target isn't raw, and minify is on, then compress the manifest
            if (target!=='raw') {
                if (config.minify) {
                    str = $.compress.js(str);
                }
            } else {
                // write off latest plain manifest.js to base build dir. useful for development
                fs.writeFileSync(path.join(config.dest, 'manifest.js'), str, 'utf8');
                console.log('build: manifest: base:', path.join(config.dest, 'manifest.js'));
                
                // write off a json version of the raw version
                var json = _.template(fs.readFileSync(path.join(config.templates, 'manifest.json'), 'utf8'))({
                    config:config,
                    manifest:manifest,
                    path: path
                });

                var json_dest = path.join($.dest(config), manifest_dests.json);
                fs.writeFileSync(json_dest, json, 'utf8');
                console.log('build: manifest: json:', json_dest);
            }
            // write the manifest
            var dest = path.join($.dest(config), manifest_dests[target]);
            fs.writeFileSync(dest, str, 'utf8');
            console.log('build: manifest:', target+ ':', dest);
        });

        // write off assets for further use by anyone
        fs.writeFileSync(path.join($.dest(config), 'assets.json'),JSON.stringify(assets,null, '  '));

        console.log('build: done', ((new Date().getTime()) - startTime)/1000, 'seconds');
        callback && callback();
    });
};