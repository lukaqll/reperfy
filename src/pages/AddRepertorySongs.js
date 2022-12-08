import { Box, Checkbox, CloseIcon, Divider, FlatList, FormControl, Pressable,  HStack, Menu, SearchIcon, VStack, HamburgerIcon, Toast, ScrollView, Fab, Modal, CheckIcon } from "native-base";
import React, { useEffect, useState } from "react";
import SongStore from "../services/store/SongStore";
import RepertoryStore from "../services/store/RepertoryStore";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { ActivityIndicator, Alert, Keyboard, TouchableOpacity, useWindowDimensions } from "react-native";
import FLoatButton from "../components/FLoatButton";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import RepertorySongsStore from "../services/store/RepertorySongsStore";
import Loader from "../components/Loader";
import DraggableFlatList, { NestableScrollContainer } from "react-native-draggable-flatlist";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Input from "../components/Input";
import Button from "../components/Button";
import useStyle from "../styles";
import Text from '../components/Text'
import Heading from '../components/Heading'
import GradientPageBase from "../components/GradientPageBase";
import InputSearch from "../components/InputSearch";
import RepertoryGroupsStore from "../services/store/RepertoryGroupsStore";
import FeaterIcon from 'react-native-vector-icons/Feather'


export default function ({route}) {

    const [rep, setRep] = useState({})
    const [songs, setSongs] = useState([])
    const [songSearch, setSongSearch] = useState()
    const [selectedSongIds, setSelectedSongIds] = useState([])
    const [selectedSongs, setSelectedSongs] = useState([])
    const [loading, setLoading] = useState(false)
    const [modalGroup, setModalGroup] = useState(false)
    const [formSize, setFormSize] = useState({})
    const [group, setGroup] = useState({})
    const [addGroupSongsId, setAddGroupSongsId] = useState()

    const isFocused = useIsFocused()
    const navigation = useNavigation()
    const styles = useStyle()

    const {height} = useWindowDimensions()

    useEffect(() => {
        if (route.params && (id = route.params.id)) {
            find(id)
        }
        getAllSongs()
    }, [isFocused])

    useEffect(() => {

        if (rep && rep.id) {
            navigation.setOptions({
                title: rep.name
            })
        }
    }, [rep])

    useEffect(() => {

        if (!!addGroupSongsId) {
            const gp = rep.groups.find(g => g.id == addGroupSongsId)
            let selSongs = []

            if (gp.songs) {
                selSongs = gp.songs.map(g => g.id)
            }

            setSelectedSongIds([...selSongs])
        }
    }, [addGroupSongsId])

    /**
     * find repertory
     */
    async function find(id) {
        setLoading(true)

        const result = await RepertoryStore.find(id)
        const groupsResult = await RepertoryGroupsStore.getWithSongs(id)
        result.groups = [...groupsResult]
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

    /**
     * render item
     */
    function renderDraggableItem({ item, drag, isActive }) {
        return (
            <Box my={1} p={1} rounded={5} bg={isActive ? styles.bgLight2 : null}>
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

    /**
     * saveGroupHandle
     */
    async function saveGroupHandle() {

        if (!group.name) {
            Toast.show({title: 'Insira um nome para o grupo'})
            return
        }
        setLoading(true)
        setModalGroup(false)
        Keyboard.dismiss()
        if (!group.id) {
            group.repertory_id = rep.id
            let result = await RepertoryGroupsStore.insert(group)
            await find(rep.id)
            setAddGroupSongsId(result.insertId)
        } else {
            await RepertoryGroupsStore.update(group)
            await find(rep.id)
        }
        setGroup({})
    }

    /**
     * attachSongsHandle
     */
    async function attachSongsHandle() {

        if (!addGroupSongsId)
            return

        setLoading(true)
        await RepertoryGroupsStore.detachAllSongs(addGroupSongsId)
        if (!!selectedSongIds.length) {
            await RepertoryGroupsStore.attachSongs(addGroupSongsId, selectedSongIds)
        }
        await find(rep.id)
        setAddGroupSongsId(false)
        setSelectedSongIds([])
    }

    /**
     * on drop handle
     */
    async function dropHandle(groupId, data) {
        setLoading(true)
        let songsId = data.map(s => s.id)
        await RepertoryGroupsStore.detachAllSongs(groupId)
        await RepertoryGroupsStore.attachSongs(groupId, songsId)
        await find(rep.id)
    }

    /**
     * on delete group
     */
    function deleteGroupHandle(id) {
        Alert.alert(
            'Deletar este grupo?', 
            'As músicas deste grupo também serão desvinculadas do repertório',
            [
                {text: 'não'},
                {
                    text: 'sim', 
                    onPress: async () => {
                        await RepertoryGroupsStore.detachAllSongs(id)
                        await RepertoryGroupsStore.delete(id)
                        await find(rep.id)
                    }
                },
            ]
        )
    }

    function getFilteredSongs() {

        const filteredSongs = songs.filter(i => (
            !songSearch 
            || i.name?.toLowerCase().includes(songSearch.toLowerCase())
            || i.artist?.toLowerCase().includes(songSearch.toLowerCase())))

        return filteredSongs
    }

    /**
     * on select song
     */
    function onSelectHandle(id, isSelected) {

        let selSongsId = [...selectedSongIds]

        if (!isSelected) {
            selSongsId.push(id)
        } else {
            let idx = selSongsId.findIndex(i => i == id)
            if (idx >= 0) {
                selSongsId.splice(idx, 1)
            }
        }

        setSelectedSongIds([...selSongsId])
    }

    function renderSelectableSong({item}) {
        const isSelected = selectedSongIds.includes(item.id)

        return (
            <Box ml={3}>
                <Pressable
                    onPress={() => onSelectHandle(item.id, isSelected)}
                >
                    <HStack alignItems='center'>
                        <Icon size={25} color={styles.primary} name={isSelected ? 'checkbox-marked-outline' : 'checkbox-blank-outline'}/>
                        <VStack p={1} ml={3}>
                            <Heading size='sm'>{item.name}</Heading>
                            <Text>{item.artist}</Text>
                        </VStack>
                    </HStack>
                </Pressable>
            </Box>
        )
    }

    return (
        <GradientPageBase>
            <Box h='100%'>
                <Box onLayout={(event) => {setFormSize(event.nativeEvent.layout)}}>
                    <VStack space={3} p={4}>
                        <Text fontSize='xs' alignSelf='center'>Adicione grupos ao repertório para vincular músicas</Text>
                        <Button bg={styles.primary} onPress={() => setModalGroup(true)}>ADICIONAR GRUPO</Button>
                    </VStack>
                </Box>
                <Box>
                    <NestableScrollContainer style={{height: (height - (formSize.height || 0) - 60)}}>
                    {
                        rep.groups ? rep.groups.map((g, i) => (
                            <Box p={2} key={i}>
                                <Box bg={styles.bgLight2} rounded='lg' p={2}>
                                    <HStack justifyContent='space-between' alignItems='center'>
                                        <Heading size='sm'>{g.name}</Heading>
                                        <Menu
                                            placement="left"
                                            trigger={props => (
                                                <Pressable {...props}>
                                                    <FeaterIcon name='more-vertical' size={20} color={styles.fontColor}/>
                                                </Pressable>
                                            )}
                                        >
                                            <Menu.Item onPress={() => setAddGroupSongsId(g.id)}>Add músicas</Menu.Item>
                                            <Menu.Item onPress={() => {
                                                    setGroup({...g})
                                                    setModalGroup(true)
                                                }}
                                            >
                                                Editar
                                            </Menu.Item>
                                            <Menu.Item _text={{color: styles.danger}} onPress={() => deleteGroupHandle(g.id)}>Excluir</Menu.Item>
                                        </Menu>
                                    </HStack>
                                </Box>
                                <GestureHandlerRootView>
                                    <DraggableFlatList
                                        data={g.songs}
                                        onDragEnd={({ data }) => dropHandle(g.id, data)}
                                        keyExtractor={(_, i) => i+1}
                                        renderItem={renderDraggableItem}
                                    /> 
                                </GestureHandlerRootView>
                            </Box>
                        )) : null
                    }
                    </NestableScrollContainer>
                </Box>

                {/**
                 * add songs to group
                 */}
                <Modal isOpen={!!addGroupSongsId} onClose={() => setAddGroupSongsId(null)} size='full' >
                    <Modal.Content bg={styles.bgDark}>
                        <Modal.Header bg={styles.bgDark} _text={{color: styles.fontColor}}>
                            Adicionar Músicas
                            <Modal.CloseButton/>
                        </Modal.Header>
                        <Modal.Body>

                            <Box flex={1}>
                                <Box>
                                    <VStack>
                                        <HStack justifyContent='space-between'>
                                            <Heading fontSize="lg">Músicas</Heading>
                                            <Text>Selecionados: ({selectedSongIds.length})</Text>
                                        </HStack>
                                        <Box>
                                            <InputSearch
                                                value={songSearch} onChangeText={setSongSearch}
                                                onClean={() => setSongSearch(null)}
                                            />
                                        </Box>
                                    </VStack>
                                </Box>
                                <Box pb={100}>
                                    {/* <Checkbox.Group
                                        onChange={setSelectedSongIds} 
                                        value={selectedSongIds}
                                        colorScheme='green' 
                                    > */}
                                        <FlatList
                                            w='100%'
                                            keyboardShouldPersistTaps='handled'
                                            keyExtractor={(_,i) => i}
                                            data={getFilteredSongs()}
                                            renderItem={renderSelectableSong}
                                        />
                                        {/* {
                                            getFilteredSongs().map((item, i) => (
                                                <Checkbox value={item.id} ml={3} key={i}>
                                                    <VStack p={1}>
                                                        <Heading size='sm'>{item.name}</Heading>
                                                        <Text>{item.artist}</Text>
                                                    </VStack>
                                                </Checkbox>
                                            ))
                                        } */}
                                    {/* </Checkbox.Group> */}
                                </Box>
                                <Button onPress={attachSongsHandle}>SALVAR</Button>
                            </Box>
                        </Modal.Body>
                    </Modal.Content>
                </Modal>

                <Modal isOpen={modalGroup} onClose={() => setModalGroup(false)}>
                    <Modal.Content bg={styles.bgDark}>
                        <Modal.Header bg={styles.bgDark} _text={{color: styles.fontColor}}>
                            Grupo
                            <Modal.CloseButton/>
                        </Modal.Header>
                        <Modal.Body>
                            <Input label='Nome' placeholder='Ex: Abertura, Bis' value={group.name} onChangeText={v => setGroup({...group, name: v})}/>
                            <Button mt={3} onPress={saveGroupHandle}>SALVAR</Button>
                        </Modal.Body>
                    </Modal.Content>
                </Modal>
            </Box>
            <Fab
                bg={styles.primary}
                icon={<CheckIcon/>}
                onPress={() => navigation.navigate('Repertoires')}
            />
            <Loader loading={loading}/>

        </GradientPageBase>
    )
}