import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native";
import { ArrowBackIcon, Box, Button, ChevronLeftIcon, ChevronRightIcon, HStack, Pressable, ScrollView, VStack } from "native-base";
import React, { useEffect, useRef, useState } from "react";
import { Platform, useWindowDimensions } from "react-native";
import RenderHTML, {domNodeToHTMLString} from "react-native-render-html";
import SongStore from "../services/store/SongStore";
import styles from "../styles";
import Text from '../components/Text'
import Heading from '../components/Heading'
import WebView from "react-native-webview";

export default function () {

    const route = useRoute()
    const navigation = useNavigation()
    const isFocused = useIsFocused()
    const {width} = useWindowDimensions()
    const cipherRef = useRef()

    const [song, setSong] = useState({})
    const [loading, setLoading] = useState(false)
    const [repId, setRepId] = useState(null)

    useEffect(() => {
        if (isFocused && route.params) {

            findSong(route.params.id)
        }
    }, [isFocused, route.params.id])

    useEffect(() => {
        if (cipherRef.current) {
            // cipherRef.injectedJavaScript('alert(1)')
        }
    }, [cipherRef])

    useEffect(() => {
        if (song && song.id) {
            navigation.setOptions({
                headerLeft: () => (
                    <HStack alignItems='center' space={5}>
                        <Pressable _pressed={{opacity: .5}} onPress={navigation.goBack}>
                            <ArrowBackIcon color='#FFF' size={21}/>
                        </Pressable>
                        <VStack>
                            <Heading size='sm' color='#FFF'>{song.name}</Heading>
                            <Text fontSize='xs' color='#FFF'>{song.artist}</Text>
                        </VStack>
                    </HStack>
                ),
                headerRight: () => {
                    if (!route.params.repId)
                        return null

                    return (
                        <Button.Group isAttached>
                            <Button isDisabled={!song.prev?.id} variant='ghost' onPress={() => findSong(song.prev?.id)}>
                                <ChevronLeftIcon color='#FFF'/>
                            </Button>
                            <Button isDisabled={!song.next?.id} variant='ghost' onPress={() => findSong(song.next?.id)}>
                                <ChevronRightIcon color='#FFF'/>
                            </Button>
                        </Button.Group>
                    )
                }
            })
        }
    }, [song])

    async function findSong(id) {
        setLoading(true)
        let result = {}
        if (route.params.repId) {
            result = await SongStore.findWithNextAndPrevious(id, route.params.repId)
        } else {
            result = await SongStore.find(id)
        }
        setSong(result)
        setLoading(false)
    }

    function getHtmlWithStyle() {

        return `
            <html>
                <style>
                    span {
                        color: ${styles.warning};
                        font-weight: bold
                    }
                    pre {
                        color: ${styles.fontColor};
                        line-height: 1.5
                    }
                </style>
                ${song.cipher || '<span>Nenhuma cifra</span>'}
            </html>
        `
    }

    return (
        <Box px={2}>
            {
                song?
                <Box h='100%' w='100%'>
                    <WebView
                        ref={cipherRef}
                        source={{html: getHtmlWithStyle()}}
                        style={{backgroundColor: styles.bgLight, flex: 1, height: '100%'}}
                        scalesPageToFit={Platform.OS == 'adnroid'}

                        nestedScrollEnabled={false}
                        scrollEnabled={false}
                        overScrollMode='content'
                    />
                </Box>
                : null
            }
        </Box>
    )
}