import { Heading } from "native-base";
import React from "react";
import useStyle from "../styles";

export default function(props) {

    const styles = useStyle()
    return (
        <Heading
            color={styles.fontColor}
            {...props}
        >
            {props.children}
        </Heading>
    )
}