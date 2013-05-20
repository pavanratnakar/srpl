var tako = require('tako'),
    combohandler = require('combohandler'),
    path = require('path'),
    express = require('express'),
    request = require('request'),
    _ = require('underscore'),
    fs = require('fs');

module.exports = function(config){
    return(function(port, callback){

        // run a local dev server
        port = port || 8000;
        var app = tako();

        app.route('/build/*').files('./build');
        app.route('/src/*').files('./src');
        app.route('/test/*').files('./test');

        app.route('/samples/*').files('./samples');

        app.route('/api/ysm', function(req, res){
            var affilData = 'ua='+(req.headers['user-agent']);
            var xfip = req.headers['x-forwarded-for'];
            if(xfip){
                affilData+='&xfip='+xfip;
            } else {
                affilData+='&ip='+req.connection.remoteAddress;
            }

            var serveUrl = 'http://'+req.headers.host;
            var qs = req.qs;
            var cb = qs.callback;
            var qo = {};
            // filtering out the params we want
            _(['Partner', 'maxCount', 'enableFavicon', 'serveUrl', 'Keywords', 'mkt', 'affilData']).each(function(p, i){
                if(qs[p]){
                    qo[p] = qs[p];
                }
            });

            var url = 'http://dateexpect-dr.bagmane.corp.yahoo.com/sponsored-listings?'+_.map(qo, function(v,k){ return encodeURIComponent(k) + '=' + encodeURIComponent(v)}).join('&');

            request(url, {}, function(e,r){
                // todo - error handling
                if(e){
                    console.log('error', e);
                    res.end();
                }
                else{
                    var responseStr = '';
                    if(cb){
                        responseStr = cb + '(' + r,body + ');';
                    }
                    res.end(responseStr);
                }
            });
        });
        
        // var landingPage = fs.readFileSync('samples/app/index.html');
        var landingP = 'samples/app/index.html';

        app.route('/srpl/*', function(req, res){
            res.end(fs.readFileSync(landingP));
        });

        app.route('/srpl', function(req, res){
            res.end(fs.readFileSync(landingP));
        });

        app.httpServer.listen(port);
        console.log('server:', port);

        // run a local combo server
        var comboapp = express.createServer();

        comboapp.configure(function () {
          comboapp.use(express.errorHandler());
        });

        // Return a 400 response if the combo handler generates a BadRequest error.
        comboapp.error(function (err, req, res, next) {
            if (err instanceof combohandler.BadRequest) {
                res.send('Bad request.', {'Content-Type': 'text/plain'}, 400);
            } else {
                next();
            }
        });

        comboapp.get('/combo', combohandler.combine({rootPath: config.dest}), function (req, res) {
            res.send(res.body, 200);
        });
        comboapp.listen(3000);
        console.log('server: combo:', 3000);
    });
};