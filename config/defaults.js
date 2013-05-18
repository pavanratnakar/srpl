exports.config = {
    // paths
    src:        './src',
    dest:       './build',
    docs:       './docs',
    templates:  './templates',
    cdnBase:    'http://l.yimg.com/na/srpl/',
    // manifest stuff
    lang:       'en-US',
    base:       '/build/',  // this will get attached with version/target
    comboBase:  'http://localhost:3000/combo?',
    root:       '',
    combine:    false,
    // more generic stuff
    version:    '',
    namespace:  'srpl',
    target:     'defaults',
    // build stuff
    minify:     false,      // generate manifest-min.js
    debug:      true,       // generate manifest-debug.js
    packages: ['srpl-app-view']
};