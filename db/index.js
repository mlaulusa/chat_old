var fs = require('fs'),
    sqlite3 = require('sqlite3').verbose();

module.exports = {

    setup: function (){

        // Set some global database variables
        app.database = 'db/chat-' + app.get('env') + '.db';
        app.foreignKey = 'PRAGMA foreign_keys = true';

        try {

            fs.accessSync(process.cwd() + '/' + app.database, fs.F_OK);
            app.log.info('SQLite3 database already created');

        } catch (err){

            app.log.warn(err);
            app.log.info('Creating SQLite3 database file');

            fs.writeFileSync(app.database, '');

            var db = new sqlite3.Database(app.database);

            db.serialize(function (){

                app.log.info('Creating SQLite3 tables');

                db.run('CREATE TABLE users (id BLOB PRIMARY KEY UNIQUE, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL)');
                db.run('CREATE TABLE user_information (id BLOB UNIQUE, first_name TEXT, last_name TEXT, email TEXT NOT NULL, date_created TEXT NOT NULL, FOREIGN KEY (id) REFERENCES users (id))');
                db.run('CREATE TABLE user_login (id BLOB UNIQUE, login_date TEXT NOT NULL, FOREIGN KEY (id) REFERENCES users (id))');
            });

            db.close();
        }
    }

};
