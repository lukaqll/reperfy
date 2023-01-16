import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native";
import { Box, Button, Checkbox, CheckIcon, ChevronDownIcon, ChevronUpIcon, Divider, FlatList, HStack, IconButton, Menu, Pressable, ScrollView, VStack } from "native-base";
import React, { useEffect, useRef, useState } from "react";
import Loader from "../components/Loader";
import RepertoryStore from "../services/store/RepertoryStore";
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import FeaterIcon from 'react-native-vector-icons/Feather'
import useStyle from "../styles";
import RepertorySongsStore from "../services/store/RepertorySongsStore";
import { Alert } from "react-native";
import Text from '../components/Text'
import Heading from '../components/Heading'
import InputSearch from '../components/InputSearch'
import GradientPageBase from "../components/GradientPageBase";
import RepertoryGroupsStore from "../services/store/RepertoryGroupsStore";
import useLang from "../utils/useLang";


export default function() {

    const route = useRoute()
    const isFocused = useIsFocused()
    const navigation = useNavigation()
    const songsRef = useRef()
    const styles = useStyle()
    const lang = useLang()

    const [songs, setSongs] = useState([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [onlyNotPlayed, setOnlyNotPlayed] = useState(false)
    const [closedGroups, setClosedGroups] = useState([])

    useEffect(() => {
        if (isFocused && route.params.id) {
            getSongs(route.params.id)

            navigation.setOptions({
                title: route.params.name || 'Repoertoire',
                headerRight: renderHeaderRight
            })
        }
    }, [isFocused, route.params])

    useEffect(() => {
        songsRef.current = [...songs]
    }, [songs])

    useEffect(() => {
        navigation.setOptions({
            title: route.params.name || 'Repoertoire',
            headerRight: renderHeaderRight
        })
    }, [onlyNotPlayed])

    function getListedSongs(songs) {
        let out = [...songs]
        if (onlyNotPlayed) {
            out = out.filter(s => !s.played)
        }

        return out.filter(s => (
            !search
            || s.name?.toLowerCase().includes(search.toLowerCase()) 
            || s.artist?.toLowerCase().includes(search.toLowerCase()))
        )
    }

    function renderHeaderRight() {
        return (
            <Menu
                placement="bottom left"
                closeOnSelect={false}
                trigger={props => (
                    <IconButton 
                        icon={<FeaterIcon name='more-vertical' size={20} color={styles.fontColor}/>}
                        {...props} 
                        alignItems='center'
                        variant='ghost'
                        rounded='full'
                        _pressed={{backgroundColor: styles.primary+'11'}}
                    />
                )}
            >
                <Menu.Item onPress={clearAllHandle} p={1} >
                    <HStack space={2}>
                        <MaterialIcon name='broom' color='#000' size={20}/>
                        <Text color='#000'>Uncheck already played</Text>
                    </HStack>
                </Menu.Item>
                <Menu.Item p={1} mt={3} onPress={() => setOnlyNotPlayed(!onlyNotPlayed)}>
                    <HStack space={2}>
                        <MaterialIcon name={onlyNotPlayed ? 'checkbox-outline' : 'checkbox-blank-outline'} color='#000' size={20}/>
                        <Text color='#000'>Just unplayed</Text>
                    </HStack>
                </Menu.Item>
                <Menu.Item onPress={() => navigation.navigate('AddRepertory', {id: route.params.id})} p={1} mt={3}>
                    <HStack space={2}>
                        <MaterialIcon name='square-edit-outline' color='#000' size={20}/>
                        <Text color='#000'>Edit</Text>
                    </HStack>
                </Menu.Item>                
            </Menu>
        )
    }

    async function getSongs(id) {
        setLoading(true)
        let songs = await RepertoryGroupsStore.getWithSongs(id)
        setSongs([...songs])
        setLoading(false)
    }

    function onPlayHandle(item) {
        let groups = [...songs]
        let group = groups.find(g => g.id == item.group_id)
        let song = group.songs.find(s => s.id == item.id)

        song.played = !song.played
        setSongs([...groups])
        RepertorySongsStore.setPlayed(song.id, group.id, song.played)
                           .then()
    }

    function clearAllHandle() {

        Alert.alert(lang('Uncheck previously played songs?'), '', [
            {text: lang('No')},
            {text: lang('Yes'), onPress: () => {
                RepertorySongsStore.unsetAllPlayed(route.params.id)
                                   .then()
                let groups = [...songsRef.current]
                for (i in groups){
                    for (j in groups[i].songs)
                        groups[i].songs[j].played = 0
                }
                setSongs([...groups])
            }},
        ])
    }

    function renderSong(item, group, i) {
        group = {
            id: group.id,
            name: group.name,
        }
        
        return (
            <Pressable 
                _pressed={{opacity: .7}} 
                mx={3} my={1} rounded={8} p={2}
                shadow={4} key={i}
                bg={styles.bg}
                onLongPress={() => onPlayHandle(item)}
                borderLeftColor={item.played ? styles.bg : styles.primaryDark}
                borderLeftWidth={3}
            >
                <HStack justifyContent='space-between' alignItems='center'>
                    <VStack>
                        <Heading 
                            size='sm'
                            style={{textDecorationLine: item.played ? 'line-through' : null}}
                            color={item.played ? '#666' : styles.fontColor}
                        >{item.name}</Heading>
                        <Text fontSize='xs' color={item.played ? '#666' : styles.fontColor}>{item.artist}</Text>
                    </VStack>
                    {
                        !!item.cipher ? 
                        <MaterialIcon onPress={() => navigation.navigate('CipherView', {id: item.id, repId: route.params.id, group})} size={20} name='playlist-music-outline' color={styles.fontColor}/> 
                        : null
                    }
                </HStack>
            </Pressable>
        )
    }

    function groupToggleHande(item) {
        let closed = closedGroups
        let idx = closed.findIndex(i => i == item.id)

        if (idx >= 0) {
            delete closed[idx]
        } else {
            closed = [...closed, item.id]
        }

        setClosedGroups([...closed])
    }

    function renderGroup(item) {
        const isGroupClosed = closedGroups.includes(item.id)
        return (
            <Box w='100%' key={item.id}>
                <Pressable 
                    p={2} rounded={5} mx={2}
                    bg={styles.bgDark}
                    onPress={() => groupToggleHande(item)}
                >
                    <HStack justifyContent='space-between' alignItems='center'>
                        <Heading size='sm'>{item.name}</Heading>
                        <Pressable>
                            {isGroupClosed ? 
                            <ChevronDownIcon color={styles.fontColor}/> 
                            : <ChevronUpIcon color={styles.fontColor}/>}
                        </Pressable>
                    </HStack>
                </Pressable>
                {
                    !isGroupClosed ?
                    <Box py={2}>
                        {getListedSongs(item.songs).map((songItem, i) => renderSong(songItem, item, i))}
                    </Box> : null
                }
            </Box>
        )
    }

    return (
        <GradientPageBase>
            <Box py={3}>
                <ScrollView>
                    <Box p={3}>
                        <InputSearch onChangeText={setSearch} value={search} onClean={() => setSearch('')}/>
                    </Box>
                    <VStack space={.5}>
                        {
                            !loading ?
                            songs.map(renderGroup)
                            : <Loader loading={true}/>
                        }
                    </VStack>
                </ScrollView>
            </Box>
        </GradientPageBase>
    )
}