import { Box, CloseIcon, HStack, SearchIcon, Spinner } from "native-base";
import Input from './Input'
import React from "react";
import useStyle from "../styles";

export default function (props) {

    const styles = useStyle()

    return (
        <Input
            py={1}
            rightElement={
                <Box>
                    <HStack alignItems='center'>
                        {
                            props.value?.length ? <CloseIcon mr={4} colorScheme='error' onPress={props?.onClean}/> : null
                        }
                        {
                            props.loading ? <Spinner mr={4} color={styles.primary} size={21}/> : <SearchIcon mr={4} onPress={props?.onSearch} size={21}/>
                        }
                    </HStack>
                </Box>
            }
            placeholder='Buscar'
            {...props}
        />
    )
}