import { AddIcon, Alert as AlertDialog, Box, Button, CloseIcon, HStack, KeyboardAvoidingView, MinusIcon, Modal, Pressable, ScrollView, View, VStack } from "native-base";
import React, { useEffect, useRef, useState } from "react";
import {  Alert, useWindowDimensions, Modal as NativeModal } from "react-native";
import RenderHTML from "react-native-render-html";
import { useNavigation } from "@react-navigation/native";
import { actions, RichEditor, RichToolbar } from "react-native-pell-rich-editor";
import useStyle from "../styles";
import HTMLCipher from "./HTMLCipher";
import cipherToneUpdate from "../utils/cipherToneUpdate";
import useLang from "../utils/useLang";
import Heading from '../components/Heading'
import Text from '../components/Text'
import GhostButton from "./GhostButton";

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

    function backHandle() {
        setCifraHTML(null)
        props?.onBack()
    }

    return (
        
        <NativeModal 
            animationType="slide"
            visible={props.isOpen && !!cifraHTML}
            onRequestClose={onCloseHandle}
        >
            <View 
                bg={styles.bgDark}
            >
                <Box h='100%'>
                    {/* header */}
                    <Box p={3}>
                        <VStack space={4}>
                            <HStack justifyContent='space-between'>
                                <Heading size='md'>{lang('Edit cipher')} ({props.song.BUSCA})</Heading>
                                <GhostButton mr={2} p={0} onPress={onCloseHandle}>
                                    <CloseIcon size={19.9} color={styles.fontColor}/>
                                </GhostButton>
                            </HStack>
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
                                                style={{
                                                    backgroundColor: styles.bg, 
                                                    borderRadius: 10
                                                }}
                                            /> : null
                                        }
                                    </Box>
                                    : 
                                    <Box mb={2}>
                                        <Button.Group isAttached isDisabled={editMode}>
                                            <Button borderColor={styles.bg} onPress={() => change(-1)} variant='outline' size='sm'>
                                                <HStack alignItems='center' space={2}>
                                                    <MinusIcon size='xs'/>
                                                    <Text fontSize='xs'>½ {lang('tone')}</Text>
                                                </HStack>
                                            </Button>
                                            <Button borderColor={styles.bg} onPress={() => change()} variant='outline' size='sm' >
                                                <HStack alignItems='center' space={2}>
                                                    <AddIcon size='xs'/>
                                                    <Text fontSize='xs'>½ {lang('tone')}</Text>
                                                </HStack>
                                            </Button>
                                        </Button.Group>
                                    </Box>
                                }

                                <Button.Group isAttached >
                                    <Button variant='outline' borderColor={styles.bg} _text={{color: styles.primary}} size='sm' onPress={backHandle}>{lang('Back')}</Button>
                                    <Button variant='outline' borderColor={styles.bg} _text={{color: styles.primary}} size='sm' onPress={editHandle}>{lang(editMode ? 'Change tone' : 'Edit')}</Button>
                                    <Button variant='outline' borderColor={styles.bg} _text={{color: styles.primary}} size='sm' onPress={saveHandle}>OK</Button>
                                </Button.Group>
                            </HStack>
                        </VStack>
                    </Box>

                    {/* Body */}
                    

                    <Box >
                    {
                        !editMode ?
                        <Box >
                            <HTMLCipher h='96.9%' song={{cipher: cifraHTML}}/>
                        </Box>
                        :
                        <Box>
                            <KeyboardAvoidingView behavior="padding" enabled>
                                <ScrollView h='97.9%'>
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
                                </ScrollView>
                            </KeyboardAvoidingView>
                        </Box>
                    }
                    </Box>

                </Box>
            </View>
        </NativeModal>
    )
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
                    <Modal.Body p={0} h={height} _scrollview={{ scrollEnabled: editMode }}>
                        <Box width='100%' h='100%'>
                        {
                            !editMode ?
                                <Box>
                                    <HTMLCipher song={{cipher: cifraHTML}}/>
                                </Box>
                                :
                                <Box h='100%'>
                                    <ScrollView>
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
                                    </ScrollView>
                                </Box>
                            }
                        </Box>

                    </Modal.Body>
                </Modal.Content>
            </KeyboardAvoidingView>
        </Modal>
    )
}