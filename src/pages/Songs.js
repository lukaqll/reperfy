import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Box, CloseIcon, FlatList, HamburgerIcon, Heading, HStack, Input, Menu, SearchIcon, Text, Pressable, VStack } from "native-base";
import React, { useEffect, useState } from "react";
import SongStore from "../services/store/SongStore";
import Icon from 'react-native-vector-icons/FontAwesome5'
import FeaterIcon from 'react-native-vector-icons/Feather'
import FLoatButton from "../components/FLoatButton";
import { Alert, StyleSheet } from "react-native";
import AlphabetList from "react-native-flatlist-alphabet";
export default function () {

    const navigation = useNavigation()
    const [songs, setSongs] = useState([])
    const [songSearch, setSongSearch] = useState('')
    const isFocused = useIsFocused()

    useEffect(() => {
        if (isFocused) {
            getAllSongs()
        }
    }, [isFocused])

    useEffect(() => {
        
    }, [songs])

    async function getAllSongs() {
        const result = await SongStore.getAll()
        setSongs([...result])
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
                    <Menu
                        placement="left"
                        trigger={props => (
                            <Pressable {...props} w={8} h={8} alignItems='center' _pressed={{opacity: .5}}>
                                <FeaterIcon name='more-vertical' size={20}/>
                            </Pressable>
                        )}
                    >
                        <Menu.Item onPress={() => navigation.navigate('AddSong', {id: item.id})}>Editar</Menu.Item>
                        <Menu.Item onPress={() => navigation.navigate('AddSong', {id: item.id})}>Add à um repertório</Menu.Item>
                        <Menu.Item onPress={() => deleteSong(item.id)} _text={{color: '#f00'}}>Deletar</Menu.Item>
                    </Menu>
                </Box>
            </HStack>
        )
    }

    const renderSectionHeader = (section) => {
        return (
            <Box h={30} bg='#ddd' justifyContent='center' px={15} rounded='md'>
              <Text bold color='#666'>{section.title}</Text>
            </Box>
        );
    };

    return (
        <Box p={4} h='100%'>
            <Box mb={3}>
                <Input
                    value={songSearch} onChangeText={setSongSearch}
                    py={.5} bg='#fff' rounded='full'
                    rightElement={!songSearch ? <SearchIcon mr={3}/> : <CloseIcon mr={3} colorScheme='error' onPress={() => setSongSearch(null)}/>}
                    placeholder='Buscar'
                />
            </Box>
            <Box flex={1}>
                <AlphabetList
                    data={songs.filter(i => (
                            !songSearch
                            || i.name?.toLowerCase().includes(songSearch.toLowerCase()) 
                            || i.artist?.toLowerCase().includes(songSearch.toLowerCase()))
                        ).map(s => ({value: s.name, key: s.id, ...s}))
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
                />
            </Box>
            <FLoatButton
                icon={<Icon name='plus' color='#fff' size={25}/>}
                colorScheme='success'
                onPress={() => navigation.navigate('AddSong')}
            />
        </Box>
    )
}