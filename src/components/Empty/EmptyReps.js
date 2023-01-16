import { Box, HStack, VStack } from "native-base";
import Heading from "../Heading";
import React from "react";
import Button from "../Button";
import useLang from "../../utils/useLang";
import { useNavigation } from "@react-navigation/native";

export default function () {

    const lang = useLang()
    const navigation = useNavigation()
    
    return (
        <Box w='100%' px={5}>
            <VStack alignItems='center' space={4}>
                <Heading size='md'>{lang('No repertoires here')} ☹️</Heading>
                <Button onPress={() => navigation.navigate('AddRepertory')} w='100%'>Create a new Repertoire</Button>
            </VStack>
        </Box>
    )
}