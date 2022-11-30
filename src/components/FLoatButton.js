import { IconButton } from "native-base";
import React from "react";

export default function (props)  {

    return (
        <IconButton 
            borderRadius='full'
            variant='solid'
            position='absolute'
            w={50} h={50} bottom={0} right={0} m={5}
            shadow={3}
            {...props}
        >
        </IconButton>
    )
}