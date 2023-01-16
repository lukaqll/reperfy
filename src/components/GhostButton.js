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
            variant='ghost'
            _pressed={{backgroundColor: '#FFFFFF00', opacity: .7}}
            colorScheme={styles.mode == 'dark' ? 'dark' : 'light'}
            {...props}
        >
            {renderChildren(props.children)}
        </Button>
    )
}