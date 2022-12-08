import Database from './Database';

class RepertoryStore{

    async insert(params = {}) {

        let idx = await this.getNextIdxByRepertory(params.repertory_id)

        return await Database.executeSql(`
            INSERT INTO repertory_groups
                (repertory_id, name, idx)
            VALUES (?, ?, ?);
        `, [params.repertory_id, params.name, idx]);
    }

    async getNextIdxByRepertory(idRep) {
        let result = await Database.executeSql(`
            SELECT * FROM 
                repertory_groups
            WHERE repertory_id = ?
            ORDER BY idx desc limit 1
        `, [idRep]);

        let group = result.rows.item(0)

        return group ? (group.idx+1) : 0
    }

    async update(params = {}) {
        return await Database.executeSql(`
            UPDATE repertory_groups
            SET 
                name = ?
            WHERE id = ?;
        `, [params.name, params.id]);
    }

    async attachSongs(groupId, songsId = []) {
        if (!songsId)
            return 

        let sqlInsert = []
        let arrayInsert = []
        songsId.forEach((item, idx) => {
            sqlInsert.push('(?, ?, ?)')
            arrayInsert.push(groupId, item, idx)
        })

        await Database.executeSql(`
            INSERT INTO repertory_songs
                (group_id, song_id, idx)
            VALUES
                ${sqlInsert.join(',')}
        `, arrayInsert)
    }

    async getByRepertory(idRep) {
        const result = await Database.executeSql(`
            SELECT 
                g.id as group_id,
                g.name as group_name,
                rs.idx, 
                rs.played,
                s.* 
            FROM repertory_groups g
            LEFT JOIN repertory_songs rs ON rs.group_id = g.id
            LEFT JOIN songs s ON s.id = rs.song_id
            WHERE g.repertory_id = ?
            ORDER BY g.id, rs.idx;
        `, [idRep]);

        let out = []
        for( let i = 0; i < result.rows.length; i++ ){
            out.push(result.rows.item(i))
        }
        return out
    }

    async getAllByRepertory(idRep) {
        const result = await Database.executeSql(`
            SELECT * FROM repertory_groups
            WHERE repertory_id = ?
        `, [idRep])

        let out = []
        for( let i = 0; i < result.rows.length; i++ ){
            out.push(result.rows.item(i))
        }
        return out
    }

    async detachAllSongs(groupId) {
        return await Database.executeSql(`
            DELETE FROM  repertory_songs 
            WHERE group_id = ?
        `, [groupId])
    }

    async delete(groupId) {
        return await Database.executeSql(`
            DELETE FROM  repertory_groups 
            WHERE id = ?
        `, [groupId])
    }

    async deleteByRepertory(idRep) {

        // detach songs from each group from this rep
        let groups = await this.getAllByRepertory(idRep)
        for (const g of groups) {
            await this.detachAllSongs(g.id)
        }

        return await Database.executeSql(`
            DELETE FROM repertory_groups 
            WHERE repertory_id = ?
        `, [idRep])
    }

    async getWithSongs(repId) {
        const groups = await this.getByRepertory(repId)

        let grouped = []

        for (const g of groups) {

            let song = {
                id:       g.id,
                name:     g.name,
                artist:   g.artist,
                cipher:   g.cipher,
                group_id: g.group_id,
                played:   g.played
            }

            let groupedIndex = grouped.findIndex(gp => gp.id == g.group_id)
            
            if (groupedIndex >= 0) {
                grouped[groupedIndex].songs.push(song)
            } else {
                grouped.push({
                    id: g.group_id,
                    name: g.group_name,
                    songs: song.id ? [song] : []
                })
            }
        }

        return grouped
    }
}

export default new RepertoryStore;