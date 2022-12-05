import Database from './Database';

class RepertoryStore{

    async getAll() {
        const result = await Database.executeSql(`
            SELECT * FROM repertoiry_songs ORDER BY idx;
        `);

        let out = []
        for( let i = 0; i < result.rows.length; i++ ){
            out.push(result.rows.item(i))
        }
        return out
    }

    async attachSongs(idRep, songsId = []) {
        if (!songsId)
            return 

        let sqlInsert = []
        let arrayInsert = []
        songsId.forEach((item, idx) => {
            sqlInsert.push('(?, ?, ?)')
            arrayInsert.push(idRep, item, idx)
        })

        await Database.executeSql(`
            INSERT INTO repertory_songs
                (repertory_id, song_id, idx)
            VALUES
                ${sqlInsert.join(',')}
        `, arrayInsert)
    }

    async getByRepertory(idRep) {
        const result = await Database.executeSql(`
            SELECT * FROM repertory_songs 
            WHERE repertory_id = ?
            ORDER BY idx;
        `, [idRep]);

        let out = []
        for( let i = 0; i < result.rows.length; i++ ){
            out.push(result.rows.item(i))
        }
        return out
    }

    async detachAllSongs(idRep) {
        return await Database.executeSql(`
            DELETE FROM  repertory_songs 
            WHERE repertory_id = ?
        `, [idRep])
    }

    async deleteBySong(idSong) {
        return await Database.executeSql(`
            DELETE FROM  repertory_songs 
            WHERE song_id = ?
        `, [idSong])
    }

    async setPlayed(idSong, idRep, played=1) {
        return await Database.executeSql(`
            UPDATE repertory_songs
                SET played = ?
            WHERE
                song_id = ? 
                AND repertory_id = ?
        `, [played, idSong, idRep])
    }

    async unsetAllPlayed(idRep) {
        return await Database.executeSql(`
            UPDATE repertory_songs
                SET played = 0
            WHERE
                repertory_id = ?
        `, [idRep])
    }
}

export default new RepertoryStore;