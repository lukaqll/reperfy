import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Box, CloseIcon, FlatList, HamburgerIcon, HStack, Input, Menu, SearchIcon, Pressable, VStack, Button, Fab } from "native-base";
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

export default function () {

    const navigation = useNavigation()
    const isFocused = useIsFocused()
    const styles = useStyle()

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
        Alert.alert('Deseja deletar esta música?', 'Esta ação não poderá ser desfeita', [
            {text: 'não'},
            {text: 'sim', onPress: async () => {
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
                            <MaterialIcon color={styles.fontColor} onPress={() => navigation.navigate('CipherView', {id: item.id})} size={25} name='playlist-music-outline'/> 
                            : null
                        }
                        <Menu
                            placement="left"
                            trigger={props => (
                                <Button {...props} alignItems='center' variant='ghost' size='xs'>
                                    <FeaterIcon name='more-vertical' size={20} color={styles.fontColor}/>
                                </Button>
                            )}
                        >
                            <Menu.Item onPress={() => navigation.navigate('AddSong', {id: item.id})}>Editar</Menu.Item>
                            <Menu.Item onPress={() => deleteSong(item.id)} _text={{color: '#f00'}}>Deletar</Menu.Item>
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
        <GradientPageBase>
            <Box p={4} h='100%'>
                <Box mb={3}>
                    <InputSearch
                        value={songSearch} onChangeText={setSongSearch}
                        onClean={() => setSongSearch(null)}
                    />
                </Box>
                <Box flex={1}>
                    {
                        !loading ?
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
                </Box>
                <Fab
                    icon={<Icon name='plus' color='#fff' size={15}/>}
                    bg={styles.success} onPress={() => navigation.navigate('AddSong')}
                    renderInPortal={false} shadow={2} size="sm"
                />
                
            </Box>
        </GradientPageBase>
    )
}