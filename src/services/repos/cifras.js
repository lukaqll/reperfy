import axios from "axios";

class CifrasRepo {

    instance;

    constructor() {
        this.instance = axios.create({baseURL: 'https://www.cifras.com.br'})
    }

    async searchSongs(songName = '') {
        return await this.instance.get(`/api/search?q=${songName}`)
    }

    async findSong(codName = '', codArtist = '') {
        return await this.instance.get(`/cifra/${codArtist}/${codName}`)
    }
}

function useCifrasRepo () {
    return new CifrasRepo
}

export default useCifrasRepo