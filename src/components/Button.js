import { Button } from "native-base";
import React from "react";
import useStyle from "../styles";

export default function(props) {

    const styles = useStyle()
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