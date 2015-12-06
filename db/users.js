var bcrypt = require('bcrypt'),
    sqlite3 = require('sqlite3');

module.exports = {
    getOneByID: function (req, res){

        var db = new sqlite3.Database(app.database);

        db.run(app.foreignKey);

        db.run("SELECT * FROM users where id = $id", {
            $id: req.params.id
        }, function (err, data){
            if(err){
                app.log.warn('Database error at statement "SELECT * FROM users where id = %s"\n', req.params.id);

                app.log.error(err);

                res.status(400);
                res.json({
                    confirmation: false,
                    data: {
                        msg: "There was an error finding the user in the users table"
                    }
                });
            }

            app.log.info('Returning user %s', data.username);

            res.status(200);
            res.json({
                confirmation: true,
                data: data
            });

        }).close(function (err){
            if(err){
                app.log.warn('Error closing the database');
            } else {
                app.log.info('Database connection closed');
            }
        });

    },
    getOneByUsername: function (req, res){

        var db = new sqlite3.Database(app.database);

        db.run(app.foreignKey);

        db.run("SELECT * FROM users where username = $username", {
            $username: req.params.username
        }, function (err, data){
            if(err){
                app.log.warn('Database error at statement "SELECT * FROM users where username = %s"\n', req.params.username);

                app.log.error(err);

                res.status(400);
                res.json({
                    confirmation: false,
                    data: {
                        msg: "There was an error finding the user in the users table"
                    }
                });
            }

            app.log.info('Returning user %s', data.username);

            res.status(200);
            res.json({
                confirmation: true,
                data: data
            });

        }).close(function (err){
            if(err){
                app.log.warn('Error closing the database');
            } else {
                app.log.info('Database connection closed');
            }
        });

    },
    getAll: function (req, res){
        var db = new sqlite3.Database(app.database);

        db.run(app.foreignKey);

        db.run("SELECT * FROM users", function (err, data){
            if(err){
                app.log.warn('Database error at statement "SELECT * FROM users"\n');

                app.log.error(err);

                res.status(400);
                res.json({
                    confirmation: false,
                    data: {
                        msg: "There was an error finding users in the users table"
                    }
                });
            }

            app.log.info('Returning all users in users table');

            res.status(200);
            res.json({
                confirmation: true,
                data: data
            });

        }).close(function (err){
            if(err){
                app.log.warn('Error closing the database');
            } else {
                app.log.info('Database connection closed');
            }
        });
    },
    create: function (req, res){
        var db = new sqlite3.Database(app.database);

        db.run(app.foreignKey);

        bcrypt.genSalt(10, function (err, salt){
            bcrypt.hash(req.body.password, salt, function (err, hash){

                db.run("INSERT INTO users (id, username, password) VALUES ($id, $username, $password)", {
                    $id: req.body.id,
                    $username: req.body.username,
                    $password: hash
                }, function (err){

                    if(err.code == 'SQLITE_CONSTRAINT'){
                        app.log.warn('Database error at statement "INSERT INTO users (id, username, password) VALUES (%s, %s, %s)"', req.body.id, req.body.username, req.body.password);

                        app.log.error(err);

                        res.status(400);
                        res.json({
                            confirmation: false,
                            data: {
                                msg: "There is a foreign key constraint"
                            }
                        });
                    } else if(err){
                        app.log.warn('Database error at statement "INSERT INTO users (id, username, password) VALUES (%s, %s, %s)"', req.body.id, req.body.username, req.body.password);

                        app.log.error(err);

                        res.status(400);
                        res.json({
                            confirmation: false,
                            data: {
                                msg: "An error inserting into table users"
                            }
                        });
                    } else {
                        app.log.info('Inserting into users');

                        res.status(200);
                        res.json({
                            confirmation: true,
                            data: {
                                msg: req.body.username + " was inserted into users table"
                            }
                        });
                    }

                }).close(function (err){
                    if(err){
                        app.log.warn('Error closing the database');
                    } else {
                        app.log.info('Database connection closed');
                    }
                });

            });
        });


    },
    update: function (req, res){

    },
    delete: function (req, res){
        var db = new sqlite3.Database(app.database);

        db.run(app.foreignKey);

        db.run('DELETE FROM users where id = $id', {
            $id: req.params.id
        }, function (err, data){

            if(err){
                app.log.debug(err);

                res.status(400);
                res.json({
                    confirmation: false,
                    data: {
                        msg: err
                    }
                });
            } else {

                app.log.debug(data);

                res.status(200);
                res.json({
                    confirmation: true,
                    data: data
                });
            }

        }).close(function (err){
            if(err){
                app.log.warn('Error closing the database');
            } else {
                app.log.info('Database connection closed');
            }
        });
    }
};
