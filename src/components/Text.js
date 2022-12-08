import { Text } from "native-base";
import React from "react";
import useStyle from "../styles";

export default function(props) {

    const styles = useStyle()

    return (
        <Text
            color={styles.fontColor}
            {...props}
        >
            {props.children}
        </Text>
    )
}