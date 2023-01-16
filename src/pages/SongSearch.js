import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Box, ScrollView, VStack } from "native-base";
import React, { useEffect, useRef, useState } from "react";
import { Alert, Keyboard, TextInput, useWindowDimensions } from "react-native";
import Button from "../components/Button";
import GradientPageBase from "../components/GradientPageBase";
import InputSearch from "../components/InputSearch";
import RenderSearchedSongList from "../components/RenderSearchedSongList";
import useCifrasRepo from "../services/repos/cifras";
import { formatCipher } from "../utils/cipherFind";
import useLang from "../utils/useLang";

export default function () {

    const [search, setSearch] = useState('')
    const [songs, setSongs] = useState([])
    const [loading, setLoading] = useState(false)

    const {height} = useWindowDimensions()
    const cifrasRepo = useCifrasRepo()
    const navigation = useNavigation()
    const lang = useLang()
    const inputRef = useRef(null)
    const isFocused = useIsFocused()

    useEffect(() => {
        if (isFocused && !songs.length) {
            setTimeout(() => {
                inputRef.current?.focus()
            }, 200)
        }
    }, [isFocused])

    function onSelectHandle(song) {

        if (!song || !song.COD_TITULO || !song.COD_ARTISTA)
            return
            
        setLoading(true)

        cifrasRepo.findSong(song)
                  .then(s => {
                    let result = {
                        name:   song.TITULO,
                        artist: song.ARTISTA,
                        cipher: formatCipher(s.data)  
                    }
                    navigation.navigate('CipherView', {song: result})
                  })
                  .catch((e) => {
                    Alert.alert(lang('Opss...'), lang('There was an error when searching for song'))
                  })
                  .finally(() => {
                    setLoading(false)
                  })

    }

    async function searchHandle() {

        if (!search) 
            return
        
        Keyboard.dismiss()
        setLoading(true)
        const result = await cifrasRepo.searchSongs(search)
        setLoading(false)
        setSongs([...result.data.songs])
    }

    return (
        <GradientPageBase>

            <Box>
                <Box p={3}>
                    <InputSearch
                        value={search}
                        onChangeText={setSearch}
                        onSearch={searchHandle}
                        onClean={() => setSearch('')}
                        loading={loading}
                        ref={inputRef}
                    />
                </Box>
                <Box>
                    <ScrollView h={height-150} keyboardShouldPersistTaps='handled'>
                        <VStack space={3} p={3}>
                            {
                                songs.map((s, i) => (
                                    <RenderSearchedSongList 
                                        song={s} 
                                        key={i}
                                        onPress={onSelectHandle}
                                    />
                                ))
                            }
                        </VStack>
                    </ScrollView>
                </Box>
            </Box>

        </GradientPageBase>
    )
}