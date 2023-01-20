import { useIsFocused, useNavigation } from "@react-navigation/native";
import { Box, FlatList, Heading, HStack, Menu, VStack, Pressable, Modal, Center, useDisclose, Actionsheet, Text as RNText } from "native-base";
import React, { useEffect, useState } from "react";
import RepertoryStore from "../services/store/RepertoryStore";
import { Alert, StyleSheet, useWindowDimensions } from "react-native";
import FeaterIcon from 'react-native-vector-icons/Feather'
import useStyle from "../styles";
import LinearGradient from "react-native-linear-gradient";
import GradientPageBase from "../components/GradientPageBase";
import Text from "../components/Text";
import Input from "../components/Input";
import Button from "../components/Button";
import Loader from "../components/Loader";
import useLang from "../utils/useLang";
import {exportHandle as repertoireExport} from "../utils/repertoireExport";
import EmptyReps from "../components/Empty/EmptyReps";
import Share from 'react-native-share'
import {deleteFile} from '../utils/localStorage'
import useAlert from "../utils/useAlert";
import RepertorySongsStore from "../services/store/RepertorySongsStore";
import Banner from "../components/Ads/Banner";

export default function () {

    const styles = useStyle()
    const navigation = useNavigation()
    const isFocused = useIsFocused()
    const {width} = useWindowDimensions()
    const lang = useLang()
    const alert = useAlert()
    const {onOpen, onClose, isOpen} = useDisclose()

    const [repertoires, setRepertoires] = useState([])
    const [fileName, setFileName] = useState('')
    const [idToExport, setIdToExport] = useState()
    const [loading, setLoading] = useState(true)
    const [repAction, setRepAction] = useState({})

    const numColumns = 2
    const tileSize = width/numColumns

    useEffect(() => {
        if (isFocused) {
            getAllRepertoires()
        } else {
            setRepAction({})
            onClose()
        }
    }, [isFocused])

    useEffect(() => {
        if (!isOpen) {
            setRepAction({})
        }
    }, [isOpen])

    function actionSheetOpenHandle(item) {
        setRepAction(item)
        onOpen()
    }

    async function getAllRepertoires() {
        try {
            const result = await RepertoryStore.getAll()
            for (const rep of result) {
                rep.played_songs = await RepertorySongsStore.getPlayedByRep(rep.id)
            }
            setRepertoires([...result])
        } catch (e) {
            alert.alertError(e)
        } finally {
            setLoading(false)
        }
    }

    async function deleteReportory(id) {
        Alert.alert(lang('Delete this repertoire?'), lang('This action cannot be undone'), [
            {text: lang('No')},
            {text: lang('Yes'), onPress: async () => {
                await RepertoryStore.delete(id)
                await getAllRepertoires()
            }},
        ], )
    }

    async function onPressHandle(item) {
        navigation.navigate('RepertoryView', {...item})
    }

    async function exportHandle () {
        try {
            setLoading(true)
            await repertoireExport(idToExport, fileName)
            setFileName(null)
            setIdToExport(null)
            Alert.alert(lang('Saved'))
        } catch (e) {
            alert.alertError(e)
        }

        setLoading(false)
    }

    async function shareHandle(item) {

        let fileUrl = null
        onClose()
        setRepAction({})
        try {

            setLoading(true)
            fileUrl = await repertoireExport(item.id)
            setLoading(false)
            if (!fileUrl) {
                Alert.alert(lang('Ops... Has an error'))
                return
            }

            await Share.open({
                title: item.name,
                message: `${lang('Repertoire')} by Reperfy`,
                url: `file://${fileUrl}`
            })

        } catch (e) {
            if (e.message == 'User did not share')
                return
                
            alert.alertError(e)
        } finally {
            if (!!fileName) {
                await deleteFile(fileUrl)
            }
            setLoading(false)
        }

    }

    function renderItem ({item}) {
        return (
            <Pressable 
                onPress={async () => await onPressHandle(item)}
                _pressed={{opacity: .7}} my={2} px={3}
                w={tileSize} h={tileSize}
            >
                <LinearGradient 
                    colors={[styles.primaryDark+'dd', styles.primary+'dd']} 
                    style={{width: '100%', height: '100%', flex: 1, borderRadius: 15, padding: 10}}
                >
                    <VStack >
                        <HStack justifyContent='space-between' py={2} >
                            <VStack flex={1}>
                                <Heading size='sm' color='#FFF'>{item.name}</Heading>
                            </VStack>
                            <Box>
                                <Pressable _pressed={{opacity: .7}} onPress={() => actionSheetOpenHandle(item)}>
                                    <FeaterIcon name='more-vertical' size={20} color='#FFF'/>
                                </Pressable>
                            </Box>
                        </HStack>

                        {
                            item.songs_len ? 
                            <Text color='#fff'>{item.songs_len} {lang(`Song${item.songs_len > 1 ? 's' : ''}`)}</Text>
                            :
                            <Text color='#fff' lineHeight={15}>No song</Text>
                        }
                        {
                            item.played_songs && item.played_songs.length ?
                            <Text color='#fff'>{item.played_songs.length} {lang(`played${item.songs_len > 1 ? 's' : ''}`)}</Text>
                            : null
                        }
                    </VStack>
                </LinearGradient>
            </Pressable>
        )
    }

    return (
        <GradientPageBase>
            <Box h='100%'>
                <Banner/>
                    
                {
                    !!repertoires.length && !loading ?
                    <FlatList
                        data={repertoires}
                        renderItem={renderItem}
                        numColumns={numColumns}
                    /> : null
                }
                {
                    !repertoires.length && !loading ?
                    <Box h='100%' justifyContent='center'>
                        <EmptyReps/>
                    </Box>
                    : null
                }

                <Actionsheet isOpen={isOpen && !!repAction.id} onClose={onClose} >
                    <Actionsheet.Content>
                        <RNText>{repAction.name}</RNText>
                        <Actionsheet.Item startIcon={<FeaterIcon size={20} name="edit"/>} onPress={() => navigation.navigate('AddRepertory', {id: repAction.id})}>{lang('Edit')}</Actionsheet.Item>
                        <Actionsheet.Item startIcon={<FeaterIcon size={20} name="download"/>} onPress={() => {setIdToExport(repAction.id); setFileName(repAction.name)}}>{lang('Download')}</Actionsheet.Item>
                        <Actionsheet.Item startIcon={<FeaterIcon size={20} name="share-2"/>} onPress={() => {shareHandle(repAction)}}>{lang('Share')}</Actionsheet.Item>
                        <Actionsheet.Item startIcon={<FeaterIcon size={20} color={styles.danger} name="trash"/>} onPress={() => deleteReportory(repAction.id)} _text={{color: '#f00'}}>{lang('Delete')}</Actionsheet.Item>
                    </Actionsheet.Content>
                </Actionsheet>
                
                <Modal isOpen={!!idToExport} onClose={() => setIdToExport(null)} >
                    <Modal.Content bg={styles.bg}>
                        <Modal.Header bg={styles.bg} _text={{color: styles.fontColor}}>
                            {lang('Export repertoire')}
                            <Modal.CloseButton/>
                        </Modal.Header>
                        <Modal.Body>
                            <Input value={fileName} onChangeText={setFileName} label='File name' />
                            <Center>
                                <Text fontSize='xs'>The file will be saved in your downloads folder as .json</Text>
                            </Center>
                        </Modal.Body>
                        <Modal.Footer bg={styles.bg}>
                            <Box flex={1}>
                                <Button onPress={exportHandle}>EXPORT</Button>
                            </Box>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>
                <Loader loading={loading}/>
            </Box>
        </GradientPageBase>
    )
}