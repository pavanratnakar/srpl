YUI_config.groups.gallery.root= 'gallery-2012.04.26-15-49/build/';
YUI_config.groups.gallery.base= 'http://yui.yahooapis.com/combo?gallery-2012.04.26-15-49/build/';

window.YUI_config = window.YUI_config || {groups:{}};
YUI_config.groups.<%= config.namespace %> = <%= JSON.stringify({
    lang: config.lang,
    comboBase : config.comboBase,
    root: config.root || ((config.versionify? config.version : config.target) + '/' ),
    combine: config.combine,
    base: path.join(config.base, config.versionify? config.version : config.target) + '/',    // add a trailing slash
    modules:manifest
}, null, '    ') %>;