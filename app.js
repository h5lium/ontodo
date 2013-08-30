var http = require('http'),
    fs = require('fs');

var express = require('express');
var app = express();

var is_bae_dev = fs.existsSync('./app/');
app.configure(function(){
    app.set('port', process.APP_PORT || process.env.PORT || 80);
    //app.use(express.favicon());
    app.use(express.logger('dev'));

    app.use(express.bodyParser());
    //app.use(express.cookieParser());
});

app.get('/login', function(req, res){
    res.send('haha');
});

app.use(express.static((is_bae_dev? './app': '.') + '/static'));
var server = http.createServer(app);
server.listen(app.get('port'), function(){
    console.log('server listening on port ' + app.get('port'));
});
