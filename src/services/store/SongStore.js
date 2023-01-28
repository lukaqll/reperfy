import Database from './Database';
import RepertorySongsStore from './RepertorySongsStore';
import RepertoryGroupsStore from './RepertoryGroupsStore';

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

    async findByName(name) {

        name = !!name ? name.toLowerCase() : ''

        const result = await Database.executeSql(`
            SELECT * FROM songs WHERE lower(name) = ? LIMIT 1;
        `, [name]);

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

    async findInRepertoire(id, groupId) {
        const result = await Database.executeSql(`
            SELECT 
                s.*, rs.played, rs.group_id
            FROM songs s
                JOIN repertory_songs rs
                    ON rs.song_id = s.id
                    AND rs.group_id = ?
            WHERE s.id = ? LIMIT 1;
        `, [groupId, id]);

        return result.rows.item(0)
    }

    async findWithNextAndPrevious(id, repId, groupId) {

        let result = await this.findInRepertoire(id, groupId)
        result.group_id = groupId
        if (result) {
            result.next = await this.getNextSong(id, repId, groupId)
            result.prev = await this.getPrevSong(id, repId, groupId)
            result.next_absolute = await this.getNextSong(id, repId, groupId, false)
            result.prev_absolute = await this.getPrevSong(id, repId, groupId, false)
        }

        return result
        
    }

    async getNextSong(songId, repId, groupId, onlyWithCipher = true) {

        let repSong = await RepertorySongsStore.find(songId, groupId);
        let curGroup = await RepertoryGroupsStore.fingWithLastIdx(groupId)
        let isLastSongOfCurrentGroup = repSong.idx == curGroup.songs_idx
        let nextGroupIdx = isLastSongOfCurrentGroup ? (curGroup.idx+1) : curGroup.idx
        let nextSongIdx  = isLastSongOfCurrentGroup ? 0 : (repSong.idx+1)

        let result = await Database.executeSql(`
            SELECT 
                s.*, g.id as next_group_id
            FROM
                repertory_groups g
            JOIN repertory_songs rs
                ON rs.group_id = g.id
                AND rs.idx = ${nextSongIdx}
                AND g.idx = ${nextGroupIdx}
            
            JOIN songs s
                ON s.id = rs.song_id
                ${onlyWithCipher ? `AND s.cipher != '' AND s.cipher IS NOT NULL` : ''}
            WHERE g.repertory_id = ${repId}
        `)
        return result.rows.item(0)
    }

    async getPrevSong(songId, repId, groupId, onlyWithCipher = true) {

        let repSong = await RepertorySongsStore.find(songId, groupId);
        let curGroup = await RepertoryGroupsStore.fingWithLastIdx(groupId)
        let isFirstSongOfCurrentGroup = repSong.idx == 0
        let prevGroupIdx = isFirstSongOfCurrentGroup ? (curGroup.idx-1) : curGroup.idx

        // find prev group by idx and rep with max song idx
        let prevGroup = await Database.executeSql(`
            SELECT g.*, rs.idx AS last_song_idx FROM
                repertory_groups g
            JOIN repertory_songs rs
                ON rs.group_id = g.id
            WHERE g.idx = ${prevGroupIdx}
                AND g.repertory_id = ${repId}
            GROUP BY g.id HAVING MAX(rs.idx)
            LIMIT 1
        `)
        prevGroup = prevGroup.rows.item(0)
        if (!prevGroup || !prevGroup.id)
            return null

        let prevSongIdx  = isFirstSongOfCurrentGroup ? prevGroup.last_song_idx : (repSong.idx-1)

        let result = await Database.executeSql(`
            SELECT 
                s.*, g.id as next_group_id
            FROM
                repertory_groups g
            JOIN repertory_songs rs
                ON rs.group_id = g.id
                AND rs.idx = ${prevSongIdx}
                AND g.idx = ${prevGroupIdx}
            JOIN songs s
                ON s.id = rs.song_id
                ${onlyWithCipher ? `AND s.cipher != '' AND s.cipher IS NOT NULL` : ''}
            WHERE g.repertory_id = ${repId}
            LIMIT 1
        `)
        return result.rows.item(0)
    }
}

export default new SongStore;