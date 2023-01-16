import Database from './Database';
import RepertoryGroupsStore from './RepertoryGroupsStore';

class RepertoryStore{

    async getAll() {
        const result = await Database.executeSql(`
            SELECT 
                rep.*,
                count(rs.id) as songs_len
            FROM 
                repertoires rep
            LEFT JOIN repertory_groups rg
                ON rg.repertory_id = rep.id
            LEFT JOIN repertory_songs rs 
                ON rs.group_id = rg.id
            GROUP BY rep.id
            ORDER BY rep.name;
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

        await RepertoryGroupsStore.deleteByRepertory(id)

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

    async getByName(name) {
        const result = await Database.executeSql(`
            SELECT * FROM repertoires WHERE name = ? LIMIT 1;
        `, [name]);

        return result.rows.item(0)
    }

    async getSongs(id) {
        const result = await Database.executeSql(`
            SELECT s.*, rs.played FROM repertoires r
                join repertory_songs rs 
                    ON rs.repertory_id = r.id
                    AND r.id = ?
                JOIN songs s
                    ON s.id = rs.song_id
            GROUP BY s.id
            ORDER BY rs.idx
        `, [id])

        let out = []
        for( let i = 0; i < result.rows.length; i++ ){
            out.push(result.rows.item(i))
        }
        return out
    }
}

export default new RepertoryStore;