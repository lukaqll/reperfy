import { FormControl, Input } from "native-base";
import React from "react";
import styles from "../styles";

export default function(props) {

    return (
        <FormControl color={styles.labelColor}>
            {
                !!props.label ?
                <FormControl.Label _text={{color: styles.labelColor}}>
                    {props.label}
                </FormControl.Label> : null
            }
            <Input
                rounded='full'
                shadow={1}
                _focus={{
                    borderColor: styles.primary, 
                    borderWidth: 1, 
                    backgroundColor: styles.bgInput
                }}
                bg={styles.bgInput}
                borderWidth={0}
                {...props}
            />
        </FormControl>
    )
}