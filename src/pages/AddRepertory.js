import { Box, Toast } from "native-base";
import React, { useEffect, useState } from "react";
import RepertoryStore from "../services/store/RepertoryStore";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import Loader from "../components/Loader";
import Input from "../components/Input";
import Button from "../components/Button";
import useStyle from "../styles";
import GradientPageBase from "../components/GradientPageBase";

export default function ({route}) {

    const [rep, setRep] = useState({})
    const [loading, setLoading] = useState(false)

    const styles = useStyle()
    const isFocused = useIsFocused()
    const navigation = useNavigation()


    useEffect(() => {
        if (route.params && (id = route.params.id)) {
            find(id)
        }
    }, [isFocused])

    useEffect(() => {
        
        if (rep.id) {
            navigation.setOptions({title: 'Editar repertório'})
        }
    }, [rep.id])

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
                throw "Insira um nome para o repertório"
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
            Toast.show({description: e})
        }
    }

    return (
        <GradientPageBase>
            <Box h='100%' p={4}>
                <Input
                    label='Nome'
                    value={rep.name}
                    onChangeText={v => setRep({...rep, name: v})}
                />
                <Button mt={5} bg={styles.success} onPress={save}>PRÓXIMO</Button>
                <Loader loading={loading}/>
            </Box>
        </GradientPageBase>
    )
}