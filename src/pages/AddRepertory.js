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
import ModalImportFile from "../components/ModalImportFile";
import ReceiveSharingIntentModule from "react-native-receive-sharing-intent";
import useAlert from "../utils/useAlert";
import Banner from "../components/Ads/Banner";

export default function ({route}) {

    const [rep, setRep] = useState({})
    const [loading, setLoading] = useState(false)
    const [fileResponse, setFileResponse] = useState();
    const [allowsSearchSongImport, setAllowsSearchSongImport] = useState(true)

    const styles = useStyle()
    const lang = useLang()
    const isFocused = useIsFocused()
    const navigation = useNavigation()
    const alert = useAlert()

    useEffect(() => {
        if (route.params) {
            if (route.params.id) {
                find(route.params.id)
            }

            if (route.params.sharedFile) {
                setFileResponse({...route.params.sharedFile})
            }
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
        } catch (e) {
            if (e.message == 'User canceled document picker ')
                return

            alert.alertError(e)
        }
    }, []);

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
            alert.alertError(e)
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

                <ModalImportFile
                    fileResponse={fileResponse}
                    onClose={() => {
                        setFileResponse(null)
                        ReceiveSharingIntentModule.clearReceivedFiles()
                    }}
                    onImport={() => {
                        setFileResponse(null)
                        ReceiveSharingIntentModule.clearReceivedFiles()
                        navigation.navigate('Repertoires')
                    }}
                />
                <Loader loading={loading}/>
                <Box alignItems='center'>
                    <Banner size='retangle' style={{marginTop: 20}}/>
                </Box>
            </Box>
        </GradientPageBase>
    )
}