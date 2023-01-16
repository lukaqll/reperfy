import { useNavigation } from "@react-navigation/native";
import { Box, ChevronLeftIcon, HamburgerIcon, HStack, IconButton } from "native-base";
import React from "react";
import useStyle from "../styles";
import Heading from "./Heading";

export default function (props) {

    const navigation = useNavigation()
    const styles = useStyle()

    return (
        <Box>
            {
                props.canGoBack ?
                <IconButton 
                    onPress={navigation.goBack} 
                    rounded='full' 
                    _pressed={{backgroundColor: styles.primary+'11'}}
                    ml={-2} mr={2}
                    icon={<ChevronLeftIcon color={styles.primary} size={21}/>}
                />
                : <></>
            }
        </Box>
    )
}