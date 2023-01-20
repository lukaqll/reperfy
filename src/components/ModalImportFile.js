import { HStack, Modal, Switch, Alert as NBAlert, Box } from "native-base";
import React, { useCallback, useState } from "react";
import { Alert } from "react-native";
import useStyle from "../styles";
import GhostButton from "./GhostButton";
import Text from "./Text";
import {importHandle as repertoireImport} from "../utils/repertoireExport";
import Heading from "./Heading";
import useLang from "../utils/useLang";
import useAlert from "../utils/useAlert";


export default function ({fileResponse, onClose, onImport}) {

    const styles = useStyle()
    const lang = useLang()
    const alert = useAlert()

    const [allowsSearchSongImport, setAllowsSearchSongImport] = useState(true)
    
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
                            setAllowsSearchSongImport(true)
                            onImport()
                            return
                        }
                    } catch (err) {
                        alert.alertError(e)
                    }
                }},
            ]
        )
    })

    return (
        <Modal isOpen={!!fileResponse} onClose={onClose}>
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
                            <GhostButton colorScheme='error' onPress={onClose}>Cancel</GhostButton>
                            <GhostButton colorScheme='success' onPress={handleImportFile}>Import</GhostButton>
                        </HStack>
                    </Box>
                    
                </Modal.Body>
            </Modal.Content>
        </Modal>
    )
    
}