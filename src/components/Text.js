import { Text } from "native-base";
import React from "react";
import styles from "../styles";

export default function(props) {

    return (
        <Text
            color={styles.fontColor}
            {...props}
        >
            {props.children}
        </Text>
    )
}