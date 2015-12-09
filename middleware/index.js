var jwt = require('jwt-simple'),
    validate = require('../routes/auth');

module.exports = function(req, res, next){

    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
    console.log('Token: %s', token);

    try {

        if(token){
            var decoded = jwt.decode(token, app.get('secret'));

            console.log('decoded: ');
            console.log(decoded);
        }

    } catch(err){

        app.log.error(err);
        return next();

    }

    next();
};
