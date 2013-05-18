// use this target for versioned release

var VERSION = '0.0.1';

exports.config = {
    comboBase:'http://l.yimg.com/zz/combo?',
    root:'na/srpl/' + VERSION + '/',
    combine:true,

    // version stuff
    versionify: true,
    version:VERSION,
    target:'versioned',

    // build stuff
    minify: true,    // generate manifest-min.js
    debug: true  // generate manifest-debug.js
};