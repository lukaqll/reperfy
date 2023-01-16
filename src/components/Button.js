import { Button } from "native-base";
import React from "react";
import useStyle from "../styles";
import useLang from "../utils/useLang";

export default function(props) {

    const styles = useStyle()
    const lang = useLang()

    function renderChildren (item) {
        if (typeof item == 'string')
            return lang(item)

        return item
    }

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
            {renderChildren(props.children)}
        </Button>
    )
}