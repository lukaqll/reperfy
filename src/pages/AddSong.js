import { Box, FormControl, Text, VStack } from "native-base";
import React, { useEffect, useState } from "react";
import SongStore from "../services/store/SongStore";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import ModalCifrasSearch from "../components/ModalCifrasSearch";
import ModalCipherEdit from "../components/ModalCipherEdit";
import Button from "../components/Button";
import Input from "../components/Input";
import styles from "../styles";
import { Alert } from "react-native";

export default function ({route}) {

    const [song, setSong] = useState({})
    const [modalAddCipher, setModalAddCipher] = useState(false)
    const [modalAlterCipher, setModalAlterCipher] = useState(false)
    const [selectedSong, setSelectedSong] = useState({})
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

        if (!song.name) {
            Alert.alert('Atenção', 'Insira um nome')
            return
        }
        if (!song.id) {
            let result = await SongStore.insert(song)
        } else {
            await SongStore.update(song)
        }
        navigation.navigate('Songs')
    }

    function editCipherHandle() {
        setSelectedSong({...song, BUSCA: `${song.name} ${song.artist}`})
        setModalAlterCipher(true)
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
            
            <VStack space={3} mt={5}>
                <Button bg={styles.success} onPress={save}>Salvar</Button>
                <Button onPress={() => setModalAddCipher(true)}>Buscar Cifra</Button>
                {
                    song.cipher ?
                    <Button onPress={editCipherHandle}>Editar Cifra</Button> : null
                }
            </VStack>

            <ModalCifrasSearch 
                isOpen={modalAddCipher} 
                onClose={() => setModalAddCipher(false)}
                onSelect={selected => {
                    setModalAlterCipher(true)
                    setSelectedSong(selected)
                }}
                initialSongName={song.name || ''}
            />
            <ModalCipherEdit 
                isOpen={modalAlterCipher && !!selectedSong.cipher}
                onClose={() => setModalAlterCipher(false)}
                song={selectedSong}
                onSave={saved => {
                    const newSong = {...song, ...saved}
                    setSong(newSong)
                    setModalAlterCipher(false)
                }}
            />
        </Box>
    )
}