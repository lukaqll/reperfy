import Database from './Database';
import RepertorySongsStore from './RepertorySongsStore';

class SongStore{

    async getAll() {
        const result = await Database.executeSql(`
            SELECT * FROM songs ORDER BY name;
        `);

        let out = []
        for( let i = 0; i < result.rows.length; i++ ){
            out.push(result.rows.item(i))
        }
        return out
    }

    async insert(params = {}) {
        return await Database.executeSql(`
            INSERT INTO songs
                (name, artist, cipher) 
            VALUES (?, ?, ?);
        `, [params.name, params.artist, params.cipher]);
    }

    async update(params = {}) {
        return await Database.executeSql(`
            UPDATE songs
                SET name = ?, artist = ?, cipher = ?
            WHERE id = ?;
        `, [params.name, params.artist, params.cipher, params.id]);
    }

    async delete(id) {
        RepertorySongsStore.deleteBySong(id)
        return await Database.executeSql(`
            DELETE FROM songs WHERE id = ?;
        `, [id]);
    }

    async find(id) {
        const result = await Database.executeSql(`
            SELECT * FROM songs WHERE id = ? LIMIT 1;
        `, [id]);

        return result.rows.item(0)
    }
}

export default new SongStore;