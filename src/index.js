import { Heading, NativeBaseProvider, StatusBar } from "native-base";
import React, { useEffect } from "react";
import { LogBox } from "react-native";
import IndexRoute from "./routes/index.route";
import Database from "./services/store/Database";
import styles from "./styles";

export default function () {
    
    useEffect(() => {
        Database.setUpDatabase()

        LogBox.ignoreLogs([
            "We can not support a function callback. See Github Issues for details https://github.com/adobe/react-spectrum/issues/2320",
        ]);
    }, [])
    
    return (
        <NativeBaseProvider>
            <StatusBar
                barStyle='light-content'
                backgroundColor={styles.primaryDark}
            />
            <IndexRoute/>
        </NativeBaseProvider>
    )
}