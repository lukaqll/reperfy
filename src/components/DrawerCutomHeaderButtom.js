import { useNavigation } from "@react-navigation/native";
import { Box, HamburgerIcon, HStack, IconButton } from "native-base";
import React from "react";
import useStyle from "../styles";
import Heading from "./Heading";

export default function () {

    const navigation = useNavigation()
    const styles = useStyle()

    return (
        <IconButton 
            onPress={navigation.toggleDrawer} rounded='full' _pressed={{backgroundColor: styles.primary+'11'}}
            icon={<HamburgerIcon color={styles.primary} size={25}/>}
        />
    )
}