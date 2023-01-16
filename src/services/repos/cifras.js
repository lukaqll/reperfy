import axios from "axios";

class CifrasRepo {

    instance;

    constructor() {
        this.instance = axios.create({baseURL: 'https://www.cifras.com.br'})
    }

    async searchSongs(songName = '') {
        return await this.instance.get(`/api/search?q=${songName}`)
    }

    async findSong(song = {}) {
        let codArtist = song.COD_ARTISTA
        let codName = song.COD_TITULO

        let type = 'cifra'

        if (song.INSTRUMENTOS && song.INSTRUMENTOS[0].SLUG != type) {
            type = song.INSTRUMENTOS[0].SLUG
        }
        return await this.instance.get(`/${type}/${codArtist}/${codName}`)
    }
}

function useCifrasRepo () {
    return new CifrasRepo
}

export default useCifrasRepo