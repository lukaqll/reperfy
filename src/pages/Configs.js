import React, { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { Box, CheckIcon, HStack, Pressable, ScrollView, Switch, VStack } from "native-base";
import GradientPageBase from "../components/GradientPageBase";
import Text from "../components/Text";
import Heading from "../components/Heading";
import useStyle from "../styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { switchMode } from "../services/redux/actions";
import { useSelector, useDispatch } from "react-redux";

export default function ({navigation}) {

    const styles = useStyle()
    const theme = useSelector(state => state.theme)
    const dispatch = useDispatch()
    const isFocused = useIsFocused()

    const [chordColor, setChordColor] = useState(styles.primaryDark)

    useEffect(() => {
        getChordColor()
    }, [isFocused])

    function handleThemeChange() { 
        const mode = theme.mode == 'light' ? 'dark' : 'light'
        dispatch(switchMode(mode));
        AsyncStorage.setItem('theme', mode).then()
    }

    async function handleChordColor(color) {
        await AsyncStorage.setItem('chord_color', color)
        setChordColor(color)
    }

    async function getChordColor() {
        let color = await AsyncStorage.getItem('chord_color')
        setChordColor(color)

    }

    const chordColors = [styles.primaryDark, '#fa1e3c', '#20a19d', '#f44926', '#846dbe', '#444']

    return (
        <GradientPageBase>
            <Box p={4}>
                <VStack h='100%' space={3}>
                    
                    <Box>
                        <HStack alignItems='center'>
                            <Heading size='sm' mr={3}>Dark mode</Heading>
                            <Switch 
                                size='lg'
                                onTrackColor={styles.primary}
                                onChange={handleThemeChange}
                                isChecked={theme.mode == 'dark'}
                            />
                        </HStack>
                    </Box>

                    <Box mt={3}>
                        <Heading size='sm'>Cor dos acordes</Heading>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <HStack space={3} my={3}>
                                {
                                    chordColors.map((c, i) => (
                                        <Pressable 
                                            rounded='full' shadow={3}
                                            w={50} h={50}
                                            bg={c} key={i}
                                            _pressed={{opacity: .7}}
                                            justifyContent='center'
                                            alignItems='center'
                                            onPress={async () => await handleChordColor(c)}
                                        >
                                            {
                                                c == chordColor ? <CheckIcon size={25} color='#FFF'/> : null
                                            }
                                        </Pressable>
                                    ))
                                }
                            </HStack>
                        </ScrollView>

                    </Box>
                </VStack>
            </Box>
        </GradientPageBase>
    )
}