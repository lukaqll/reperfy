import React from "react";
import { StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import useStyle from "../styles";
import Text from "./Text";

export default function (props) {

    const styles = useStyle()

    const style = StyleSheet.create({
        base: {
            paddingTop: 50,
            width: '100%',
            height: '100%'
        }
    })
    return (
        <LinearGradient colors={[styles.bg, styles.bg]} style={style.base}>
            {props.children}
        </LinearGradient>
    )
}