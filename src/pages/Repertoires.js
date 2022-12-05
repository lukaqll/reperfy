import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Box, Button, Fab, FlatList, HamburgerIcon, Heading, HStack, Menu, Text, VStack } from "native-base";
import React, { useEffect, useState } from "react";
import RepertoryStore from "../services/store/RepertoryStore";
import Icon from 'react-native-vector-icons/FontAwesome5'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Alert, Pressable } from "react-native";
import FeaterIcon from 'react-native-vector-icons/Feather'
import styles from "../styles";

export default function () {

    const navigation = useNavigation()
    const [songs, setRepertoires] = useState([])
    const isFocused = useIsFocused()

    useEffect(() => {
        if (isFocused) {
            getAllRepertoires()
        }
    }, [isFocused])

    useEffect(() => {
        
    }, [songs])

    async function getAllRepertoires() {
        const result = await RepertoryStore.getAll()
        setRepertoires([...result])
    }

    async function deleteReportory(id) {
        Alert.alert('Deseja deletar este repertório?', 'Esta ação não poderá ser desfeita', [
            {text: 'não'},
            {text: 'sim', onPress: async () => {
                await RepertoryStore.delete(id)
                await getAllRepertoires()
            }},
        ], )
    }

    async function onPressHandle(item) {
        navigation.navigate('RepertoryView', {...item})
    }

    return (
        <Box p={4} h='100%'>
                    <Button onPress={() => navigation.navigate('Songs')}>Músicas</Button>

            <FlatList
                data={songs}
                renderItem={({item}) => (
                    <Pressable 
                        onPress={async () => await onPressHandle(item)}
                    >
                        <Box rounded='full' borderWidth={1} borderColor={styles.primary} mt={3} p={2}>
                            <HStack justifyContent='space-between' alignItems='center' py={2}>
                                <VStack>
                                    <Heading size='sm' color={styles.primary}>{item.name}</Heading>
                                </VStack>
                                <Box>
                                    <Menu
                                        placement="left"
                                        trigger={props => (
                                            <Pressable {...props}>
                                                <FeaterIcon name='more-vertical' size={20} color={styles.primary}/>
                                            </Pressable>
                                        )}
                                    >
                                        <Menu.Item onPress={() => navigation.navigate('AddRepertory', {id: item.id})}>Editar</Menu.Item>
                                        <Menu.Item onPress={() => deleteReportory(item.id)} _text={{color: '#f00'}}>Deletar</Menu.Item>
                                    </Menu>
                                </Box>
                            </HStack>
                        </Box>
                    </Pressable>
                )}
            />

            <Fab
                bottom={70}
                icon={<MaterialIcons name='music-note-plus' color='#fff' size={15}/>}
                bg={styles.success} onPress={() => navigation.navigate('AddSong')}
                renderInPortal={false} shadow={2} size="sm"
            />
            <Fab
                icon={<Icon name='plus' color='#fff' size={15}/>}
                bg={styles.success} onPress={() => navigation.navigate('AddRepertory')}
                renderInPortal={false} shadow={2} size="sm"
            />
        </Box>
    )
}