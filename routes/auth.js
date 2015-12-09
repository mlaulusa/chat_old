var jwt = require('jwt-simple'),
    users = require('../db/users'),
    config = require('../config');

var expiresIn = function (day){
    var date = new Date();
    return date.setDate(date.getDate() + day);
};

var genToken = function (User){

    var expires = expiresIn(3);
    var token = jwt.encode({
        exp: expires
    }, app.get('secret'));

    return {
        confirmation: true,
        data: {
            token: token,
            expires: expires,
            user: User
        }
    };

};

module.exports = {
    login: function (req, res){
        app.log.info('[%s] %s GET %s', req.ip, req.protocol, req.path);

        var username = req.body.username || '',
            password = req.body.password || '';

        if(username == '' || password == ''){
            res.status(401);
            res.json({
                status: 401,
                data: {
                    msg: "Invalid credentials"
                }
            });
            return;
        }

        users.authenticate(username, password).then(function(suc){

            res.status(200);
            res.json(genToken(suc));

        }, function(err){

            res.status(401);
            res.json({
                confirmation: false,
                data: {
                    msg: err
                }
            });

        });

    }
};
