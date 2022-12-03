import { useIsFocused, useRoute } from "@react-navigation/native";
import { Box, Heading, ScrollView, Text } from "native-base";
import React, { useEffect, useState } from "react";
import { useWindowDimensions } from "react-native";
import RenderHTML from "react-native-render-html";
import SongStore from "../services/store/SongStore";

export default function () {

    const route = useRoute()
    const isFocused = useIsFocused()
    const {width} = useWindowDimensions()

    const [song, setSong] = useState({})
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (isFocused && route.params && route.params.id) {
            findSong(route.params.id)
        }
    }, [isFocused, route.params.id])

    useEffect(() => {

        
    }, [song])

    async function findSong(id) {
        setLoading(true)
        let result = await SongStore.find(id)
        setSong(result)
        setLoading(false)
    }

    return (
        <Box px={2}>
            <ScrollView>
                {
                    song && !loading?
                    <Box>
                        <Heading size='md'>{song.name}</Heading>
                        <Text fontSize='sm'>{song.artist}</Text>
                        <RenderHTML
                            contentWidth={width}
                            source={{html: song.cipher}}
                            tagsStyles={{
                                span: {
                                    color: 'orange',
                                    // fontWeight: 'bold'
                                }
                            }}
                        />
                    </Box>
                    : null
                }
            </ScrollView>
        </Box>
    )
}