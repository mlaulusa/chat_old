module.exports = function(app, sqlite3){

//==================================================================================
// Retrieves all users in the database and returns them
//==================================================================================
	app.get('/users', function(req, res){
		app.log.info('[%s] %s GET %s', req.ip, req.protocol, req.path);
		var db = new sqlite3.Database('db/' + app.db);

		// Query for all users
		db.all('SELECT * FROM users', function(err, data){
			if(err) {
				app.log.error('Database error on statement "SELECT * FROM users"\n');
				throw err;
			} else {
				res.json(data);
				app.log.info('Data from statement "SELECT * FROM users"\n' + data);
			}
		}).close();
	});

//==================================================================================
// Retrieves a specific user by the id and returns it
//==================================================================================
	app.get('/users/:id', function(req, res){
		app.log.info('[%s] %s GET %s', req.ip, req.protocol, req.path);
		var db = new sqlite3.Database('db/chat.db');
		db.get('SELECT * FROM users WHERE id = $id', {
			$id: req.params.id
		}, function(err, data){
			if(err) {
				app.log.error('Database error on statement "SELECT * FROM users WHERE id = %s"\n', req.params.id);
			} else {
				res.json(data);
				app.log.info('Data from statement "SELECT * FROM users WHERE id = %s"\n%s', req.params.id, data);
			}
		}).close();
	});

//==================================================================================
// Creates a new user
//==================================================================================
	app.post('/users', function(req, res){
		app.log.info('[%s] %s POST %s', req.ip, req.protocol, req.path);
		app.log.info('Creating new user with username: %s, password: %s', req.body.username, req.body.password);
		var db = new sqlite3.Database('db/chat.db');

		// generate bcrypt salt for hash
		app.bcrypt.genSalt(10, function(err, salt) {
			if(err) throw err;

			// take salt and hash the password
			app.bcrypt.hash(req.body.password, salt, function(err, hash){
				if(err) throw err;

				// open database and run commands synchronously
				db.serialize(function(){
					app.log.debug(req.body);
					db.run(app.foreignKey);

					// insert username and hash into users table
					db.run('INSERT INTO users (username, password) VALUES ($username, $password)', {
						$username: req.body.username,
						$password: hash
					}, function(err) {
						if(err) {
							app.log.error('Database error on statement "INSERT INTO users (username, password) VALUES (%s, %s)"', req.body.username, hash);
							app.log.debug(err);
							app.log.info({
								LastID: this.lastID,
								changes: this.changes
							});
							throw err;
						}
					});

					// figure out date for created_on variable
					var date = new Date(Date.now());
					var user = {};

					// find ID that was created for the username to keep foreign key constraint
					db.get('SELECT id FROM users WHERE username = $username', {
						$username: req.body.username
					}, function(err, data){
						if(err) {
							app.log.error('Database error on statement "SELECT id FROM users WHERE username = %s"\n', req.body.username);
							res.json({added: "Failed"});
							throw err;
						}

						// need another database connection as the other one is already in use
						var db1 = new sqlite3.Database('db/chat.db');
						db1.run(app.foreignKey);

						// insert all new data into user_information
						db1.run('INSERT INTO user_information (id, first_name, last_name, email, date_created) VALUES ($id, $first, $last, $email, $created)', {
							$id: data.id,
							$first: req.body.first_name,
							$last: req.body.last_name,
							$email: req.body.email,
							$created: date.toString()
						}, function(err) {
							app.log.error('Database error on statement "INSERT INTO user_information (id, first_name, last_name, email, date_created) VALUES (%s, %s, %s, %s, %s)"', data.id, req.body.first_name, req.body.last_name, req.body.email, date.toString());
							app.log.debug(err);
							app.log.info({
								lastID: this.lastID,
								changes: this.changes
							});
						});
						db1.close(function(err) {
							if(err) {
								app.log.error('Database didn\'t close correctly');
							} else {

							}
						});
						res.json({added: "Successful"});

					});

				});
				db.close();
			});
		});
	});

//==================================================================================
// Sign in, test inputted password with database password
//==================================================================================
	app.post('/signin', function(req, res){
		app.log.info('[%s] %s POST %s', req.ip, req.protocol, req.path);
		var db = new sqlite3.Database('db/chat.db');
		db.run(app.foreignKey);

		// Match a database username from the user inputted username
		db.get('SELECT * FROM users WHERE username = $username', {
			$username: req.body.username
		}, function(err, data){
			app.log.debug(data);

			// throw an error if the database connection errors out
			if(err) {
				app.log.warn('Returned error on database statement "SELECT * FROM users WHERE username = %s"', req.body.username);
				app.log.debug('Request body:\n' + req.body);
				app.log.error(err);
				throw err;

			// If a username is found that matches
			} else if(data) {
				app.log.debug('Found user, testing password against database password');

				// use bcrpyt to hash user inputted password and compare it to database hash
				app.bcrypt.compare(req.body.password, data.password, function(err, match){

					// Throw an error if bcrypt runs into an error
					if(err) {
						app.log.error(err);
						throw err;
					}

					// if the hashes match send a response back noting the match and also send user data to store in angular
					if(match) {
						app.log.info('%s signed in', req.body.username);
						res.json({
							type: "success",
							message: "Welcome",
							id: data.id,
							username: data.username
						});

					// If the hashes don't match send response back noting the match
					} else {
						app.log.info('Password rejected');
						res.json({
							type: "error",
							message: "Username/Password combination wrong"
						});
					}
				});

			// If no username is found
			} else {
				app.log.info('No match found for %s', req.body.username);
				res.json({
					type: "error",
					message: "Username not found"
				});
			}
		});
	});

//==================================================================================
// Test API
//==================================================================================
	app.get('/test', function(req, res) {
		app.log.info('[%s] %s GET %s', req.ip, req.protocol, req.path);
		var db = new sqlite3.Database(app.db);
		var data = {
				$username: 'mlaulusa',
				$password: 'test',
				$first: "Matthew",
				$last: "Laulusa",
				$email: "something@something.com",
				$date: "now"
			};

		app.bcrypt.genSalt(10, function(err, salt) {
			if(err) throw err;
			app.bcrypt.hash(data.$password, salt, function(err, hash) {
				if(err) throw err;
				data['$hash'] = hash;
			});
		});

		db.serialize(function(){

			db.run(app.foreignKey);
			db.run('INSERT INTO users (username, password) VALUES ($username, $password)', data, function(err) {
				if(err) {
					app.log.error(err);
					throw err;
				}
			});
			db.run('INSERT INTO user_information (first_name, last_name, email, date_created) VALUES ($first, $last, $email, $date)', data, function(err) {
				if(err) {
					app.log.warn(err);
					res.writeHead(409);
					res.end('fail');
				} else {
					res.send('pass');
				}
			});

		});
		db.close();
	});

};
