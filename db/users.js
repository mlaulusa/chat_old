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

        if(!req.body.username || !req.body.password){
            res.status(401);
            res.json({
                confirmation: false,
                data: {
                    msg: "No username or password provided"
                }
            });
        }

        var db = new sqlite3.Database(app.database);

        db.run(app.foreignKey);

        bcrypt.genSalt(10, function (err, salt){
            bcrypt.hash(req.body.password, salt, function (err, hash){

                db.run("INSERT INTO users (id, username, password) VALUES ($id, $username, $password)", {
                    $id: req.body.id,
                    $username: req.body.username,
                    $password: hash
                }, function (err){

                    if(err){
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
                        } else {
                            app.log.warn('Database error at statement "INSERT INTO users (id, username, password) VALUES (%s, %s, %s)"', req.body.id, req.body.username, req.body.password);

                            app.log.error(err);

                            res.status(400);
                            res.json({
                                confirmation: false,
                                data: {
                                    msg: "An error inserting into table users"
                                }
                            });

                        }
                    } else {
                        app.log.info('Inserting %s into users', req.body.username);

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
    },
    authenticate: function (username, password){

        return new Promise(function (resolve, reject){
            var db = new sqlite3.Database(app.database);

            db.run(app.foreignKey);

            db.serialize(function (){

                db.get('SELECT * FROM users WHERE username = $username', {
                    $username: username
                }, function (err, data){
                    if(err){

                        app.log.info('Error at statement "SELECT * FROM users WHERE username = %s"\n', username);
                        app.log.error(err);
                        reject(err);

                    } else if(data){

                        app.log.info('Found %s in users table', username);
                        app.log.info(data);

                        bcrypt.compare(password, data.password, function (err, match){
                            if(err){

                                app.log.info('Error comparing password and database hash for %s', username);
                                app.log.error(err);
                                reject(err);

                            } else if(match){

                                app.log.info('Password matched database for %s', username);
                                resolve(data);

                            } else {

                                app.log.info('Password rejected for %s', username);
                                reject('Password rejected');

                            }
                        });

                    } else {

                        app.log.info('%s was not found in users table', username);
                        reject('User was not found in table');

                    }
                }).close(function (err){
                    if(err){
                        app.log.info("Database didn't close correctly");
                        app.log.warn(err);
                    } else {
                        app.log.info("Database closed successfully");
                    }
                });
            });

        });
    }
};
