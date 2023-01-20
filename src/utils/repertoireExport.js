import RepertoryGroupsStore from "../services/store/RepertoryGroupsStore"
import RepertoryStore from "../services/store/RepertoryStore"
import SongStore from "../services/store/SongStore"
import RNFS from 'react-native-fs';
import * as localStorage from "../utils/localStorage";
import { Alert, PermissionsAndroid } from "react-native";

const saveHandle = async (content, fileName) => {

    const permissionType = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
    const granted = await PermissionsAndroid.request(permissionType)
    if (granted != PermissionsAndroid.RESULTS.GRANTED) {
        throw 'App without permission'
    }
    
    console.log(granted)
    if (!content.name)
        throw "Nada a ser salvo"
    
    const date = new Date()

    if (!fileName) {
        fileName = `repfile_${content.name.replaceAll(' ', '_')}_${date.getTime()}`
    }

    fileName += '.json'

    let stringContent = JSON.stringify(content)
    
    return await localStorage.createFile(fileName, stringContent)
}

const exportHandle = async (repId, name) => {

    if (!repId)
        return false

    let out = {}

    const rep = await RepertoryStore.find(repId)
    const groups = await RepertoryGroupsStore.getWithSongs(repId)

    // format json
    out = {
        name: rep.name,
        groups: groups.map(g => ({
            name: g.name,
            idx: g.idx,
            songs: g.songs.map(s => ({
                name: s.name,
                artist: s.artist,
                cipher: s.cipher,
                idx: s.idx,
            }))
        }))
    }

    return await saveHandle(out, name)
}

const importHandle = async (path, allowsSearchSongImport = false) => {

    if (path.type != 'application/json')
        throw 'Invalid file for import'

    let content = await localStorage.getFileContent(path.uri)
    content = JSON.parse(content)

    if (!content || !content.name)
        throw 'Invalid file for import'

    // verify existing name
    const isNameExists = await RepertoryStore.getByName(content.name)
    if (!!isNameExists && !!isNameExists.name) {
        content.name += ' (1)'
    }

    
    
    let createdRep = await RepertoryStore.insert({name: content.name})

    if (!createdRep || !createdRep.insertId) {
        throw 'Invalid file for import'
    }

    let repId = createdRep.insertId

    for (const group of content.groups) {

        
        // create groups
        let createdGroup = await RepertoryGroupsStore.insert({
            repertory_id: repId,
            name: group.name,
            idx: group.idx
        })
        let groupId = createdGroup.insertId
        let songsId = []

        // create songs
        for (let song of group.songs) {

            existingSong = null

            // find by a existing song by name (if allowed)
            if (!!allowsSearchSongImport && !!song.name) {
                existingSong = await SongStore.findByName(song.name)

                if (!!existingSong) {
                    song.id = existingSong.id
                }
            }
            
            // if not existis song or not allowed
            if (!existingSong || !allowsSearchSongImport) {
                const createdSong = await SongStore.insert({...song})
                song.id = createdSong.insertId
            }

            if (!!song.id) {
                songsId.push(song.id)
            }
        }

        // attach songs
        await RepertoryGroupsStore.attachSongs(groupId, songsId)
    }

    return true
}

export {exportHandle, importHandle}
