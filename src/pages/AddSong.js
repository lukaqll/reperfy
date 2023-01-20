import { Box, ChevronDownIcon, ChevronUpIcon, FlatList, FormControl, HStack, Pressable, SearchIcon, Switch, Toast, VStack } from "native-base";
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
import GhostButton from "../components/GhostButton";
import Banner from "../components/Ads/Banner";
import Loader from "../components/Loader";
import { Alert } from "react-native";
import Heading from "../components/Heading";
export default function ({route}) {

    const [song, setSong] = useState({})
    const [modalAddCipher, setModalAddCipher] = useState(false)
    const [modalAlterCipher, setModalAlterCipher] = useState(false)
    const [selectedSong, setSelectedSong] = useState({})
    const [artistSug, setArtistSug] = useState([])
    const [loading, setLoading] = useState(false)
    const [autocompleteOpen, setAutocompleteOpen] = useState(false)
    const [createNewAfterSave, setCreateNewAfterSave] = useState(true)

    const isFocused = useIsFocused()
    const navigation = useNavigation()
    const styles = useStyle()
    const lang = useLang()

    useEffect(() => {
        if (route.params) {
            const params = route.params
            if (id = params.id) {
                find(id)
                navigation.setOptions({
                    title: lang('Edit song')
                })
            } else if (params.song) {
                setSong(params.song)
            }
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

    async function saveHandle() {

        if (!song.name) {
            Toast.show({description: lang('Enter a name')})
            return
        }
        setLoading(true)

        if (!song.id) {
            const sameNameSong = await SongStore.findByName(song.name)
            console.log(sameNameSong)
            if (sameNameSong && sameNameSong.id) {
                Alert.alert(
                    lang('There is already a song with this name'),
                    lang('Create anyway?'),
                    [
                        {text: lang('No')},
                        {
                            text: lang('Yes'),
                            onPress: save
                        },
                    ]
                )
            } else {
                await save()
            }
        } else {
            await save()
        }
        setLoading(false)
    }

    async function save() {

        if (!song.id) {
            await SongStore.insert(song)
        } else {
            await SongStore.update(song)
        }

        if (createNewAfterSave && !song.id) {
            Toast.show({description: lang('Saved')})
            setSong({})
        } else {

            if (route.params && (redirect = route.params.redirect)) {
                if (redirect.to) {
                    navigation.navigate(redirect.to, redirect.params)
                }
            } else {
                navigation.goBack()
            }
        }
    }

    function editCipherHandle() {
        setSelectedSong({...song, BUSCA: `${song.name} ${song.artist}`})
        setModalAlterCipher(true)
    }

    function getArtistsFilter() {
        return artistSug.filter(i => (
            i.artist?.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, "")
                    .includes((song.artist ? song.artist.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, "") : '')))
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

                            {
                                !song.id ?
                                <HStack alignItems='center' space={2} mt={3}>
                                    <Switch
                                        size='lg'
                                        onTrackColor={styles.primary}
                                        value={createNewAfterSave}
                                        onToggle={setCreateNewAfterSave}
                                    />
                                    <Heading size='xs' mr={3} flex={1}>Add new song after saving</Heading>
                                </HStack> : null
                            }

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
                    <VStack space={3} mt={7}>
                        <Button bg={styles.primary} onPress={saveHandle}>SAVE</Button>
                        {
                            song.cipher ?
                            <GhostButton onPress={editCipherHandle}>EDIT CIPHER</GhostButton>
                            : null
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
                <Box alignItems='center'>
                    <Banner size='retangle' style={{marginTop: 30}}/>
                </Box>
            </Box>
            <Loader loading={loading}/>
        </GradientPageBase>
    )
}