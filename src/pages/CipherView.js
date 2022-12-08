import { useIsFocused, useNavigation, useRoute } from "@react-navigation/native";
import { ArrowBackIcon, Box, Button, ChevronLeftIcon, ChevronRightIcon, HStack, Pressable, VStack } from "native-base";
import React, { useEffect, useRef, useState } from "react";
import SongStore from "../services/store/SongStore";
import useStyle from "../styles";
import Text from '../components/Text'
import Heading from '../components/Heading'
import HTMLCipher from "../components/HTMLCipher";

export default function () {

    const route = useRoute()
    const navigation = useNavigation()
    const isFocused = useIsFocused()
    const styles = useStyle()
    const songRef = useRef()
    const groupIdRef = useRef()

    const [song, setSong] = useState({})
    const [loading, setLoading] = useState(false)
    const [initialGroupId, setInitialGroupId] = useState(null)

    useEffect(() => {
        if (isFocused && route.params) {
            findSong(route.params.id)
        }
    }, [isFocused, route.params.id])


    useEffect(() => {
        songRef.current = {...song}

        if (song && song.id) {

            navigation.setOptions({
                headerLeft: () => (
                    <HStack alignItems='center' space={5}>
                        <Pressable _pressed={{opacity: .5}} onPress={navigation.goBack}>
                            <ArrowBackIcon color={styles.fontColor} size={21}/>
                        </Pressable>
                        <VStack>
                            <Heading size='sm' color={styles.fontColor}>{song.name}</Heading>
                            <Text fontSize='xs' color={styles.fontColor}>{song.artist}</Text>
                            {/* <Text>{currentGroupId}</Text> */}
                        </VStack>
                    </HStack>
                ),
                headerRight: () => {
                    if (!route.params.repId)
                        return null

                    return (
                        <Button.Group isAttached>
                            <Button isDisabled={!song.prev?.id} variant='ghost' onPress={() => findSong(song.prev?.id, song.prev?.prev_group_id)}>
                                <ChevronLeftIcon color={styles.primary}/>
                            </Button>
                            <Button isDisabled={!song.next?.id} variant='ghost' onPress={() => findSong(song.next?.id, song.next?.next_group_id)}>
                                <ChevronRightIcon color={styles.primary}/>
                            </Button>
                        </Button.Group>
                    )
                }
            })
        }
    }, [song])

    async function findSong(id, groupId = route.params.group.id) {
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

    return (
        <Box pt={50}>
            {
                song?
                <Box h='100%' w='100%'>
                    <HTMLCipher song={song}/>
                </Box>
                : null
            }
        </Box>
    )
}