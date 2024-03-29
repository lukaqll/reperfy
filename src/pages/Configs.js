import React, { useEffect, useState } from "react";
import { useIsFocused } from "@react-navigation/native";
import { Box, CheckIcon, HStack, Pressable, ScrollView, Select, Switch, VStack } from "native-base";
import GradientPageBase from "../components/GradientPageBase";
import Text from "../components/Text";
import Heading from "../components/Heading";
import useStyle from "../styles";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { switchAdsMode, switchLang, switchMode } from "../services/redux/actions";
import { useSelector, useDispatch } from "react-redux";
import useLang from "../utils/useLang";
import GhostButton from "../components/GhostButton";
import SongStore from "../services/store/SongStore";

export default function () {

    const styles = useStyle()
    const lang = useLang()

    const selector = useSelector(state => state.theme)
    const dispatch = useDispatch()
    const isFocused = useIsFocused()

    const [chordColor, setChordColor] = useState(styles.primaryDark)
    const [toggleAds, setToggleAds] = useState(false)

    useEffect(() => {
        getChordColor()
        canToggleAds()
    }, [isFocused, selector])

    function handleThemeChange() { 
        const mode = selector.mode == 'light' ? 'dark' : 'light'
        dispatch(switchMode(mode));
        AsyncStorage.setItem('theme', mode).then()
    }

    async function handleChordColor(color) {
        await AsyncStorage.setItem('chord_color', color)
        setChordColor(color)
    }

    async function getChordColor() {
        let color = await AsyncStorage.getItem('chord_color') || styles.primaryDark
        setChordColor(color)
    }

    function handleLangChange(lang) {
        dispatch(switchLang(lang));
        AsyncStorage.setItem('lang', lang).then()
    }

    function canToggleAds() {
        SongStore.findByName('biscoito de melancia')
                 .then(result => {
                    if (!!result && result.id) {
                        setToggleAds(true)
                    } else {
                        setToggleAds(false)
                    }
                 })
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
                                isChecked={selector.mode == 'dark'}
                            />
                        </HStack>
                    </Box>

                    <Box mt={3}>
                        <Heading size='sm'>{lang('Chord color')}</Heading>
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

                    <Box mt={3}>
                        <Heading size='sm'>Lang</Heading>
                        <Select 
                            mt={3}
                            selectedValue={selector.lang}
                            color={styles.fontColor}
                            rounded='full'
                            onValueChange={handleLangChange}
                        >
                            <Select.Item value='en-us' label={lang('English')}/>
                            <Select.Item value='pt-br' label={lang('Portuguese')}/>
                        </Select>
                    </Box>
                            
                    {
                        toggleAds ?
                        <Box>
                            <GhostButton onPress={() => {
                                let newMode = selector.ads == '1' ? '0' : '1'
                                dispatch(switchAdsMode(newMode))
                                AsyncStorage.setItem('ads', newMode)
                            }}>
                                {selector.ads == '1' ? 'Disable Ads' : 'Enable Ads'}
                            </GhostButton>
                        </Box> : null
                    }
                </VStack>
            </Box>
        </GradientPageBase>
    )
}