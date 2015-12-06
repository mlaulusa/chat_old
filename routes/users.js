// this is where I want to configure the actual logic for the routes

module.exports = function (app){
    return {
        getAll: function (req, res){
            app.log.info('[%s] %s GET %s', req.ip, req.protocol, req.path);
            var db = new sqlite3.Database(app.db);

            // Query for all users
            db.all('SELECT * FROM users', function (err, data){
                    if(err){
                        app.log.error('Database error on statement "SELECT * FROM users"\n');
                        throw err;
                    }
                    else {
                        app.log.info('Data from statement "SELECT * FROM users"\n' + data);
                        res.json(data);
                    }
                })
                .close();

        },
        getOne: function (req, res){
            app.log.info('[%s] %s GET %s', req.ip, req.protocol, req.path);
            var db = new sqlite3.Database(app.db);

            // Query for a single user by id
            db.get('SELECT * FROM users where id = $id', {
                $id: req.body.id
            }, function(err, data){
                if(err){
                    app.log.error('Database error on statement "SELECT * FROM users where id = %s"\n', req.body.id);
                    throw err;
                }

                app.log.info('Data from statement "SELECT * FROM users where $id: %s"\n', req.body.id);
                res.status(200);
                res.json(data);
            })
            .close();
        }
    };
};
