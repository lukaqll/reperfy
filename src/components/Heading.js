import { Heading } from "native-base";
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
        <Heading
            color={styles.fontColor}
            {...props}
        >
            {renderChildren(props.children)}
        </Heading>
    )
}