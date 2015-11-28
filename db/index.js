var fs = require('fs');

module.exports = function(app, sqlite3) {

app.foreignKey = "PRAGMA foreign_keys = true";
app.db = "db/chat-" + app.get('env') + ".db";

  try {

  	fs.accessSync(process.cwd() + '/' + app.db, fs.F_OK);
  	app.log.info('SQLite3 database already created');

  } catch(err) {

  	app.log.warn(err);
  	app.log.info('Creating SQLite3 database file');

  	fs.writeFileSync(app.db, '');

  	var db = new sqlite3.Database(app.db);
  	db.serialize(function(){

  		app.log.info('Creating SQLite3 tables');

  		db.run('CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL)');
  		db.run('CREATE TABLE user_information (id INTEGER, first_name TEXT, last_name TEXT, email TEXT NOT NULL, date_created TEXT NOT NULL, FOREIGN KEY (id) REFERENCES users (id))');
  		db.run('CREATE TABLE user_login (id INTEGER, login_date TEXT NOT NULL, FOREIGN KEY (id) REFERENCES users (id))');
  	});
  	db.close();
  }
}
