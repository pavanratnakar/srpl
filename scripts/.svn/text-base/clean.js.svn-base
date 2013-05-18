var wrench = require('wrench'),
    globsync = require('glob-whatev'),
    path = require('path'),
    fs = require('fs'),
    $ = require('./helpers.js');

module.exports = function(config){
    return (function(nuke, callback){
        // delete dest dir
        // and any other artifacts generated
        // docs, jsons if any, etc.
        var dest = $.dest(config);
        console.log('clean:start', dest);
        
        // first delete all files
        globsync.glob(path.join(dest, '**/*.*')).forEach(function(file){
            fs.unlinkSync(file);
        });

        if (nuke) {
            try{
                wrench.rmdirSyncRecursive(dest);
            }
            catch(e){
                console.log('clean:', dest, 'does not exist');
            }
        }
 
        console.log('clean:end');
        (callback||function(){})();
    });
};