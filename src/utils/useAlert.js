import { Alert } from "react-native"
import useLang from "./useLang"

export default function useAlert() {
    
    const lang = useLang()

    const alertError = (e, generalMessage = null) => {
        if (typeof e == 'string') {
            Alert.alert(lang(e))
        } else if (e.message && typeof e.message == 'string') {
            Alert.alert(lang(e.message))
        } else {
            Alert.alert(lang(generalMessage || 'Opss... Has an error'))
        }
    }

    return {alertError}    
}