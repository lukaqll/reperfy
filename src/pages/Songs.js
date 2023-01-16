import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Box, CloseIcon, FlatList, HamburgerIcon, HStack, Input, Menu, SearchIcon, Pressable, VStack, Button, Fab, IconButton } from "native-base";
import React, { useCallback, useEffect, useRef, useState } from "react";
import SongStore from "../services/store/SongStore";
import Icon from 'react-native-vector-icons/FontAwesome5'
import FeaterIcon from 'react-native-vector-icons/Feather'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'
import FLoatButton from "../components/FLoatButton";
import { Alert, StyleSheet } from "react-native";
import AlphabetList from "react-native-flatlist-alphabet";
import useCifrasRepo from "../services/repos/cifras";
import useStyle from "../styles";
import Text from '../components/Text'
import Heading from '../components/Heading'
import InputSearch from "../components/InputSearch";
import GradientPageBase from "../components/GradientPageBase";
import useLang from "../utils/useLang";
import EmptySongs from "../components/Empty/EmptySongs";

export default function () {

    const navigation = useNavigation()
    const isFocused = useIsFocused()
    const styles = useStyle()
    const lang = useLang()

    const [songs, setSongs] = useState([])
    const [songSearch, setSongSearch] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (isFocused) {
            getAllSongs()
        }
    }, [isFocused])

    async function getAllSongs() {
        setLoading(true)
        const result = await SongStore.getAll()
        setSongs([...result])
        setLoading(false)
    }

    async function deleteSong(id) {
        Alert.alert(lang('Delete this song?'), lang('This action cannot be undone'), [
            {text: lang('No')},
            {text: lang('Yes'), onPress: async () => {
                await SongStore.delete(id)
                await getAllSongs()
            }},
        ], )
    }

    function renderSongItem(item) {
        return (
            <HStack justifyContent='space-between' alignItems='center' py={2}>
                <VStack>
                    <Heading size='sm'>{item.value}</Heading>
                    <Text>{item.artist}</Text>
                </VStack>
                <Box >
                    <HStack alignItems='center'>

                        {
                            !!item.cipher ? 
                            <Pressable onPress={() => navigation.navigate('CipherView', {id: item.id})} _pressed={{opacity: .7}}>
                                <MaterialIcon color={styles.fontColor}  size={25} name='playlist-music-outline'/> 
                            </Pressable>
                            : null
                        }
                        <Menu
                            placement="left"
                            trigger={props => (
                                <Pressable {...props} _pressed={{opacity: .7}} px={2}>
                                    <FeaterIcon name='more-vertical' size={20} color={styles.fontColor}/>
                                </Pressable>
                            )}
                        >
                            <Menu.Item onPress={() => navigation.navigate('AddSong', {id: item.id})}>{lang('Edit')}</Menu.Item>
                            <Menu.Item onPress={() => deleteSong(item.id)} _text={{color: '#f00'}}>{lang('Delete')}</Menu.Item>
                        </Menu>
                    </HStack>
                </Box>
            </HStack>
        )
    }

    const renderSectionHeader = (section) => {
        return (
            <Box h={30} bg={styles.bgDark} justifyContent='center' px={15} rounded='md'>
              <Text bold>{section.title}</Text>
            </Box>
        );
    };

    return (
        <GradientPageBase >
            <Box p={3} h='100%' pb={0}>
                <Box mb={3}>
                    <InputSearch
                        value={songSearch} onChangeText={setSongSearch}
                        onClean={() => setSongSearch(null)}
                    />
                </Box>
                <Box flex={1}  h='100%'>
                    <Box>
                        {
                            !!songs.length && !loading ?
                            <AlphabetList
                                data={songs.filter(i => (
                                        !songSearch
                                        || i.name?.toLowerCase().includes(songSearch.toLowerCase()) 
                                        || i.artist?.toLowerCase().includes(songSearch.toLowerCase()))
                                    ).map(s => ({...s, value: s.name || '', key: s.id}))
                                }
                                renderItem={renderSongItem}
                                renderSectionHeader={renderSectionHeader}
                                indexLetterSize={15}
                                indexLetterColor='#ff3030'
                                letterItemStyle={{height: 25}}
                                letterIndexWidth={0}
                                alphabetContainer={{
                                    alignSelf: "flex-start",
                                }}
                            /> : null
                        }
                        {
                            !songs.length && !loading ?
                            <Box h='100%' justifyContent='center'>
                                <EmptySongs/>
                            </Box>
                            : null
                        }
                    </Box>
                </Box>   
            </Box>
        </GradientPageBase>
    )
}