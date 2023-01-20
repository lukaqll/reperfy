import { NativeBaseProvider } from "native-base";
import React from "react";
import { Provider } from "react-redux";
import configureStore from './services/redux/store'
import App from "./App";

const store = configureStore()


export default function () {

    return (
        <NativeBaseProvider>
            <Provider store={store}>
                <App/>
            </Provider>
        </NativeBaseProvider>
    )
}