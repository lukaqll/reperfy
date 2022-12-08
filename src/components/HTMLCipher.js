import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useStyle from "../styles";
import WebView from "react-native-webview";
import { Box } from "native-base";

export default function ({song}) {

    const styles = useStyle()

    const [chordColor, setChordColor] = useState(styles.primaryDark)

    useEffect(() => {
        getChordColor()
    }, [])

    async function getChordColor() {
        let color = await AsyncStorage.getItem('chord_color')
        setChordColor(color)
    }

    function getHtmlWithStyle() {

        return `
            <html>
                <style>
                    span {
                        color: ${chordColor || styles.warning};
                        font-weight: bold
                    }
                    pre {
                        color: ${styles.fontColor};
                        line-height: 1.5
                    }
                </style>
                ${song.cipher || '<span>Nenhuma cifra</span>'}
            </html>
        `
    }

    return (
        <Box h='100%' w='100%'>
            <WebView
                source={{html: getHtmlWithStyle()}}
                style={{backgroundColor: styles.bgDark, flex: 1, height: '100%'}}
                scalesPageToFit={Platform.OS == 'adnroid'}
                nestedScrollEnabled={false}
                scrollEnabled={false}
                overScrollMode='content'
            />
        </Box>
    )
}