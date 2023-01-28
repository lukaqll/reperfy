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

    async detachAllSongsByGroup(idGroup) {
        return await Database.executeSql(`
            DELETE FROM repertory_songs 
            WHERE group_id = ?
        `, [idGroup])
    }

    async deleteBySong(idSong) {
        return await Database.executeSql(`
            DELETE FROM repertory_songs 
            WHERE song_id = ?
        `, [idSong])
    }

    async setPlayed(idSong, idRep, played=1) {
        return await Database.executeSql(`
            UPDATE repertory_songs
                SET played = ?
            WHERE
                song_id = ? 
                AND group_id = ?
        `, [played, idSong, idRep])
    }

    async unsetAllPlayed(idRep) {

        let allSongs = await this.getAllByRepertoryToUnplay(idRep)
        if (!allSongs)
            return

        let idsRs = allSongs.map(i => i.id)

        return await Database.executeSql(`
            UPDATE repertory_songs
                SET played = 0
            WHERE id IN (${idsRs.join(',')})
        `)
    }

    async getAllByRepertoryToUnplay(idRep) {

        let result = await Database.executeSql(`
            SELECT 
                rs.*
            FROM
                repertory_songs rs
                JOIN repertory_groups g ON g.id = rs.group_id
                    AND g.repertory_id = ?
                    AND rs.played = 1
            GROUP BY rs.id
        `, [idRep])


        let out = []
        for( let i = 0; i < result.rows.length; i++ ){
            out.push(result.rows.item(i))
        }
        return out
    }

    async find(songId, groupId) {
        const result = await Database.executeSql(`
            SELECT * FROM repertory_songs WHERE song_id = ? AND group_id = ? LIMIT 1;
        `, [songId, groupId]);

        return result.rows.item(0)
    }

    async getPlayedByRep(repId) {
        const result = await Database.executeSql(`
            SELECT rs.* FROM 
                repertory_songs rs
            JOIN repertory_groups g
                ON g.id = rs.group_id
            WHERE 
                g.repertory_id = ?
                AND rs.played = 1;
        `, [repId]);

        let out = []
        for( let i = 0; i < result.rows.length; i++ ){
            out.push(result.rows.item(i))
        }
        return out
    }

}

export default new RepertoryStore;