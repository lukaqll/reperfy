import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "native-base";
import React, { useEffect } from "react";
import { LogBox } from "react-native";
import { useDispatch } from "react-redux";
import IndexRoute from "./routes/index.route";
import { switchMode } from "./services/redux/actions";
import Database from "./services/store/Database";
import useStyle from "./styles";


export default function () {

    useEffect(() => {
        Database.setUpDatabase()
        updateTheme()

        LogBox.ignoreLogs([
            "We can not support a function callback. See Github Issues for details https://github.com/adobe/react-spectrum/issues/2320",
        ]);
    }, [])

    function updateTheme() {
        AsyncStorage.getItem('theme').then(mode => {
            if (mode) {
                dispatch(switchMode(mode));
            }
        })
    }
    
    const styles = useStyle()
    const dispatch = useDispatch()
    
    return (
        <>
            <StatusBar
                barStyle='light-content'
                backgroundColor={styles.primary}
            />
            <IndexRoute/>
        </>
    )
}