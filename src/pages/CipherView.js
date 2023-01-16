import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native";
import { AddIcon, ArrowBackIcon, Box, Button, ChevronLeftIcon, ChevronRightIcon, CloseIcon, HStack, Menu, MinusIcon, Pressable, StatusBar, VStack } from "native-base";
import React, { useEffect, useRef, useState } from "react";
import SongStore from "../services/store/SongStore";
import useStyle from "../styles";
import Text from '../components/Text'
import Heading from '../components/Heading'
import HTMLCipher from "../components/HTMLCipher";
import cipherToneUpdate from "../utils/cipherToneUpdate";
import FeaterIcon from 'react-native-vector-icons/Feather'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import useLang from "../utils/useLang";
import CustomHeaderBackButtom from '../components/CustomHeaderBackButtom'
import RepertorySongsStore from "../services/store/RepertorySongsStore";
import Loader from "../components/Loader";

export default function () {

    const route = useRoute()
    const navigation = useNavigation()
    const isFocused = useIsFocused()
    const styles = useStyle()
    const songRef = useRef()
    const lang = useLang()

    const [song, setSong] = useState({})
    const [loading, setLoading] = useState(false)
    const [showAbsoluteNext, setShowAbsoluteNext] = useState(true)
    const [hiddenTabs, setHiddenTabs] = useState(false)

    useEffect(() => {
        if (isFocused && route.params) {
            setShowAbsoluteNext(true)
            if (route.params.id) {
                
                findSong(route.params.id)

            } else if (route.params.song){
                setSong({...route.params.song})
            }
        }
    }, [isFocused, route.params.id])

    function change(to = 1) {
        let cipherHTML = song.cipher
        let newCipherHTML = cipherToneUpdate(cipherHTML, to)
        setSong({...song, cipher: newCipherHTML})
    }

    function onPlayHandle() {
        let newSong = {...song}
        newSong.played = !newSong.played
        setSong({...newSong})
        RepertorySongsStore.setPlayed(song.id, song.group_id, newSong.played)
                           .then()
    }

    useEffect(() => {
        songRef.current = {...song}

        if (song && song.name) {

            navigation.setOptions({
                headerLeft: () => (
                    <HStack alignItems='center' space={1} mb={3} mt={1}>
                        <CustomHeaderBackButtom canGoBack={true}/>
                        <VStack>
                            <Heading size='sm' color={styles.fontColor}>{song.name}</Heading>
                            <Text fontSize='xs' color={styles.fontColor}>{song.artist}</Text>
                        </VStack>
                    </HStack>
                ),
                headerRight: () => {
                    return (
                        <HStack alignItems='center'>

                            {
                                route.params.repId ? 
                                <Button.Group isAttached>
                                    <Button isDisabled={!song.prev?.id} variant='ghost' onPress={() => findSong(song.prev?.id, song.prev?.prev_group_id)}>
                                        <ChevronLeftIcon color={styles.primary}/>
                                    </Button>
                                    <Button isDisabled={!song.next?.id} variant='ghost' onPress={() => findSong(song.next?.id, song.next?.next_group_id)}>
                                        <ChevronRightIcon color={styles.primary}/>
                                    </Button>
                                </Button.Group> : null
                            }
                            <Box>
                                <Menu
                                    placement="bottom left"
                                    closeOnSelect={false}
                                    trigger={props => (
                                        <Pressable {...props} _pressed={{opacity: .7}}>
                                            <FeaterIcon name='more-vertical' size={20} color={styles.fontColor}/>
                                        </Pressable>
                                    )}
                                >
                                    <Menu.Item>
                                        <Button.Group isAttached>
                                            <Button  onPress={() => change(-1)} variant='outline' size='sm'>
                                                <HStack alignItems='center' space={2}>
                                                    <MinusIcon size='xs'/>
                                                    <Text color='#000' fontSize='xs'>½ {lang('tone')}</Text>
                                                </HStack>
                                            </Button>
                                            <Button onPress={() => change()} variant='outline' size='sm' >
                                                <HStack alignItems='center' space={2}>
                                                    <AddIcon size='xs'/>
                                                    <Text color='#000' fontSize='xs'>½ {lang('tone')}</Text>
                                                </HStack>
                                            </Button>
                                        </Button.Group>
                                    </Menu.Item>
                                    <Menu.Item onPress={() => setHiddenTabs(!hiddenTabs)}>
                                        {lang(!hiddenTabs?'Hide tabs':'Show tabs')}
                                    </Menu.Item>
                                    {
                                        !showAbsoluteNext ?
                                        <Menu.Item onPress={() => setShowAbsoluteNext(true)}>{lang('Show next song')}</Menu.Item>
                                        : null
                                    }
                                    {
                                        !!route.params.repId && song.id ?
                                        <Menu.Item onPress={onPlayHandle}>{!song.played ? lang('Set as Played') : lang('Set as unplayed')}</Menu.Item>
                                        : null
                                    }
                                </Menu>
                            </Box>
                            
                        </HStack>
                    )
                }
            })
        }
    }, [song, showAbsoluteNext, hiddenTabs])

    async function findSong(id, groupId = route.params?.group?.id) {
        setLoading(true)
        let result = {}
        if (route.params.repId) {
            result = await SongStore.findWithNextAndPrevious(id, route.params.repId, groupId)
        } else {
            result = await SongStore.find(id)
        }
        setSong(result)
        setLoading(false)
    }

    const willShowAbsoluteNext = showAbsoluteNext && song.next_absolute && song.next_absolute.name

    return (
        <Box pt={50}>
            <StatusBar hidden/>
            {
                song && !loading?
                <Box h='100%' w='100%' px={2} pb={willShowAbsoluteNext ? 39.9 : null}>
                    <HTMLCipher song={song} options={{hiddenTabs}}/>
                </Box>
                : null
            }
            {
                willShowAbsoluteNext && !loading ?
                <Box position='absolute' bottom={0} bg={styles.bgDark} w='100%'  p={2}>
                    <HStack justifyContent='space-between' alignItems='center'>
                        <HStack alignItems='center' space={5}>
                            <Text>{lang('Next')}:   {song.next_absolute.name} ({song.next_absolute.artist})</Text>
                            {
                                !!song.next_absolute.cipher ? 
                                <Icon color={styles.fontColor} size={20} name='playlist-music-outline'/> : null
                            }
                        </HStack>
                        <Pressable mr={3} _pressed={{opacity: .7}} onPress={() => setShowAbsoluteNext(false)}>
                            <CloseIcon/>
                        </Pressable>
                    </HStack>
                </Box> : null
            }
            <Loader loading={loading}/>
        </Box>
    )
}