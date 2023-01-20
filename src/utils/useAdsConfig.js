import { useDispatch, useSelector } from "react-redux";
import { switchAdsMode } from "../services/redux/actions";
import AsyncStorage from "@react-native-async-storage/async-storage";

function useAdsConfig () {

    // const theme = useSelector(state => state.theme)
    const dispatch = useDispatch()

    const updateMode = (mode = '1') => {
        dispatch(switchAdsMode(mode))
        AsyncStorage.setItem('ads', mode)
    }


    const getAds = async () => {
        const mode = await AsyncStorage.getItem('ads')
        if (mode == '1') {
            updateMode('1')
            return true
        }

        updateMode('0')
        return false
    }

    return {updateMode, getAds}
}

export default useAdsConfig