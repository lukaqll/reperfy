import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useStyle from "../styles";
import WebView from "react-native-webview";
import { Box } from "native-base";
// import HTMLView from "react-native-htmlview";
import { StyleSheet } from "react-native";

export default function ({song, options}) {

    const styles = useStyle()

    const [chordColor, setChordColor] = useState(styles.primaryDark)

    useEffect(() => {
        getChordColor()
    }, [])

    async function getChordColor() {
        let color = await AsyncStorage.getItem('chord_color')
        setChordColor(color)
    }

    function isHiddenTabs() {
        if (options && options.hiddenTabs) {
            return `
                .accordion-tabs-content {
                    display: none
                }
            `
        }
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
                    ${isHiddenTabs()}
                </style>
                ${song.cipher || '<span>Nenhuma cifra</span>'}
            </html>
        `
    }

    const style = StyleSheet.create({
        span: {
            color: chordColor || styles.warning,
            fontWeight: 'bold'
        },
        pre: {
            color: styles.fontColor,
            lineHeight: 1.5
        }
    })

    return (
        <Box h='100%' w='100%'>
            <WebView
                contentInset={50}
                source={{html: getHtmlWithStyle()}}
                style={{backgroundColor: styles.bg, flex: 1, height: '100%'}}
                scalesPageToFit={Platform.OS == 'adnroid'}
                overScrollMode='content'
            />
            {/* <HTMLView
                value={getHtmlWithStyle()}

            /> */}
        </Box>
    )
}