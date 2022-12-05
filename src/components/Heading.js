import { Heading } from "native-base";
import React from "react";
import styles from "../styles";

export default function(props) {

    return (
        <Heading
            color={styles.fontColor}
            {...props}
        >
            {props.children}
        </Heading>
    )
}