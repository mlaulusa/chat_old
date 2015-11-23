module.exports = function(app, sqlite3){

//==================================================================================
// Retrieves all users in the database and returns them
//==================================================================================
	app.get('/users', function(req, res){
		var db = new sqlite3.Database('db/chat.db');
		db.all('SELECT * FROM users', function(err, data){
			if(err) throw err;
			res.json(data);
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
			if(err) throw err;
			res.json(data);
		}).close();
	});

//==================================================================================
// Creates a new user
//==================================================================================
	app.post('/users', function(req, res){
		var db = new sqlite3.Database('db/chat.db');

		app.bcrypt.genSalt(10, function(err, salt){
			if(err) throw err;
			app.bcrypt.hash(req.body.password, salt, function(err, hash){
				if(err) throw err;
				db.serialize(function(){
					
					db.run('INSERT INTO users (username, password) VALUES ($username, $password)', {
						$username: req.body.username,
						$password: hash
					});
					
					var date = new Date(Date.now());

					db.run('INSERT INTO user_information (first_name, last_name, age, created_on) VALUES ($first, $last, $age, #created)', {
						$first: req.body.first_name,
						$last: req.body.last_name,
						$age: req.body.age,
						$created: date.toString()
					});
				});
				db.close();

				res.send('Successful');
			});
		});
	});

};
