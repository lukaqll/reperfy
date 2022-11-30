import Database from './Database';
import RepertorySongsStore from './RepertorySongsStore';

class RepertoryStore{

    async getAll() {
        const result = await Database.executeSql(`
            SELECT * FROM repertoires ORDER BY name;
        `);

        let out = []
        for( let i = 0; i < result.rows.length; i++ ){
            out.push(result.rows.item(i))
        }
        return out
    }

    async insert(params = {}) {
        return await Database.executeSql(`
            INSERT INTO repertoires
                (name) 
            VALUES (?);
        `, [params.name]);
    }

    async update(params = {}) {
        return await Database.executeSql(`
            UPDATE repertoires
                SET name = ?
            WHERE id = ?;
        `, [params.name, params.id]);
    }

    async delete(id) {
        await RepertorySongsStore.detachAllSongs(id)
        return await Database.executeSql(`
            DELETE FROM repertoires WHERE id = ?;
        `, [id]);
    }

    async find(id) {
        const result = await Database.executeSql(`
            SELECT * FROM repertoires WHERE id = ? LIMIT 1;
        `, [id]);

        return result.rows.item(0)
    }
}

export default new RepertoryStore;