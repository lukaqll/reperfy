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

    async getAllArtists(term) {
        const result = await Database.executeSql(`
            SELECT artist FROM 
                songs
            WHERE artist like ?
            GROUP BY artist
            ORDER BY artist;
        `, [`%${term}%`]);

        let out = []
        for( let i = 0; i < result.rows.length; i++ ){
            out.push(result.rows.item(i))
        }
        return out
    }
    async findWithNextAndPrevious(id, repId, groupId) {

        let result = await this.find(id)
        result.group_id = groupId
        if (result) {
            result.next = await this.getNextSong(id, repId, groupId)
            result.prev = await this.getPrevSong(id, repId)
        }

        return result
        
    }

    async getNextSong(songId, repId, groupId) {
        const result = await Database.executeSql(`
            SELECT
               ns.*,
               concrete_next_group.id as next_group_id
            FROM
                songs s

            JOIN repertory_songs cur 
                ON cur.song_id = s.id
            JOIN repertory_groups rg
                ON cur.group_id = rg.id
                AND rg.repertory_id = '${repId}'
                AND rg.id = '${groupId}'
            
            JOIN repertory_groups next_rg
               ON next_rg.repertory_id = rg.repertory_id
               
            JOIN repertory_songs next
                ON ( 
                             ( next.group_id = cur.group_id AND next.idx > cur.idx ) 
                              OR 
                              ( next.group_id != cur.group_id AND next.idx < cur.idx AND  next_rg.idx > rg.idx  )
                       )
                      
            JOIN songs ns
                ON ns.id = next.song_id
               AND s.id != ns.id
            JOIN repertory_groups concrete_next_group
                ON concrete_next_group.id = next.group_id
               
            WHERE s.id = '${songId}'
            
            ORDER BY next_rg.idx, next.idx
            LIMIT 1;
        `)

        return result.rows.item(0)
    }

    async getPrevSong(songId, repId, groupId) {
        const result = await Database.executeSql(`
        SELECT
            ps.*,
            concrete_prev_group.id as prev_group_id
        FROM
            songs s

        JOIN repertory_songs cur 
            ON cur.song_id = s.id
        JOIN repertory_groups rg
            ON cur.group_id = rg.id
            AND rg.repertory_id = '${repId}'
            AND rg.id = '${groupId}'
        
        JOIN repertory_groups prev_rg
            ON prev_rg.repertory_id = rg.repertory_id
            
        JOIN repertory_songs prev
            ON ( 
                    ( prev.group_id = cur.group_id AND prev.idx < cur.idx ) 
                    OR 
                    ( prev.group_id != cur.group_id AND prev.idx > cur.idx AND  prev_rg.idx < rg.idx  )
                )
                
        JOIN songs ps
            ON ps.id = prev.song_id
            AND s.id != ps.id
        JOIN repertory_groups concrete_prev_group
            ON concrete_prev_group.id = prev.group_id
            
        WHERE s.id = '${songId}'
        
        ORDER BY prev_rg.idx desc, prev.idx desc
        LIMIT 1;
        `)

        return result.rows.item(0)
    }
}

export default new SongStore;