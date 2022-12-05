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
    async findWithNextAndPrevious(id, repId) {
        // const result = await Database.executeSql(`
        //     SELECT 
        //         s.*,
        //         prev.song_id as prev_song_id,
        //         s_p.name as prev_song_name,
                
        //         next.song_id as next_song_id,
        //         s_n.name as next_song_name
        //     FROM 
        //         songs s
        //     JOIN repertory_songs rs 
        //         ON rs.song_id = s.id
        //         AND rs.repertory_id = ?

        //     LEFT JOIN repertory_songs next
        //         ON next.repertory_id = rs.repertory_id
        //         AND next.idx > rs.idx
        //     LEFT JOIN songs s_n
        //         ON s_n.id = next.song_id
            
        //     LEFT JOIN repertory_songs prev
        //         ON prev.repertory_id = rs.repertory_id
        //         AND prev.idx < rs.idx
        //     LEFT JOIN songs s_p
        //         ON s_p.id = prev.song_id
                            
        //     WHERE s.id = ?
        //     ORDER BY next.idx, prev.idx desc
        //     LIMIT 1;
        // `, [repId, id]);

        let result = await this.find(id)
        if (result) {
            result.next = await this.getNextSong(id, repId)
            result.prev = await this.getPrevSong(id, repId)
        }

        return result
        
    }

    async getNextSong(songId, repId) {
        const result = await Database.executeSql(`
            SELECT 
                ns.*
            FROM
                songs s
            JOIN repertory_songs cur 
                ON cur.song_id = s.id
                AND cur.repertory_id = ?
            
            JOIN repertory_songs next
                ON next.repertory_id = cur.repertory_id
                AND next.idx > cur.idx
            JOIN songs ns
                ON ns.id = next.song_id
                AND ns.cipher != ''
                AND ns.cipher IS NOT NULL

            WHERE s.id = ?
            ORDER BY next.idx
            LIMIT 1;
        `, [repId, songId])

        return result.rows.item(0)
    }

    async getPrevSong(songId, repId) {
        const result = await Database.executeSql(`
            SELECT 
                ps.*
            FROM
                songs s
            JOIN repertory_songs cur 
                ON cur.song_id = s.id
                AND cur.repertory_id = ?
            
            JOIN repertory_songs prev
                ON prev.repertory_id = cur.repertory_id
                AND prev.idx < cur.idx
            JOIN songs ps
                ON ps.id = prev.song_id
                AND ps.cipher != ''
                AND ps.cipher IS NOT NULL

            WHERE s.id = ?
            ORDER BY prev.idx desc
            LIMIT 1;
        `, [repId, songId])

        return result.rows.item(0)
    }
}

export default new SongStore;