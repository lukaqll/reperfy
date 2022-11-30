import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Box, Button, FlatList, HamburgerIcon, Heading, HStack, Menu, Text, VStack } from "native-base";
import React, { useEffect, useState } from "react";
import RepertoryStore from "../services/store/RepertoryStore";
import Icon from 'react-native-vector-icons/FontAwesome5'
import FLoatButton from "../components/FLoatButton";
import { Alert, Pressable } from "react-native";
import FeaterIcon from 'react-native-vector-icons/Feather'

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

    return (
        <Box p={4} h='100%'>
            <FlatList
                data={songs}
                renderItem={({item}) => (
                    <HStack justifyContent='space-between' alignItems='center' py={2}>
                        <VStack>
                            <Heading size='sm'>{item.name}</Heading>
                            <Text>{item.artist}</Text>
                        </VStack>
                        <Box>
                            <Menu
                                placement="left"
                                trigger={props => (
                                    <Pressable {...props}>
                                        <FeaterIcon name='more-vertical' size={20}/>
                                    </Pressable>
                                )}
                            >
                                <Menu.Item onPress={() => navigation.navigate('AddRepertory', {id: item.id})}>Editar</Menu.Item>
                                <Menu.Item onPress={() => deleteReportory(item.id)} _text={{color: '#f00'}}>Deletar</Menu.Item>
                            </Menu>
                        </Box>
                    </HStack>
                )}
            />
            <FLoatButton
                icon={<Icon name='plus' color='#fff' size={25}/>}
                colorScheme='success'
                onPress={() => navigation.navigate('AddRepertory')}
            />
        </Box>
    )
}