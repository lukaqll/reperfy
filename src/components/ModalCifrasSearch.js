import { Box, FlatList, Heading, HStack, Image, Input, Modal, Pressable, Text, VStack } from "native-base";
import React, { useEffect, useState } from "react";
import useCifrasRepo from "../services/repos/cifras";
import InputSearch from "./InputSearch";
import Loader from "./Loader";
import DomSelector from 'react-native-dom-parser';
import { Alert, useWindowDimensions } from "react-native";
import RenderHTML from "react-native-render-html";

export default function (props) {

    const cifrasRepo = useCifrasRepo()
    const {width} = useWindowDimensions()

    const [search, setSearch] = useState('')
    const [songs, setSongs] = useState([])
    const [loading, setLoading] = useState(false)
    const [cifraHTML, setCifraHTML] = useState('')

    useEffect(() => {

        if (props.isOpen && props.initialSongName) {
            setSearch(props.initialSongName)
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

    async function findSong(codName, codArtist) {
        setLoading(true)
        let result = await cifrasRepo.findSong(codName, codArtist)
        let cypher = formatCypher(result.data)       
        setCifraHTML(cypher)
        setLoading(false)
    }

    function formatCypher(html) {
        // get only teg <pre>
        let htmlCypherOnly = html.match(/<\s*pre[^>]*>[\s\S]*<\s*\/\s*pre>/g)

        if (!htmlCypherOnly) {
            Alert.alert('Falha ao obter conteúdo')
            return null
        }

        // remove buttons and replace line breakes
        htmlCypherOnly = htmlCypherOnly[0].replace(/<\s*button[^>]*>(.|\n)*?<\s*\/\s*button>/g, '')
                                          .replace(/(?:\r\n|\r|\n)/g, '<br>')

        return htmlCypherOnly
    }

    function renderItem(song, i) {
        if (!song.TITULO)
            return null

        return (
            <Pressable 
                key={i}
                _pressed={{opacity: .7}}
                onPress={async () => await findSong(song.COD_TITULO, song.COD_ARTISTA)}
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
        >
            <Modal.Content>
                <Modal.CloseButton/>
                <Modal.Header>
                    <VStack space={4}>
                        <Heading size='md'>Buscar cifra</Heading>
                        <InputSearch
                            value={search}
                            onChangeText={setSearch}
                            onClean={() => setSearch('')}
                            onSearch={searchCifras}
                        />
                    </VStack>

                </Modal.Header>
                <Modal.Body>
                    <Box>
                        <VStack space={2}>
                            {songs.map(renderItem)}
                        </VStack>
                    </Box>
                    <Box width='100%'>
                        <RenderHTML
                            contentWidth={width}
                            source={{html: cifraHTML}}
                            tagsStyles={{
                                span: {
                                    color: 'orange',
                                    fontWeight: 'bold'
                                },
                                div: {
                                    fontSize: 6.5
                                }
                            }}
                            enableExperimentalGhostLinesPrevention={true}
                        />
                    </Box>
                </Modal.Body>
            </Modal.Content>
            <Loader loading={loading && props.isOpen}/>
        </Modal>
    )
}