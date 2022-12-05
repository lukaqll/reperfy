import { Box, Checkbox, CloseIcon, Divider, FlatList, FormControl, Pressable,  HStack, Menu, SearchIcon, VStack, HamburgerIcon, Toast, ScrollView } from "native-base";
import React, { useEffect, useState } from "react";
import SongStore from "../services/store/SongStore";
import RepertoryStore from "../services/store/RepertoryStore";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { ActivityIndicator, Alert, TouchableOpacity, useWindowDimensions } from "react-native";
import FLoatButton from "../components/FLoatButton";
import Icon from "react-native-vector-icons/FontAwesome5";
import RepertorySongsStore from "../services/store/RepertorySongsStore";
import Loader from "../components/Loader";
import DraggableFlatList from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Input from "../components/Input";
import Button from "../components/Button";
import styles from "../styles";
import Text from '../components/Text'
import Heading from '../components/Heading'


export default function ({route}) {

    const [rep, setRep] = useState({})
    const [songs, setSongs] = useState([])
    const [songSearch, setSongSearch] = useState()
    const [selectedSongIds, setSelectedSongIds] = useState([])
    const [selectedSongs, setSelectedSongs] = useState([])
    const [loading, setLoading] = useState(false)
    const [addMode, setAddMode] = useState(false)
    const [formSize, setFormSize] = useState({})

    const isFocused = useIsFocused()
    const navigation = useNavigation()

    const {height} = useWindowDimensions()

    useEffect(() => {
        if (route.params && (id = route.params.id)) {
            find(id)
        }
        getAllSongs()
    }, [isFocused])

    useEffect(() => {
        if (!addMode) {
            songsSetHandle()
        }
    }, [addMode])

    useEffect(() => {
        songsSetHandle()
    }, [selectedSongIds])

    /**
     * find repertory
     */
    async function find(id) {
        setLoading(true)
        const result = await RepertoryStore.find(id)
        const attachedSongs = await RepertorySongsStore.getByRepertory(id)
        setSelectedSongIds(attachedSongs.map(i => i.song_id))
        setRep(result)
        setLoading(false)
    }

    /**
     * get songs
     */
    async function getAllSongs() {
        const result = await SongStore.getAll()
        setSongs([...result])
    }

    function songsSetHandle() {
        let selSongs = [...selectedSongs]

        // remove
        for (const i in selSongs) {
            if (!selectedSongIds.includes(selSongs[i].id)) {
                selSongs.splice(i, 1)
            }
        }

        // add
        for (const s of selectedSongIds) {
            if (!selectedSongs.map(i => i.id).includes(s)) {
                selSongs.push(songs.find(i => i.id == s))
            }
        }

        setSelectedSongs([...selSongs])
    }

    /**
     * save repertory
     */
    async function save() {

        try {

            if (!rep.name) {
                throw "Insira um nome para o repertório"
            }

            setLoading(true)

            if (!rep.id) {
                const result = await RepertoryStore.insert(rep)
                await RepertorySongsStore.attachSongs(result.insertId, selectedSongs.map(i => i.id))
            } else {
                await RepertoryStore.update(rep)
                await RepertorySongsStore.detachAllSongs(rep.id)
                await RepertorySongsStore.attachSongs(rep.id, selectedSongs.map(i => i.id))
            }
            navigation.navigate('Repertoires')
        } catch (e) {
            Toast.show({description: e})
        }
    }

    /**
     * render item
     */
    function renderDraggableItem({ item, drag, isActive }) {
        return (
            <Box my={1} p={1} rounded={5} bg={isActive ? '#ddd' : null}>
                <HStack >
                    <Pressable
                        p={2} mr={2} _pressed={{opacity: .7}}
                        onLongPress={drag}
                    >
                        <HamburgerIcon/>
                    </Pressable>
                    <VStack>
                        <Heading fontSize='sm'>{item.name}</Heading>
                        <Text>{item.artist}</Text>
                    </VStack>
                </HStack>
            </Box>
        );
    };    

    return (
        <Box h='100%'>
            <Box onLayout={(event) => {setFormSize(event.nativeEvent.layout)}}>
                <Box p={4}>
                    <Input
                        label='Nome'
                        value={rep.name}
                        onChangeText={v => setRep({...rep, name: v})}
                    />
                </Box>
                {
                    !addMode ? 
                    <VStack space={3} p={4}>
                        <Button bg={styles.success} onPress={save}>SALVAR</Button>
                        <Button onPress={() => setAddMode(true)}>ADICIONAR MÚSICAS</Button>
                    </VStack> : null
                }
            </Box>
            <Divider/>
            {
                addMode ? 
                <Box flex={1}>
                    <Box p={4}>
                        <VStack>
                            <HStack justifyContent='space-between'>
                                <Heading fontSize="lg">Músicas</Heading>
                                <Text>Selecionados: ({selectedSongIds.length})</Text>
                            </HStack>
                            <Box>
                                <Input 
                                    value={songSearch} onChangeText={setSongSearch}
                                    py={.5} bg='#fff' rounded='full'
                                    rightElement={!songSearch ? <SearchIcon mr={3}/> : <CloseIcon mr={3} colorScheme='error' onPress={() => setSongSearch(null)}/>}
                                />
                            </Box>
                        </VStack>
                    </Box>
                    <Box pb={100}>
                        <Checkbox.Group 
                            onChange={setSelectedSongIds} 
                            value={selectedSongIds}
                            colorScheme='green' 
                        >
                            <FlatList
                                w='100%'
                                keyboardShouldPersistTaps='handled'
                                data={songs.filter(i => (
                                    !songSearch 
                                    || i.name?.toLowerCase().includes(songSearch.toLowerCase())
                                    || i.artist?.toLowerCase().includes(songSearch.toLowerCase())))
                                }
                                renderItem={({item}) => (
                                    <Checkbox value={item.id} ml={3}>
                                        <VStack p={1}>
                                            <Heading size='sm'>{item.name}</Heading>
                                            <Text>{item.artist}</Text>
                                        </VStack>
                                    </Checkbox>
                                )}
                            />
                        </Checkbox.Group>
                    </Box>
                </Box>
                :
                <Box flex={1}>
                    <Box>
                        
                        <Box pb={100}>
                            <GestureHandlerRootView>
                                <DraggableFlatList
                                    style={{height: (height - (formSize.height || 0) - 100)}}
                                    data={selectedSongs}
                                    onDragEnd={({ data }) => setSelectedSongs(data)}
                                    keyExtractor={item => item.id}
                                    renderItem={renderDraggableItem}
                                /> 
                            </GestureHandlerRootView>
                        </Box>
                    </Box>
                </Box>
            }

            {
                addMode ?
                <FLoatButton
                    icon={<Icon name='check' color='#fff' size={25}/>}
                    colorScheme='success'
                    onPress={() => setAddMode(false)}
                /> : null
            }
            <Loader loading={loading}/>
        </Box>
    )
}