import { FormControl, Heading, Modal, VStack } from "native-base";
import React, { useEffect, useState } from "react";
import useCifrasRepo from "../services/repos/cifras";
import InputSearch from "./InputSearch";
import { Keyboard } from "react-native";
import useStyle from "../styles";
import RenderSearchedSongList from "./RenderSearchedSongList";
import {formatCipher} from '../utils/cipherFind'
import useLang from "../utils/useLang";

export default function (props) {

    const styles = useStyle()
    const lang = useLang()

    const cifrasRepo = useCifrasRepo()

    const [search, setSearch] = useState('')
    const [songs, setSongs] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {

        if (props.isOpen) {

            if (props.initialSongName) {
                setSearch(props.initialSongName)
                searchCifras(props.initialSongName)
            }
        } else {
            setSearch(null)
            setSongs([])
        }

    }, [props.isOpen])

    async function searchCifras(term = null) {

        let toSearch = search || (typeof term == 'string' ? term : null)

        if (!toSearch)
            return

        Keyboard.dismiss()
        setLoading(true)
        let result = await cifrasRepo.searchSongs(toSearch)
        setSongs(result.data.songs)
        setLoading(false)
    }

    async function findSong(song) {
        if (!song || !song.COD_TITULO || !song.COD_ARTISTA)
            return

        setLoading(true)
        let result = await cifrasRepo.findSong(song)
        
        let cipher =  formatCipher(result.data)       
        song.cipher = cipher
        props.onClose()
        props.onSelect(song)
        setLoading(false)
    }

    

    return (
        <Modal 
            isOpen={props.isOpen}
            onClose={props.onClose}
            size='full'
        >
            <Modal.Content bgColor={styles.bg} >
                <Modal.CloseButton />
                <Modal.Header bgColor={styles.bg} >
                    <VStack space={4}>
                        <Heading size='md' color={styles.fontColor}>{lang('Search cipher')}</Heading>
                        <FormControl>
                            <InputSearch
                                value={search}
                                onChangeText={setSearch}
                                onClean={() => setSearch('')}
                                onSearch={searchCifras}
                                loading={loading && props.isOpen}
                            />
                        </FormControl>
                    </VStack>

                </Modal.Header>
                <Modal.Body >
                        <VStack space={2}>
                            {songs.map((s,i) => <RenderSearchedSongList song={s} key={i} onPress={async (song) => await findSong(song) }/>)}
                        </VStack>
                </Modal.Body>
            </Modal.Content>
        </Modal>
    )
}