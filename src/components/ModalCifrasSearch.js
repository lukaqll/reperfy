import { Box, FormControl, Heading, HStack, Image, KeyboardAvoidingView, Modal, Pressable, Text, VStack } from "native-base";
import React, { useEffect, useState } from "react";
import useCifrasRepo from "../services/repos/cifras";
import InputSearch from "./InputSearch";
import { Alert } from "react-native";
export default function (props) {

    const cifrasRepo = useCifrasRepo()

    const [search, setSearch] = useState('')
    const [songs, setSongs] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {

        if (props.isOpen) {

            if (props.initialSongName) {
                setSearch(props.initialSongName)
            }
        }
        setLoading(false)

    }, [props.isOpen])

    async function searchCifras() {
        if (!search)
            return

        setLoading(true)
        let result = await cifrasRepo.searchSongs(search)
        setSongs(result.data.songs)
        setLoading(false)
    }

    async function findSong(song) {
        if (!song || !song.COD_TITULO || !song.COD_ARTISTA)
            return

        setLoading(true)
        let result = await cifrasRepo.findSong(song.COD_TITULO, song.COD_ARTISTA)
        let cipher = formatCipher(result.data)       
        song.cipher = cipher
        props.onClose()
        props.onSelect(song)
        setLoading(false)
    }

    function formatCipher(html) {
        // get only teg <pre>
        let htmlCipherOnly = html.match(/<\s*pre[^>]*>[\s\S]*<\s*\/\s*pre>/g)

        if (!htmlCipherOnly) {
            Alert.alert('Falha ao obter conteúdo')
            return null
        }

        // remove buttons and replace line breakes
        htmlCipherOnly = htmlCipherOnly[0].replace(/<\s*button[^>]*>(.|\n)*?<\s*\/\s*button>/g, '')
                                          .replace(/(?:\r\n|\r|\n)/g, '<br>')

        htmlCipherOnly = `<main>${htmlCipherOnly}</main>`
        return htmlCipherOnly
    }

    function renderItem(song, i) {
        if (!song.TITULO)
            return null

        return (
            <Pressable 
                key={i}
                _pressed={{opacity: .7}}
                onPress={async () => await findSong(song)}
            >
                <HStack space={2} alignItems='center'>
                    {
                        song.AVATAR && !song.AVATAR.match(/.svg$/g) ?
                        <Image src={song.AVATAR} alt='.' size='xs' rounded='md'/> : null
                    }
                    <VStack>
                        <Heading fontSize='sm'>{song.TITULO}</Heading>
                        <Text fontSize='xs'>{song.ARTISTA}</Text>
                    </VStack>
                </HStack>
            </Pressable>
        )
    }

    return (
        <Modal 
            isOpen={props.isOpen}
            onClose={props.onClose}
            size='full'
            avoidKeyboard
        >
            <Modal.Content>
                <Modal.CloseButton/>
                <Modal.Header>
                    <VStack space={4}>
                        <Heading size='md'>Buscar cifra</Heading>
                        <FormControl>
                            <InputSearch
                                value={search}
                                onChangeText={setSearch}
                                onClean={() => setSearch('')}
                                onSearch={searchCifras}
                                loading={loading && props.isOpen}
                            />
                        </FormControl>
                    </VStack>

                </Modal.Header>
                <Modal.Body>
                    <Box>
                        <VStack space={2}>
                            {songs.map(renderItem)}
                        </VStack>
                    </Box>
                </Modal.Body>
            </Modal.Content>
        </Modal>
    )
}