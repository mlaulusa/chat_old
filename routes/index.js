module.exports = function(app, sqlite3){

//==================================================================================
// Retrieves all users in the database and returns them
//==================================================================================
	app.get('/users', function(req, res){
		var db = new sqlite3.Database('db/chat.db');
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
		app.log.info('Creating new user with username: %s, password: %s', req.body.username, req.body.password);
		var db = new sqlite3.Database('db/chat.db');

		app.bcrypt.genSalt(10, function(err, salt) {
			if(err) throw err;
			app.bcrypt.hash(req.body.password, salt, function(err, hash){
				if(err) throw err;
				db.serialize(function(){
					app.log.debug(req.body);
					
					db.run(app.foreignKey);

					db.run('INSERT INTO users (username, password) VALUES ($username, $password)', {
						$username: req.body.username,
						$password: hash
					});
					
					var date = new Date(Date.now());
					var user = {};

					db.get('SELECT id FROM users WHERE username = $username', {
						$username: req.body.username
					}, function(err, data){
						app.log.debug(data);
						if(err) throw err;
						var db1 = new sqlite3.Database('db/chat.db');
						db1.run(app.foreignKey);
						db1.run('INSERT INTO user_information (id, first_name, last_name, email, date_created) VALUES ($id, $first, $last, $email, $created)', {
							$id: 2,
							$first: req.body.first_name,
							$last: req.body.last_name,
							$email: req.body.email,
							$created: date.toString()
						});
						db1.close();
						
					});

				});
				db.close();

				res.send('Successful');
			});
		});
	});


//==================================================================================
// Sign in, test inputted password with database password
//==================================================================================
	app.post('/signin', function(req, res){
		var db = new sqlite3.Database('db/chat.db');
		db.get('SELECT * FROM users WHERE username = $username', {
			$username: req.body.username
		}, function(err, data){
			app.log.debug(data);
			if(err) {
				app.log.warn('Returned error on database statement "SELECT * FROM users WHERE username = %s"', req.body.username);
				app.log.error(err);
				app.log.debug('Request body:\n' + req.body);
				throw err;
			} else {
				app.bcrypt.compare(req.body.password, data.password, function(err, match){
					if(err) {
						app.log.error(err);
						throw err;
					}
					if(match) {
						app.log.info('Password accepted for %s', req.body.username);
						res.json({
							match: match,
							id: data.id,
							username: data.username
						});
					} else {
						app.log.info('Password rejected');
						res.json({match: match});
					}
				});
			}
		});
	});

//==================================================================================
// Test API
//==================================================================================
	app.get('/test', function(req, res) {
		var db = new sqlite3.Database('db/chat.db');
		var data = {
				$id: 13,
				$first: "Matthew",
				$email: "something@something.com",
				$date: "now"
			};
		db.serialize(function(){

			db.run(app.foreignKey);
			db.run('INSERT INTO user_information (id, first_name, email, date_created) VALUES ($id, $first, $email, $date)', data, function(err) {
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
