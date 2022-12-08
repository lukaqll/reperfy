import SQLite from 'react-native-sqlite-storage';

SQLite.enablePromise(true)
const DB = SQLite.openDatabase({name:'app'});

class Database {

    db;

    constructor(db) {
        this.db = db;
    }

    executeSql = (sql, params=[]) => new Promise((resolve, reject) => {

        this.db.then( db => {
            db.transaction( trans => {
                trans.executeSql( sql, params, (db, results) => {
                    resolve( results );
                }),
                error => {
                    reject( error );
                }
            })
        })
    })

    async setUpDatabase(){
        let queries = [
            // `DROP TABLE songs`,
            // `DROP TABLE repertoires`,
            // `DROP TABLE repertory_songs`,

            `CREATE TABLE IF NOT EXISTS songs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(64),
                artist VARCHAR(64),
                cipher BLOB
            )`,
            `CREATE TABLE IF NOT EXISTS repertoires (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(64)
            )`,
            `CREATE TABLE IF NOT EXISTS repertory_songs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                song_id INTEGER NOT NULL,
                group_id INTEGER NULL,
                idx INTEGER NULL DEFAULT '0',
                played INTEGER NULL DEFAULT '0'
            )`,
            `CREATE TABLE IF NOT EXISTS repertory_groups (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name VARCHAR(64),
                repertory_id INTEGER NOT NULL,
                idx INTEGER NULL DEFAULT '0'
            )`,
        ];
        queries.forEach(async q => {
            await this.executeSql(q)
        });
    }
}

export default new Database(DB);