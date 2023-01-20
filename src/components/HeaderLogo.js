import { Box, Image, Pressable } from "native-base";
import React from "react";

export default function ({onPress=() => {}}) {

    const img = require('../assets/icons/logo_full_primary.png')

    return (
        <Box ml={-4}>
            <Pressable onPress={onPress} _pressed={{opacity: .7}}>
                <Image
                    alignSelf='center'
                    source={img} alt='logo'
                    resizeMode='contain'
                    width={110} height={50}
                />
            </Pressable>
        </Box>
    )
}