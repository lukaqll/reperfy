import { Box, Center, HStack, Image, Pressable, VStack } from "native-base";
import React from "react";
import { SvgUri } from "react-native-svg";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import useStyle from "../styles";
import Heading from "./Heading";
import Text from "./Text";

export default function ({song, onPress=() => {}}) {

    if (!song || !song.TITULO)
        return null

    const styles = useStyle()
    
    return (
        <Pressable
            _pressed={{opacity: .7}}
            onPress={() => onPress(song)}
        >
            <HStack space={2} alignItems='center'>
                {
                    song.AVATAR && song.AVATAR.match(/.jpg|.png|.jpeg|.webp$/g) ?
                    <Image src={song.AVATAR} alt='.' size='xs' rounded='md'/> : 
                    <Center w={39.9} h={39.9} bg='#eee' rounded='md'>
                        <Icon name='music-box-multiple' color='#222' size={30}/>
                    </Center>
                }
                <VStack>
                    <Heading fontSize='sm' color={styles.fontColor}>{song.TITULO}</Heading>
                    <Text fontSize='xs' color={styles.fontColor}>{song.ARTISTA}</Text>
                </VStack>
            </HStack>
        </Pressable>
    )
}