import NetInfo from "@react-native-community/netinfo";
import { Alert } from "react-native";
import useLang from "./useLang";


function useNetConnection() {
    
    const lang = useLang()

    const checkConnection = async () => {
        const state = await NetInfo.fetch()
        return state.isConnected
    }
    
    const alertIfNotConnected = async (thowable = false, alertable = true) => {
    
        const isConnected = await checkConnection()

        const msg = lang('No internet connection')
    
        if (!isConnected) {
            if (alertable) {
                Alert.alert('Ops...', msg)
            }
            if (thowable) {
                throw msg
            }
        }

        return isConnected
    }

    return {
        checkConnection,
        alertIfNotConnected
    }
}

export default useNetConnection
