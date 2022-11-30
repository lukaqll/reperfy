import { Box, Button, FormControl, Input, Text } from "native-base";
import React, { useEffect, useState } from "react";
import SongStore from "../services/store/SongStore";
import { useIsFocused, useNavigation } from "@react-navigation/native";

export default function ({route}) {

    const [song, setSong] = useState({})
    const isFocused = useIsFocused()
    const navigation = useNavigation()

    useEffect(() => {
        if (route.params && (id = route.params.id)) {
            find(id)
        }
    }, [isFocused])

    async function find(id) {
        const result = await SongStore.find(id)
        setSong(result)
    }

    async function save() {
        if (!song.id) {
            let result = await SongStore.insert(song)
            console.log(result)
        } else {
            await SongStore.update(song)
        }
        navigation.navigate('Songs')
    }

    return (
        <Box p={4}>
            <FormControl>
                <FormControl.Label>Nome</FormControl.Label>
                <Input
                    value={song.name}
                    onChangeText={v => setSong({...song, name: v})}
                />
            </FormControl>
            <FormControl>
                <FormControl.Label>Artista</FormControl.Label>
                <Input
                    value={song.artist}
                    onChangeText={v => setSong({...song, artist: v})}
                />
            </FormControl>
            <Button mt={5} onPress={save}>Save</Button>
        </Box>
    )
}