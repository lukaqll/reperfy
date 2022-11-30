import { AddIcon, Box, Button, CheckIcon, HStack, Icon, IconButton, View, VStack } from "native-base";
import React from "react";
import { SafeAreaView, Text } from "react-native";
import FLoatButton from "../components/FLoatButton";

export default function ({navigation}) {

    return (
        <SafeAreaView>
            <Box p={4}>
                <VStack h='100%' space={3}>

                    <Button onPress={() => navigation.navigate('Songs')}>Músicas</Button>
                    <Button onPress={() => navigation.navigate('Repertoires')}>Repertórios</Button>

                </VStack>
            </Box>
        </SafeAreaView>
    )
}