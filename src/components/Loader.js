import { Box, Spinner } from "native-base";
import React from "react";
import { Dimensions } from "react-native";
import useStyle from "../styles";


function Loader (props) {

    const styles = useStyle()
    const {height, width} = Dimensions.get('window')

    return (
        props.loading ?
        <Box 
            position='absolute' 
            bg='#00000033'
            w={width} h={height}
            alignItems='center' 
            justifyContent='center'
        >

            <Spinner
                size={50}
                color={styles.primary}
            />
        </Box>
        : null
    )
}


export default Loader