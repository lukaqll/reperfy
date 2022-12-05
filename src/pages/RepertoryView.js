import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native";
import { Box, Button, Checkbox, CheckIcon, Divider, FlatList, HStack, IconButton, Menu, Pressable, VStack } from "native-base";
import React, { useEffect, useRef, useState } from "react";
import Loader from "../components/Loader";
import RepertoryStore from "../services/store/RepertoryStore";
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import FeaterIcon from 'react-native-vector-icons/Feather'
import styles from "../styles";
import RepertorySongsStore from "../services/store/RepertorySongsStore";
import { Alert } from "react-native";
import Text from '../components/Text'
import Heading from '../components/Heading'
import InputSearch from '../components/InputSearch'


export default function() {

    const route = useRoute()
    const isFocused = useIsFocused()
    const navigation = useNavigation()
    const songsRef = useRef()

    const [songs, setSongs] = useState([])
    const [loading, setLoading] = useState(false)
    const [search, setSearch] = useState('')
    const [onlyNotPlayed, setOnlyNotPlayed] = useState(false)

    useEffect(() => {
        if (isFocused && route.params.id) {
            getSongs(route.params.id)

            navigation.setOptions({
                title: route.params.name || 'Repertório',
                headerRight: renderHeaderRight
            })
        }
    }, [isFocused, route.params])

    useEffect(() => {
        songsRef.current = [...songs]
    }, [songs])

    useEffect(() => {
        navigation.setOptions({
            title: route.params.name || 'Repertório',
            headerRight: renderHeaderRight
        })
    }, [onlyNotPlayed])

    function getListedSongs() {
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
                    <Button {...props} alignItems='center' variant='ghost' size='xs'>
                        <FeaterIcon name='more-vertical' size={20} color='#fff'/>
                    </Button>
                )}
            >
                <Menu.Item onPress={clearAllHandle} p={1}>
                    <HStack space={2}>
                        <MaterialIcon name='broom' color='#000' size={20}/>
                        <Text color='#000'>Desmarcar já tocadas</Text>
                    </HStack>
                </Menu.Item>
                <Menu.Item p={1} mt={3} onPress={() => setOnlyNotPlayed(!onlyNotPlayed)}>
                    <HStack space={2}>
                        <MaterialIcon name={onlyNotPlayed ? 'checkbox-outline' : 'checkbox-blank-outline'} color='#000' size={20}/>
                        <Text color='#000'>Apenas não tocadas</Text>
                    </HStack>
                </Menu.Item>
            </Menu>
        )
    }
    async function getSongs(id) {
        setLoading(true)
        let songs = await RepertoryStore.getSongs(id)
        setSongs([...songs])
        setLoading(false)
    }

    function onPlayHandle(item) {
        let newSongs = [...songs]
        let newItem = newSongs.find(s => s.id == item.id)
        newItem.played = !newItem.played
        setSongs([...newSongs])
        RepertorySongsStore.setPlayed(item.id, route.params.id, newItem.played)
                           .then()
    }

    function clearAllHandle() {

        Alert.alert('Desmarcar as músicas já tocadas?', '', [
            {text: 'Não'},
            {text: 'Sim', onPress: () => {

                RepertorySongsStore.unsetAllPlayed(route.params.id)
                                   .then()

                let newSongs = [...songsRef.current]

                for (i in newSongs){
                    newSongs[i].played = 0
                }
                setSongs([...newSongs])
            }},
        ])
    }

    function renderSong({item}) {
        return (
            <Pressable 
                _pressed={{opacity: .7}} 
                mx={3} my={1} rounded={8} p={2}
                shadow={4}
                bg={styles.bgDark}
                onLongPress={() => onPlayHandle(item)}
                borderLeftColor={item.played ? styles.bgDark : styles.primaryDark}
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
                        <MaterialIcon onPress={() => navigation.navigate('CipherView', {id: item.id, repId: route.params.id})} size={20} name='playlist-music-outline' color={styles.fontColor}/> 
                        : null
                    }
                </HStack>
            </Pressable>
        )
    }

    return (
        <Box py={3}>
            <Box p={3}>
                <InputSearch onChangeText={setSearch} value={search} onClean={() => setSearch('')}/>
            </Box>
            <Box>
                {
                    !loading ?
                    <FlatList
                        renderItem={renderSong}
                        keyExtractor={(_,i) => i}
                        data={getListedSongs()}
                    />
                    : <Loader loading={true}/>
                }
            </Box>
        </Box>
    )
}