import { Button } from "native-base";
import React from "react";
import styles from "../styles";

export default function(props) {

    return (
        <Button
            rounded='full'
            shadow={3}
            bg={styles.primary}
            _pressed={{
                backgroundColor: `${props.bg || styles.primary}aa`
            }}
            {...props}
        >
            {props.children}
        </Button>
    )
}