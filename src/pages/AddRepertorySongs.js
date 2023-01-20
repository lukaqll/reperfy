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
import GhostButton from '../components/GhostButton'
import GradientPageBase from "../components/GradientPageBase";
import InputSearch from "../components/InputSearch";
import RepertoryGroupsStore from "../services/store/RepertoryGroupsStore";
import FeaterIcon from 'react-native-vector-icons/Feather'
import useLang from "../utils/useLang";


export default function ({route}) {

    const [rep, setRep] = useState({})
    const [songs, setSongs] = useState([])
    const [songSearch, setSongSearch] = useState()
    const [selectedSongIds, setSelectedSongIds] = useState([])
    const [loading, setLoading] = useState(false)
    const [modalGroup, setModalGroup] = useState(false)
    const [formSize, setFormSize] = useState({})
    const [group, setGroup] = useState({})
    const [addGroupSongsId, setAddGroupSongsId] = useState()
    const [groupsToOrder, setGroupsToOrder] = useState([])
    const [scrollEnabled, setScrollEnabled] = useState(true)

    const isFocused = useIsFocused()
    const navigation = useNavigation()
    const styles = useStyle()
    const lang = useLang()

    const {height} = useWindowDimensions()

    useEffect(() => {
        if (route.params && (id = route.params.id)) {
            find(id)

            if (rep.id) {
                if (route.params && (groupId = route.params.groupId)) {
                    setAddGroupSongsId(groupId)
                    delete route.params.groupId
                }
            }
        }
        getAllSongs()
    }, [isFocused])

    useEffect(() => {

        if (rep && rep.id) {
            navigation.setOptions({
                title: rep.name,
                headerRight: () => <GhostButton onPress={() => navigation.navigate('Repertoires')} _text={{color: styles.primary}} size='lg'>OK</GhostButton>
            })

            if (route.params && (groupId = route.params.groupId)) {
                setAddGroupSongsId(groupId)
                delete route.params.groupId
            }
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
            <Box my={1} p={1} rounded='xl' bg={isActive ? styles.bgDark : null}>
                <HStack justifyContent='space-between' alignItems='center'>
                    <VStack pl={4}>
                        <Heading fontSize='sm'>{item.name}</Heading>
                        <Text>{item.artist}</Text>
                    </VStack>
                    <HStack alignItems='center' space={5}>
                        {
                            !!item.cipher ? 
                            <Pressable onPress={() => navigation.navigate('CipherView', {id: item.id})} _pressed={{opacity: .7}}>
                                <Icon color={styles.fontColor} size={20} name='playlist-music-outline'/> 
                            </Pressable>
                            : null
                        }

                        <Pressable
                            p={2} mr={2} _pressed={{opacity: .7}}
                            onLongPress={drag}
                        >
                            <HamburgerIcon/>
                        </Pressable>
                    </HStack>
                </HStack>
            </Box>
        );
    };    

    /**
     * saveGroupHandle
     */
    async function saveGroupHandle() {

        if (!group.name) {
            Toast.show({title: lang('Enter a name for the group')})
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

        let songsIds = addGroupSongsId
        setAddGroupSongsId(false)
        setSelectedSongIds([])
        setLoading(true)
        await RepertoryGroupsStore.detachAllSongs(songsIds)
        if (!!selectedSongIds.length) {
            await RepertoryGroupsStore.attachSongs(songsIds, selectedSongIds)
        }
        await find(rep.id)
    }

    /**
     * on drop handle
     */
    async function dropHandle(groupId, data) {
        setLoading(true)
        let songsId = data.map(s => s.id)

        //remove duplicated
        songsId = songsId.filter((item, index) => songsId.indexOf(item) === index);

        await RepertoryGroupsStore.detachAllSongs(groupId)
        await RepertoryGroupsStore.attachSongs(groupId, songsId)
        await find(rep.id)
        setScrollEnabled(true)
    }

    /**
     * on delete group
     */
    function deleteGroupHandle(id) {
        Alert.alert(
            lang('Delete this group?'), 
            lang('The songs from this group will also be unlinked from the repertoire'),
            [
                {text: lang('No')},
                {
                    text: lang('Yes'), 
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
            || i.name?.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, "").includes(songSearch.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, ""))
            || i.artist?.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, "").includes(songSearch.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, ""))))

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
                    <HStack alignItems='center' justifyContent='space-between'>
                        <HStack alignItems='center'>
                            <Icon size={25} color={styles.primary} name={isSelected ? 'checkbox-marked-outline' : 'checkbox-blank-outline'}/>
                            <VStack p={1} ml={3}>
                                <Heading size='xs'>{item.name}</Heading>
                                <Text fontSize='xs'>{item.artist}</Text>
                            </VStack>
                        </HStack>
                        {
                            !!item.cipher ? <Icon color={styles.fontColor} size={20} name='playlist-music-outline'/> : null
                        }
                    </HStack>
                </Pressable>
            </Box>
        )
    }

    /**
     * order group mode
     */
    function orderGroupModeHandle() {
        let orderGroups = [...rep.groups]
        setGroupsToOrder(orderGroups)
    }

    /**
     * on drop group handle
     */
    async function saveGrupOrderHandle() {
        
        if (!groupsToOrder.length)
            return

        setLoading(true)

        for (idx in groupsToOrder) {
            
            let gp = groupsToOrder[idx]

            if (!gp)
                continue

            await RepertoryGroupsStore.updateIdx(gp.id, idx)
        }

        setGroupsToOrder([])
        await find(rep.id)
    }
    
    /**
     * render item
     */
    function renderDraggableGroup({ item, drag, isActive }) {
        return (
            <Box my={1} p={1} rounded='xl' bg={isActive ? styles.bgDark : null}>
                <HStack justifyContent='space-between' alignItems='center'>
                    <Heading fontSize='sm'>{item.name}</Heading>
                    <Pressable
                        p={2} mr={2} _pressed={{opacity: .7}}
                        onLongPress={drag}
                    >
                        <HamburgerIcon/>
                    </Pressable>
                </HStack>
            </Box>
        );
    };  

    return (
        <GradientPageBase >
            <Box h='100%' >
                <Box onLayout={(event) => {setFormSize(event.nativeEvent.layout)}}>
                    <VStack space={1} px={4}>
                        <Text fontSize='xs' alignSelf='center'>Add groups to repertoire to link songs</Text>
                        <Button mt={2} bg={styles.primary} onPress={() => setModalGroup(true)}>ADD GROUP</Button>
                        {
                            rep.groups && rep.groups.length > 1 ?
                            <GhostButton onPress={orderGroupModeHandle}>Change groups order</GhostButton>
                            : null
                        }
                    </VStack>
                </Box>
                <Box >
                    <ScrollView style={{height: (height - (formSize.height || 0) - 70)}} scrollEnabled={scrollEnabled}>
                    {
                        rep.groups ? rep.groups.map((g, i) => (
                            <Box p={2} key={i} >
                                <Box bg={styles.bgDark} rounded='lg' p={2}>
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
                                            <Menu.Item onPress={() => setAddGroupSongsId(g.id)}>
                                                <FeaterIcon name='plus' size={15}/>
                                                {lang('Link songs')}
                                            </Menu.Item>
                                            <Menu.Item onPress={() => {
                                                    setGroup({...g})
                                                    setModalGroup(true)
                                                }}
                                            >
                                                <FeaterIcon name='edit' size={15}/>
                                                {lang('Edit')}
                                            </Menu.Item>
                                            <Menu.Item _text={{color: styles.danger}} onPress={() => deleteGroupHandle(g.id)}>
                                                <FeaterIcon name='trash' size={15} color={styles.danger}/>
                                                {lang('Delete')}
                                            </Menu.Item>

                                        </Menu>
                                    </HStack>
                                </Box>
                                <GestureHandlerRootView >
                                    <DraggableFlatList
                                        data={g.songs}
                                        onDragEnd={({ data }) => dropHandle(g.id, data)}
                                        onDragBegin={() => setScrollEnabled(false)}
                                        keyExtractor={(_, i) => i+1}
                                        renderItem={renderDraggableItem}
                                    /> 
                                </GestureHandlerRootView>
                            </Box>
                        )) : null
                    }
                    </ScrollView>
                </Box>

                {/**
                 * add songs to group
                 */}
                <Modal isOpen={!!addGroupSongsId} onClose={() => setAddGroupSongsId(null)} size='full'>
                    <Modal.Content bg={styles.bg}>
                        <Modal.Header bg={styles.bg} _text={{color: styles.fontColor}}>
                        
                            <Modal.CloseButton/>
                            <Box>
                                <VStack>
                                    <Heading fontSize="md">{lang('Link songs')}</Heading>
                                    <Box mt={2}>
                                        <InputSearch
                                            value={songSearch} onChangeText={setSongSearch}
                                            onClean={() => setSongSearch(null)}
                                        />
                                        <Text>{lang('Selected')}: ({selectedSongIds.length})</Text>
                                    </Box>
                                </VStack>
                            </Box>
                        </Modal.Header>
                        <Modal.Body>

                            <Box flex={1}>
                                
                                <Box >
                                    <FlatList
                                        w='100%'
                                        keyboardShouldPersistTaps='handled'
                                        keyExtractor={(_,i) => i}
                                        data={getFilteredSongs()}
                                        renderItem={renderSelectableSong}
                                        ListFooterComponent={
                                            <GhostButton 
                                                mt={5}
                                                variant='outline'
                                                onPress={() => {
                                                    setAddGroupSongsId(null)
                                                    navigation.navigate('AddSong', {
                                                        redirect: {
                                                            to: 'AddRepertorySongs',
                                                            params: {
                                                                groupId: addGroupSongsId,
                                                                id: rep.id,
                                                            }
                                                        }
                                                    })
                                                }}
                                            >Add a new song</GhostButton>
                                        }
                                    />
                                </Box>
                            </Box>
                        </Modal.Body>
                        <Modal.Footer bg={styles.bg} >
                            <Box flex={1}>
                                <Button onPress={attachSongsHandle}>SAVE</Button>
                            </Box>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>

                <Modal 
                    isOpen={modalGroup} 
                    onClose={() => {
                        setModalGroup(false)
                        setGroup({})
                    }}
                >
                    <Modal.Content bg={styles.bg}>
                        <Modal.Header bg={styles.bg} _text={{color: styles.fontColor}}>
                            {lang('Group')}
                            <Modal.CloseButton/>
                        </Modal.Header>
                        <Modal.Body>
                            <Input 
                                label='Nome' 
                                placeholder='Ex: Opening , Bis' 
                                value={group.name} onChangeText={v => setGroup({...group, name: v})}
                                onSubmitEditing={saveGroupHandle}
                            />
                            <Button mt={3} onPress={saveGroupHandle}>SAVE</Button>
                        </Modal.Body>
                    </Modal.Content>
                </Modal>

                <Modal isOpen={!!groupsToOrder.length} onClose={() => setGroupsToOrder([])}>
                    <Modal.Content bg={styles.bg}>
                        <Modal.Header bg={styles.bg} _text={{color: styles.fontColor}}>
                            {lang('Groups')}
                            <Modal.CloseButton/>
                        </Modal.Header>
                        <Modal.Body _scrollview={{ scrollEnabled: scrollEnabled }}>
                            <GestureHandlerRootView>
                                <DraggableFlatList
                                    data={groupsToOrder}
                                    onDragEnd={({ data }) => {
                                        setGroupsToOrder([...data])
                                        setScrollEnabled(true)
                                    }}
                                    keyExtractor={(_, i) => i+1}
                                    renderItem={renderDraggableGroup}
                                    onDragBegin={() => setScrollEnabled(false)}
                                /> 
                            </GestureHandlerRootView>
                        </Modal.Body>
                        <Modal.Footer bg={styles.bg} >
                            <Box flex={1}>
                                <Button onPress={saveGrupOrderHandle}>SAVE</Button>
                            </Box>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>
            </Box>
            <Loader loading={loading}/>

        </GradientPageBase>
    )
}