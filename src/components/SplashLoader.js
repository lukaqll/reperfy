import { Box, Center, HStack, Image, Spinner, VStack } from "native-base";
import React from "react";
import LinearGradient from "react-native-linear-gradient";
import useStyle from "../styles";

export default function () {
    
    const styles = useStyle()
    const img = require('../assets/icons/logo_full_slogan_white.png')

    return (
        <>
        
            <LinearGradient
                colors={[styles.primary, styles.primaryDark]} 
                style={{width: '100%', height: '100%', flex: 1}}
            >
                <VStack alignItems='center' h='100%' justifyContent='center' top={-50}>
                    <Center w='100%'>
                        <Box w='100%' h={24}>
                            <Image
                                source={img} alt='logo'
                                resizeMode='contain' size='100%'
                            />
                        </Box>
                    </Center>
                    <Spinner color='#FFF' mt={10} size={30}/>
                </VStack>
            </LinearGradient>
        </>
    )
}