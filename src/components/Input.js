import { FormControl, Input } from "native-base";
import React from "react";
import useStyle from "../styles";

export default function(props) {

    const styles = useStyle()

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
                color={styles.fontColor}
                fontSize={15}
                _focus={{
                    borderColor: styles.primary, 
                    borderWidth: 1, 
                    backgroundColor: styles.bgInput,
                }}
                cursorColor={styles.primary}
                bg={styles.bgInput}
                borderWidth={1}
                borderColor={styles.bgInput}
                {...props}
            />
        </FormControl>
    )
}