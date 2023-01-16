import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "native-base";
import React, { useEffect, useState } from "react";
import { LogBox } from "react-native";
import { useDispatch } from "react-redux";
import SplashLoader from "./components/SplashLoader";
import IndexRoute from "./routes/index.route";
import { switchLang, switchMode } from "./services/redux/actions";
import Database from "./services/store/Database";
import useStyle from "./styles";


export default function () {

    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        Database.setUpDatabase()
        updateTheme()

        LogBox.ignoreLogs([
            "We can not support a function callback. See Github Issues for details https://github.com/adobe/react-spectrum/issues/2320",
        ]);
    }, [])

    async function updateTheme() {
        const mode = await AsyncStorage.getItem('theme')
        const lang = await AsyncStorage.getItem('lang')
        dispatch(switchMode(mode));
        dispatch(switchLang(lang));

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
                <IndexRoute/>
                :
                <SplashLoader/>
            }
        </>
    )
}