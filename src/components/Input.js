import { FormControl, Input as DefaultInput } from "native-base";
import React from "react";
import useStyle from "../styles";
import useLang from "../utils/useLang";

const Input = function(props, ref) {

    const styles = useStyle()
    const lang = useLang()

    return (
        <FormControl color={styles.labelColor}>
            {
                !!props.label ?
                <FormControl.Label _text={{color: styles.labelColor}}>
                    {lang(props.label)}
                </FormControl.Label> : null
            }
            <DefaultInput 
                rounded='full'
                shadow={1}
                color={styles.fontColor}
                fontSize={15}
                _focus={{
                    borderColor: styles.primary, 
                    borderWidth: 1, 
                    backgroundColor: styles.bgInput,
                    selectionColor: styles.primary

                }}
                selectionColor={styles.primary}
                bg={styles.bgInput}
                borderWidth={1}
                borderColor={styles.bgInput}
                {...props}
                ref={ref}
                placeholder={lang(props.placeholder)}
            />
        </FormControl>
    )
}

export default React.forwardRef(Input)