// dependencies, node modules
var path      = require('path'),
    _        = require('underscore'),
    async    = require('async'),
    globsync  = require('glob-whatev'),
    program   = require('commander'),

    configs = {}, defaults  = require('../config/defaults.js').config,

    // available commands
    commands  = require('./commands.js'),

    environment = 'development', // default target

    modules = [];
    
// get all module family names
globsync.glob('./src/*').forEach(function(dir){
    if (dir !=='src/embed-app/') {
        modules.push(path.basename(dir).replace(/\//g, '')); // remove slashes
    }
});

globsync.glob('./config/*.js').forEach(function(file){

    if(file.indexOf('defaults.js')>=0){
        return;
    }
    var target = path.basename(file, '.js');
    configs[target] = _.defaults(require(path.join('../' + file)).config, defaults);
    // attach module family names for convenience
    configs[target].modules = modules;
});

// present cli options
program
    .version('0.0.1')                   // version of this script, not of src
    .option('-t, --templates [module]', 'Compile templates for [module]. Default "all"')
    .option('-s, --server [port]',      'Start a dev server on [port]. Default 8000')
    .option('-b, --build [environment]','Do an [environment] build. Default "development"')
    .option('-e, --env [environment]',  'Set [environment]. Default "development"')
    .option('-c, --create [module]',    'Create stubs for [module]')
    .option('-l, --lint [module]',      'Lint js/css for [module]. Default "all"')
    .option('-w, --watch',              'Do a fresh build every time a src file changes.')
    .option('-p, --package',            'NOT USABLE YET - Compile a module including dependencies')
    .option('--clean',                  'Clean build dir')
    .option('--tests [module]',         'Run tests for [module]. Default "all"')
    .parse(process.argv);
    
// set environment if sent in
if(program.env && program.env!==true){
    environment = program.env;
}

async.series(_.filter(_([
    // check which commands have been asked for, and execute in series
    'templates',
    'server',
    'build',
    'create',
    'tests',
    'lint',
    'watch',
    'clean',
    'package'
    ]).map(function(command){
    var option = program[command] === true ? null : program[command];
    if(program[command]){
        return (function(callback){
            commands[command](configs[environment])(option, callback);
        });
    }
    return false;
}),function(x){return !!x;}), function(err, data){
    if(err){
        console.error('error:', err);
        new Error(err);
      //  process.exit(1);
    }
    //process.exit(0);
});