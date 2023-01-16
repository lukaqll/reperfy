import { AddIcon, IconButton } from "native-base";
import React from "react";
import useStyle from "../styles";

export default function ({onPress = () => {}}) {

    const styles = useStyle()

    return (
        <IconButton
            _pressed={{backgroundColor: styles.primary+'11'}}
            mr={3} rounded='full'
            icon={<AddIcon color={styles.primary} size={21}/>}
            onPress={onPress}
        />
    )
}