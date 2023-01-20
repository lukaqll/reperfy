import { BannerAd, BannerAdSize } from "@react-native-admob/admob";
import React from "react";
import { View } from "native-base";
import { useSelector } from "react-redux";

const Banner = ({size = 'adaptative', style = {}}) => {

    const selector = useSelector(st => st.theme)

    if (selector.ads != '1')
        return null
    
    const sizes = {
        adaptative: BannerAdSize.ADAPTIVE_BANNER,
        retangle: BannerAdSize.MEDIUM_RECTANGLE,
    }
    return (
        <BannerAd
            unitId="ca-app-pub-5665151708535420/9708485970"
            // unitId="ca-app-pub-3940256099942544/6300978111"
            size={sizes[size]}
            
            requestOptions={{
                requestNonPersonalizedAdsOnly: false
            }}
            style={style}
        />
    )
}

export default Banner