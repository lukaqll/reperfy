import { Box, CloseIcon, HStack, SearchIcon, Spinner } from "native-base";
import Input from './Input'
import React from "react";

export default function (props) {

    return (
        <Input
            {...props}
            py={.5} bg='#fff' rounded='full'
            rightElement={
                <Box>
                    <HStack>
                        {
                            props.loading ? <Spinner mr={3}/> : <SearchIcon mr={3} onPress={props?.onSearch}/>
                        }
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