import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar, Box } from "native-base";
import React, { useEffect, useState } from "react";
import { LogBox } from "react-native";
import { useDispatch } from "react-redux";
import SplashLoader from "./components/SplashLoader";
import IndexRoute from "./routes/index.route";
import { switchAdsMode, switchLang, switchMode } from "./services/redux/actions";
import Database from "./services/store/Database";
import useStyle from "./styles";
import useGetShare from "./utils/getShare";
import { navigationRef } from "./routes/root.route";
import * as RNLocalize from "react-native-localize";

export default function () {

    const shareFile = useGetShare()
    const [loaded, setLoaded] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        Database.setUpDatabase()
        updateTheme()

        LogBox.ignoreLogs([
            "We can not support a function callback. See Github Issues for details https://github.com/adobe/react-spectrum/issues/2320",
        ]);        
    }, [])

    useEffect(() => {
        if (shareFile && mounted) {
            const responseFile = {
                type: shareFile.mimeType,
                name: shareFile.fileName,
                uri: shareFile.contentUri
            }
            if (mounted || (navigationRef && navigationRef.current)) {
                navigationRef?.current?.navigate('AddRepertory', {sharedFile: responseFile})
            }
        }
    }, [shareFile, mounted])
    
    async function updateTheme() {
        let lang   = await AsyncStorage.getItem('lang')
        const mode = await AsyncStorage.getItem('theme') || 'dark'
        const ads  = await AsyncStorage.getItem('ads')   || '1'

        if (!lang) {
            const deviceLocale = RNLocalize.getCountry()
            if (deviceLocale == 'BR') {
                lang = 'pt-br'
            } else {
                lang = 'en-us'
            }
        }

        dispatch(switchMode(mode));
        dispatch(switchLang(lang));
        dispatch(switchAdsMode(ads));
        setLoaded(true)
    }
    
    const styles = useStyle()
    const dispatch = useDispatch()
    
    return (
        <>
            <StatusBar
                barStyle={styles.mode == 'dark' ? 'light-content' : 'dark-content'}
                backgroundColor={styles.bg}
            />
            {
                loaded ? 
                <IndexRoute onMount={() => setMounted(true)}/>
                :
                <SplashLoader/>
            }
        </>
    )
}