import { Button, Input } from "native-base";
import React from "react";
import styles from "../styles";

export default function(props) {

    return (
        <Input
            rounded='full'
            _focus={{borderColor: styles.primary}}
            bg='#fff'
            {...props}
        />
    )
}