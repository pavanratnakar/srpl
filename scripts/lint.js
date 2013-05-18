// TODO - BUILD LINT FUNCTIONALITY WHEN POSSIBLE. USER JSHINT
// var globsync  = require('glob-whatev'),
//     _ = require('underscore'),
//     path = require('path'),
//     jshint = require('jshint').JSHINT,
//     modules = [],
//     result,
//     errors,
//     cssfiles,
//     jsfiles,
//     files;

module.exports = function (config) {
    return(function(module,callback){
        // get all module family names
        // globsync.glob('./src/embed-app/*').forEach(function(dir){
        //     modules.push(path.basename(dir).replace(/\//g, ''));
        // });

        // _.each(modules, function(m){
        //     // get all files to be compiled
        //     cssfiles = globsync.glob(path.join(config.src, m, 'css/*.css')).sort();
        //     jsfiles = globsync.glob(path.join(config.src, m, 'js/*.js')).sort();
        //     files = jsfiles.concat(cssfiles);

        //     files.forEach(function(file){
        //         result = jshint(file, {});
        //         if (!result) {
        //             errors = jshint.errors;
        //         }
        //         var str = null;
        //         errors.forEach(function(result){
        //         str += file  + ': line ' + result.line + ', col ' +
        //             result.character + ', ' + result.reason + '\n';
        //         });
        //         console.log(str);
        //     });
        // });
        callback && callback();
    });
};