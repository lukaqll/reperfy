import { Box, HStack, Modal, Switch, Toast, Alert as NBAlert } from "native-base";
import React, { useCallback, useEffect, useState } from "react";
import RepertoryStore from "../services/store/RepertoryStore";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import Loader from "../components/Loader";
import Input from "../components/Input";
import Button from "../components/Button";
import useStyle from "../styles";
import GradientPageBase from "../components/GradientPageBase";
import useLang from "../utils/useLang";
import { Alert } from "react-native";
import DocumentPicker, { types } from 'react-native-document-picker';
import {importHandle as repertoireImport} from "../utils/repertoireExport";
import Text from "../components/Text";
import GhostButton from "../components/GhostButton";
import Heading from "../components/Heading";

export default function ({route}) {

    const [rep, setRep] = useState({})
    const [loading, setLoading] = useState(false)
    const [fileResponse, setFileResponse] = useState();
    const [allowsSearchSongImport, setAllowsSearchSongImport] = useState(true)

    const styles = useStyle()
    const lang = useLang()
    const isFocused = useIsFocused()
    const navigation = useNavigation()

    useEffect(() => {
        if (route.params && (id = route.params.id)) {
            find(id)
        }
    }, [isFocused])

    useEffect(() => {
        
        if (rep.id) {
            navigation.setOptions({title: lang('Edit Repertoire')})
        }
    }, [rep.id])


    /**
     * import by file
     */
    const handleDocumentSelection = useCallback(async () => {
        try {
            const file = await DocumentPicker.pick({presentationStyle: 'fullScreen'})
            if (file && file[0]) {
                setFileResponse(file[0])                
            }
        } catch (err) {
            if (typeof err == 'string') {
                Alert.alert(lang(err))
            }
        }
    }, []);

    const handleImportFile = useCallback(async () => {
        Alert.alert(
            (lang('Import')  + ' ' + fileResponse.name + '?'), '',
            [
                {text: lang('No')},
                {text: lang('Yes'), onPress: async () => {
                    try {
                        const imported = await repertoireImport(fileResponse, allowsSearchSongImport)
                        if (imported) {
                            Alert.alert(lang('Successfully imported'))
                            setFileResponse(null)
                            setAllowsSearchSongImport(true)
                            navigation.navigate('Repertoires')
                            return
                        }
                    } catch (err) {
                        if (typeof err == 'string') {
                            Alert.alert(lang(err))
                        } else {
                            console.error(err)
                            Alert.alert(lang('Ops... Has an error'))
                        }
                    }
                }},
            ]
        )
    })

    /**
     * find repertory
     */
    async function find(id) {
        setLoading(true)
        const result = await RepertoryStore.find(id)
        setRep(result)
        setLoading(false)
    }


    /**
     * save repertory
     */
    async function save() {

        try {

            if (!rep.name) {
                throw "Enter a name for the repertoire"
            }

            setLoading(true)

            let id = rep.id

            if (!id) {
                const result = await RepertoryStore.insert(rep)
                id = result.insertId
            } else {
                await RepertoryStore.update(rep)
            }
            navigation.navigate('AddRepertorySongs', {id})
        } catch (e) {
            Toast.show({description: lang(e)})
        }
    }

    return (
        <GradientPageBase>
            <Box h='100%' p={4}>
                <Input
                    label='Name'
                    value={rep.name}
                    onChangeText={v => setRep({...rep, name: v})}
                    onSubmitEditing={save}
                />
                <Button mt={5} bg={styles.success} onPress={save}>NEXT</Button>
                {
                    !route.params?.id && !fileResponse ?
                    <GhostButton  
                        mt={3}
                        onPress={handleDocumentSelection}
                    >IMPORT BY A FILE</GhostButton>
                    : null
                }
                <Modal isOpen={!!fileResponse} onClose={() => setFileResponse(null)}>
                    <Modal.Content bg={styles.bg}>
                        <Modal.Header bg={styles.bg} _text={{color: styles.fontColor}}>
                            <Text>Arquivo: {fileResponse?.name}</Text>
                            <Modal.CloseButton/>
                        </Modal.Header>
                        <Modal.Body>
                            <HStack alignItems='center' space={2}>
                                <Switch 
                                    size='lg'
                                    onTrackColor={styles.primary}
                                    value={allowsSearchSongImport}
                                    onToggle={setAllowsSearchSongImport}
                                />
                                <Heading size='xs' mr={3} flex={1}>Using already registered songs for import</Heading>
                            </HStack>
                            <NBAlert bg={styles.bgDark} mt={3}>
                                <Text>This option allows you to search for already registered songs by name to link to the repertoire to be imported.</Text>
                            </NBAlert>
                            <Box mt={3}>
                                <HStack w='100%' justifyContent='space-between'>
                                    <GhostButton colorScheme='error' onPress={() => setFileResponse(null)}>Cancel</GhostButton>
                                    <GhostButton colorScheme='success' onPress={handleImportFile}>Import</GhostButton>
                                </HStack>
                            </Box>
                            
                        </Modal.Body>
                    </Modal.Content>
                </Modal>
                <Loader loading={loading}/>
            </Box>
        </GradientPageBase>
    )
}