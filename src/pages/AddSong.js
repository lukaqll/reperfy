import { Box, ChevronDownIcon, ChevronUpIcon, FlatList, FormControl, Pressable, Text, Toast, VStack } from "native-base";
import React, { useEffect, useRef, useState } from "react";
import SongStore from "../services/store/SongStore";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import ModalCifrasSearch from "../components/ModalCifrasSearch";
import ModalCipherEdit from "../components/ModalCipherEdit";
import Button from "../components/Button";
import Input from "../components/Input";
import useStyle from "../styles";
import GradientPageBase from "../components/GradientPageBase";
export default function ({route}) {

    const [song, setSong] = useState({})
    const [modalAddCipher, setModalAddCipher] = useState(false)
    const [modalAlterCipher, setModalAlterCipher] = useState(false)
    const [selectedSong, setSelectedSong] = useState({})
    const [artistSug, setArtistSug] = useState([])
    const [loading, setLoading] = useState(false)
    const [autocompleteOpen, setAutocompleteOpen] = useState(false)

    const isFocused = useIsFocused()
    const navigation = useNavigation()
    const artistInputRef = useRef()
    const styles = useStyle()

    useEffect(() => {
        if (route.params && (id = route.params.id)) {
            find(id)
        }
        getAllArtists('')
    }, [isFocused])

    async function find(id) {
        setLoading(true)
        const result = await SongStore.find(id)
        setSong(result)
        setLoading(false)
    }

    async function getAllArtists(term) {

        setLoading(true)
        let result = await SongStore.getAllArtists(term)
        setArtistSug([...result])
        setLoading(false)
    }

    async function save() {

        if (!song.name) {
            Toast.show({description: 'Insira um nome'})
            return
        }
        if (!song.id) {
            await SongStore.insert(song)
        } else {
            await SongStore.update(song)
        }
        navigation.navigate('Songs')
    }

    function editCipherHandle() {
        setSelectedSong({...song, BUSCA: `${song.name} ${song.artist}`})
        setModalAlterCipher(true)
    }

    function getArtistsFilter() {
        return artistSug.filter(i => (
            i.artist?.toLowerCase()
                    .includes((song.artist ? song.artist.toLowerCase() : '')))
        )
    }
    const artistFiltered = getArtistsFilter()
    return (

        <GradientPageBase>
            <Box p={4} h='100%'>
                <Box>
                    <Box>
                        <Input
                            label='Nome'
                            value={song.name}
                            onChangeText={v => setSong({...song, name: v})}
                            onFocus={() => setAutocompleteOpen(false)}
                        />
                        <Box>
                            <Input
                                label='Artista'
                                ref={artistInputRef}
                                value={song.artist}
                                onChangeText={v => setSong({...song, artist: v})}
                                onFocus={() => setAutocompleteOpen(true)}
                                rightElement={
                                    autocompleteOpen ? 
                                    <ChevronUpIcon color={styles.fontColor} mr={3} onPress={() => setAutocompleteOpen(false)}/> 
                                    : <ChevronDownIcon color={styles.fontColor} mr={3} onPress={() => setAutocompleteOpen(true)}/>
                                }
                            />

                            <Box>
                                {
                                    autocompleteOpen && artistFiltered.length ? 
                                    <Box shadow={5} rounded='lg' bg='#fff' p={2} maxH={200}>
                                        <FlatList
                                            data={artistFiltered}
                                            keyExtractor={(_, i) => i}
                                            renderItem={({item}) => (
                                                <Pressable mb={2} onPress={() => {
                                                    setSong({...song, artist: item.artist})
                                                    setAutocompleteOpen(false)
                                                }}>
                                                    <Text>{item.artist}</Text>
                                                </Pressable>
                                            )}
                                        />
                                    </Box>
                                    : null
                                }
                            </Box>
                        </Box>
                    </Box>
                    <VStack space={3} mt={10}>
                        <Button bg={styles.primary} onPress={save}>SALVAR</Button>
                        <Button bg={styles.warning} onPress={() => setModalAddCipher(true)}>BUSCAR CIFRA</Button>
                        {
                            song.cipher ?
                            <Button bg={styles.warning} onPress={editCipherHandle}>EDITAR CIFRA</Button> : null
                        }
                    </VStack>
                </Box>

                <ModalCifrasSearch 
                    isOpen={modalAddCipher} 
                    onClose={() => setModalAddCipher(false)}
                    onSelect={selected => {
                        setModalAlterCipher(true)
                        setSelectedSong(selected)

                        let newSong = {...song}
                        if (!newSong.name) {
                            newSong.name = selected.TITULO
                        }
                        if (!newSong.artist) {
                            newSong.artist = selected.ARTISTA
                        }
                        setSong({...newSong})
                    }}
                    initialSongName={song.name || ''}
                />
                <ModalCipherEdit 
                    isOpen={modalAlterCipher && !!selectedSong.cipher}
                    onClose={() => setModalAlterCipher(false)}
                    song={selectedSong}
                    onSave={saved => {
                        const newSong = {...song, ...saved}
                        setSong(newSong)
                        setModalAlterCipher(false)
                    }}
                />
            </Box>
        </GradientPageBase>
    )
}