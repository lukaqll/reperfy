import { AddIcon, Alert as AlertDialog, Box, Button, Center, CloseIcon, FlatList, Heading, HStack, IconButton, Image, Input, KeyboardAvoidingView, MinusIcon, Modal, Pressable, ScrollView, Text, VStack } from "native-base";
import React, { useEffect, useRef, useState } from "react";
import {  Alert, useWindowDimensions } from "react-native";
import RenderHTML from "react-native-render-html";
import { useNavigation } from "@react-navigation/native";
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import useStyle from "../styles";
import HTMLCipher from "./HTMLCipher";

export default function (props) {

    const styles = useStyle()
    const navigation = useNavigation()
    const {width, height} = useWindowDimensions()
    const richText = useRef()

    const [cifraHTML, setCifraHTML] = useState(null)
    const [editMode, setEditMode] = useState(false)

    const scaleSus = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    const scaleBem = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']

    useEffect(() => {

        if (props.isOpen && props.song) {
            setCifraHTML(props.song.cipher)
        }
        setEditMode(false)
    }, [props.isOpen, props.song])

    function editHandle() {
        setEditMode(!editMode)
    }

    function change(to = 1) {

        const regex = /<\s*span data-chord.*?>(.*?)<\s*\/\s*span>/gm
        let strHtml = cifraHTML
        let newTags = []
        while ((match = regex.exec(strHtml)) != null) {

            let tag     = match[0]
            let chord   = match[1]

            let chordTones = chord.match(/[A-G](#|b)|[A-G]/gm)
            if (!chordTones) 
                continue

            let newChord = chord
            
            for (let chordTone of chordTones) {

                let scale = scaleSus
                if (chordTone.match(/.*?b/g))
                    scale = scaleBem

                let index = scale.indexOf(chordTone)

                index += (1*to)

                if (index < 0)
                   index = scale.length-1

                if (index >= scale.length)
                    index = 0

                let newChordTone = scale[index]
                let regexReplace = new RegExp(`${chordTone}`, 'g');
                newChord = newChord.replace(regexReplace, newChordTone)
            }

            let newTag = tag.replace(/>(.*?)<\//gm, `>${newChord}</`)
            newTags.push({tag, newTag})
        }

        // replace chord tags
        let replacedTags = []
        for (tag of newTags) {

            if (!replacedTags.includes(tag.tag)) {
                strHtml = strHtml.replaceAll(tag.tag, tag.newTag)
                replacedTags.push(tag.tag)
            }
        }

        setCifraHTML(strHtml)
    }

    function onCloseHandle() {
        setCifraHTML(null)
        props?.onClose()
    }

    function saveHandle() {
        Alert.alert('Salvar cifra?', 'A cifra será adicionada na música', [
            {text: 'Não'},
            {
                text: 'Sim',
                onPress: () => {
                    const song = props.song
                    song.cipher = cifraHTML
                    props.onSave(song)
                }
            }
        ])
    }

    return (
        <Modal 
            isOpen={props.isOpen && !!cifraHTML}
            onClose={onCloseHandle}
            size='full'
            avoidKeyboard
        >
            <KeyboardAvoidingView behavior="position" enabled w='100%'>
                <Modal.Content >
                    <Modal.CloseButton/>
                    <Modal.Header>
                        <VStack space={4}>
                            <Heading size='md'>Editar cifra ({props.song.BUSCA})</Heading>
                            <HStack justifyContent='space-between' alignItems='center'>
                                {
                                    editMode ? 
                                    <Box>
                                        {
                                            richText ?
                                            <RichToolbar
                                                editor={richText}
                                                actions={[ 
                                                    actions.undo,
                                                    actions.redo
                                                ]}
                                                style={{backgroundColor: '#FFF', borderRadius: 10}}
                                            /> : null
                                        }
                                    </Box>
                                    : 
                                    <Box>
                                        <Button.Group isAttached isDisabled={editMode}>
                                            <Button  onPress={() => change(-1)} variant='outline' size='sm'>
                                                <HStack alignItems='center' space={2}>
                                                    <MinusIcon size='xs'/>
                                                    <Text fontSize='xs'>½ tom</Text>
                                                </HStack>
                                            </Button>
                                            <Button onPress={() => change()} variant='outline' size='sm' >
                                                <HStack alignItems='center' space={2}>
                                                    <AddIcon size='xs'/>
                                                    <Text fontSize='xs'>½ tom</Text>
                                                </HStack>
                                            </Button>
                                        </Button.Group>
                                    </Box>
                                }

                                <Button.Group isAttached >
                                    <Button variant='outline' _text={{color: styles.primary}} size='sm' onPress={editHandle}>{editMode ? 'Alterar tom' : 'Editar'}</Button>
                                    <Button variant='outline' _text={{color: styles.primary}} size='sm' onPress={saveHandle}>OK</Button>
                                </Button.Group>
                            </HStack>
                        </VStack>

                    </Modal.Header>
                    <Modal.Body p={0} h={height}>
                        <Box width='100%' h='100%'>
                        {
                            !editMode ?
                                <Box>
                                    <HTMLCipher song={{cipher: cifraHTML}}/>
                                </Box>
                                :
                                <Box>
                                    <Box p={2}>
                                        <AlertDialog status="info" colorScheme="info">
                                            <HStack flexShrink={1} space={2} alignItems="center" justifyContent="space-between">
                                                <HStack flexShrink={1} space={2} alignItems="center">
                                                    <AlertDialog.Icon />
                                                    <Box pl="6" flex={1}>
                                                        Ao editar um acorde manualmente, a alteração de tom pode não se comportar corretamente
                                                    </Box>
                                                </HStack>
                                            </HStack>
                                        </AlertDialog>
                                    </Box>
                                    <RichEditor
                                        ref={richText}
                                        onChange={setCifraHTML}
                                        initialHeight={250}
                                        initialContentHTML={cifraHTML}
                                    />
                                </Box>
                            }
                        </Box>

                    </Modal.Body>
                </Modal.Content>
            </KeyboardAvoidingView>
        </Modal>
    )
}