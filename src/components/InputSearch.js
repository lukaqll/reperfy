import { Box, CloseIcon, HStack, Input, SearchIcon } from "native-base";
import React from "react";

export default function (props) {

    return (
        <Input
            {...props}
            py={.5} bg='#fff' rounded='full'
            rightElement={
                <Box>
                    <HStack>
                        <SearchIcon mr={3} onPress={props?.onSearch}/> 
                        {
                            props.value?.length ? <CloseIcon mr={3} colorScheme='error' onPress={props?.onClean}/> : null
                        }
                    </HStack>
                </Box>
            }
            placeholder='Buscar'
        />
    )
}