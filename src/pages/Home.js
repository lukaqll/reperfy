import React, { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { AddIcon, Box, Button, CheckIcon, Heading, HStack, Icon, IconButton, ScrollView, View, VStack } from "native-base";
import RepertoryStore from "../services/store/RepertoryStore";
import styles from "../styles";

export default function ({navigation}) {

    const isFocused = useIsFocused()

    const [reps, setReps] = useState([])

    useEffect(() => {
        if (isFocused) {
            getRepertoires()
        }
    }, [isFocused])
    
    async function getRepertoires() {
        let result = await RepertoryStore.getAll()
        setReps(result)
    }

    function renderCard(item, i) {
        return (
            <Box key={i}>
                <Box rounded={10} bg={styles.primaryDark} p={5} shadow={5}>
                    <Heading color='#fff'>{item.name}</Heading>
                </Box>
            </Box>
        )
    }

    return (
        <ScrollView>
            <Box p={4}>
                <VStack h='100%' space={3}>

                    <Box>
                        <VStack space={3}>
                            {
                                reps.map(renderCard)
                            }
                        </VStack>
                    </Box>

                    <Button onPress={() => navigation.navigate('Songs')}>Músicas</Button>
                    <Button onPress={() => navigation.navigate('Repertoires')}>Repertórios</Button>
                </VStack>
            </Box>
        </ScrollView>
    )
}