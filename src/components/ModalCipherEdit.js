import { AddIcon, Alert as AlertDialog, Box, Button, Center, CloseIcon, FlatList, Heading, HStack, IconButton, Image, Input, KeyboardAvoidingView, MinusIcon, Modal, Pressable, ScrollView, Text, VStack } from "native-base";
import React, { useEffect, useRef, useState } from "react";
import {  Alert, useWindowDimensions } from "react-native";
import RenderHTML from "react-native-render-html";
import { useNavigation } from "@react-navigation/native";
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import useStyle from "../styles";
import HTMLCipher from "./HTMLCipher";
import cipherToneUpdate from "../utils/cipherToneUpdate";
import useLang from "../utils/useLang";

export default function (props) {

    const styles = useStyle()
    const lang = useLang()
    
    const navigation = useNavigation()
    const {width, height} = useWindowDimensions()
    const richText = useRef()

    const [cifraHTML, setCifraHTML] = useState(null)
    const [editMode, setEditMode] = useState(false)

    

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
        let strHtml = cipherToneUpdate(cifraHTML, to)
        setCifraHTML(strHtml)
    }

    function onCloseHandle() {
        setCifraHTML(null)
        props?.onClose()
    }

    function saveHandle() {
        const song = props.song
        song.cipher = cifraHTML
        props.onSave(song)
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
                            <Heading size='md'>{lang('Edit cipher')} ({props.song.BUSCA})</Heading>
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
                                                    <Text fontSize='xs'>½ {lang('tone')}</Text>
                                                </HStack>
                                            </Button>
                                            <Button onPress={() => change()} variant='outline' size='sm' >
                                                <HStack alignItems='center' space={2}>
                                                    <AddIcon size='xs'/>
                                                    <Text fontSize='xs'>½ {lang('tone')}</Text>
                                                </HStack>
                                            </Button>
                                        </Button.Group>
                                    </Box>
                                }

                                <Button.Group isAttached >
                                    <Button variant='outline' _text={{color: styles.primary}} size='sm' onPress={editHandle}>{lang(editMode ? 'Alterar tom' : 'Editar')}</Button>
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
                                                        {lang('When editing a chord manually, tone change may not behave correctly')}
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