import { Box, ChevronDownIcon, ChevronUpIcon, FlatList, FormControl, Pressable, SearchIcon, Toast, VStack } from "native-base";
import React, { useEffect, useRef, useState } from "react";
import SongStore from "../services/store/SongStore";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import ModalCifrasSearch from "../components/ModalCifrasSearch";
import ModalCipherEdit from "../components/ModalCipherEdit";
import Button from "../components/Button";
import Input from "../components/Input";
import useStyle from "../styles";
import GradientPageBase from "../components/GradientPageBase";
import Text from "../components/Text";
import useLang from "../utils/useLang";
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
    const styles = useStyle()
    const lang = useLang()

    useEffect(() => {
        if (route.params && (id = route.params.id)) {
            find(id)
            navigation.setOptions({
                title: lang('Edit song')
            })
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
            Toast.show({description: lang('Enter a name')})
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
                            label='Name'
                            value={song.name}
                            onChangeText={v => setSong({...song, name: v})}
                            onFocus={() => setAutocompleteOpen(false)}
                            rightElement={<SearchIcon onPress={() => setModalAddCipher(true)} size={21} color={styles.fontColor} mr={5}/>}
                            returnKeyType='search'
                            onSubmitEditing={() => setModalAddCipher(true)}
                        />
                        <Box>
                            <Input
                                label='Artist'
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
                                    <Box shadow={5} rounded='lg' bg={styles.bgDark} p={2} maxH={200}>
                                        <FlatList
                                            data={artistFiltered}
                                            keyExtractor={(_, i) => i}
                                            renderItem={({item}) => (
                                                <Pressable mb={2} _pressed={{opacity: .7}} onPress={() => {
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
                        <Button bg={styles.primary} onPress={save}>SAVE</Button>
                        {
                            song.cipher ?
                            <Button 
                                variant='ghost'
                                bg={null} 
                                shadow={null} 
                                _text={{color: styles.fontColor}} 
                                _pressed={{backgrounCOlor: null}}
                                onPress={editCipherHandle}
                            >EDIT CIPHER</Button> : null
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
                        newSong.name = selected.TITULO

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