var jwt = require('jwt-simple'),
    validate = require('../routes/auth');

module.exports = function(req, res, next){

    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    var key = (req.body && req.body.x_key) || (req.query && req.query.x_key) || req.headers['x-key'];
    console.log('Token: %s', token);
    console.log('Key: %s', key);

    try {

        if(token){
            var decoded = jwt.decode(token, app.get('secret'));

            if(decoded <= Date.now()){
                res.status(400);
                res.json({
                    data: {
                        msg: "Token is expired"
                    }
                });
            }

            console.log('decoded: ');
            console.log(decoded);
        }

    } catch(err){

        app.log.error(err);
        return next();

    }

    next();
};
