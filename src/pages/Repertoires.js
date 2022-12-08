import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Box, Button, Fab, FlatList, HamburgerIcon, Heading, HStack, Menu, Text, VStack, Pressable } from "native-base";
import React, { useEffect, useState } from "react";
import RepertoryStore from "../services/store/RepertoryStore";
import Icon from 'react-native-vector-icons/FontAwesome5'
import MaterialIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { Alert, StyleSheet } from "react-native";
import FeaterIcon from 'react-native-vector-icons/Feather'
import useStyle from "../styles";
import LinearGradient from "react-native-linear-gradient";
import GradientPageBase from "../components/GradientPageBase";

export default function () {

    const styles = useStyle()
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


    function renderItem ({item}) {
        return (
            <Pressable 
                onPress={async () => await onPressHandle(item)}
                _pressed={{opacity: .7}} my={2}
            >
                <LinearGradient 
                    colors={[styles.primary+'dd', styles.primaryDark+'dd']} 
                    style={{width: '100%', height: '100%', flex: 1, borderRadius: 30, padding: 10}}
                >
                    <HStack justifyContent='space-between' alignItems='center' py={2}>
                        <VStack>
                            <Heading size='sm' color={styles.bgDark}>{item.name}</Heading>
                        </VStack>
                        <Box>
                            <Menu
                                placement="left"
                                trigger={props => (
                                    <Pressable {...props}>
                                        <FeaterIcon name='more-vertical' size={20} color={styles.bgDark}/>
                                    </Pressable>
                                )}
                            >
                                <Menu.Item onPress={() => navigation.navigate('AddRepertory', {id: item.id})}>Editar</Menu.Item>
                                <Menu.Item onPress={() => deleteReportory(item.id)} _text={{color: '#f00'}}>Deletar</Menu.Item>
                            </Menu>
                        </Box>
                    </HStack>
                </LinearGradient>
            </Pressable>
        )
    }

    return (
        <GradientPageBase>

            <Box p={4} h='100%'>
                <FlatList
                    data={songs}
                    renderItem={renderItem}
                />

                <Fab
                    bottom={90} p={5}
                    icon={<MaterialIcons name='music-note-plus' color='#fff' size={15}/>}
                    bg={styles.primary} onPress={() => navigation.navigate('AddSong')}
                    renderInPortal={false} shadow={2} size="sm"
                />
                <Fab
                    icon={<Icon name='plus' color='#fff' size={15}/>} p={5}
                    bg={styles.primary} onPress={() => navigation.navigate('AddRepertory')}
                    renderInPortal={false} shadow={2} size="sm"
                />
            </Box>
        </GradientPageBase>
    )
}