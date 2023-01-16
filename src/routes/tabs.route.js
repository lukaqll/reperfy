import React from "react";

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import Repertoires from "../pages/Repertoires";
import useStyle from "../styles";
import { Text } from "native-base";
import Songs from "../pages/Songs";
import Fontisto from "react-native-vector-icons/Fontisto";
import Octicons from "react-native-vector-icons/Octicons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Feather from "react-native-vector-icons/Feather";
import Configs from "../pages/Configs";
import SongSearch from "../pages/SongSearch";
import useLang from "../utils/useLang";
import PlusHeaderIcon from "../components/PlusHeaderIcon";
import { CleanTabBar } from 'react-navigation-tabbar-collection';
import HeaderLogo from "../components/HeaderLogo";

const Tabs = createBottomTabNavigator();
export default function ({navigation}) {

    const styles = useStyle()
    const lang = useLang()
    const iconSize = 20

    return (
        <Tabs.Navigator 
            initialRouteName="Repertoires"
            tabBar={(props) => (
                <CleanTabBar 
                    {...props}  
                    colorPalette={{
                        dark: styles.bg,
                        light: styles.fontColor
                    }}
                    darkMode={true}
                />
            )}
            screenOptions={{
                headerTransparent: true,
                headerTintColor: styles.fontColor,
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                tabBarShowLabel: false,
                tabBarActiveTintColor: styles.primary,
                labelStyle: {
                    fontSize: 12
                },     
                headerTitleAlign: 'center',
                headerTitle: () => <HeaderLogo onPress={() => navigation.navigate('Repertoires')}/>,
            }}    
        >

            <Tabs.Screen
                name='Repertoires'
                component={Repertoires}
                options={{
                    title: lang('Repertoires'), 
                    tabBarIcon: (props) => <Octicons name='home' {...props} size={iconSize} />,
                    headerRight: () => <PlusHeaderIcon onPress={() => navigation.navigate('AddRepertory')}/>,
                }}
            />
            <Tabs.Screen
                name='Songs'
                component={Songs}
                options={{
                    title: lang('Songs'), 
                    tabBarIcon: (props) => <Fontisto name='applemusic' {...props} size={iconSize} />,
                    headerRight: () => <PlusHeaderIcon onPress={() => navigation.navigate('AddSong')}/>
                }}
            />
            <Tabs.Screen
                name='SongSearch'
                component={SongSearch}
                options={{
                    title: lang('Web Search'), 
                    tabBarIcon: (props) => <Octicons name='search' {...props} size={iconSize} />
                }}
            />
            <Tabs.Screen
                name='Configs'
                component={Configs}
                options={{
                    title: lang('Settings'), 
                    tabBarIcon: (props) => <Feather name='settings' {...props} size={iconSize} />
                }}
            />
        </Tabs.Navigator>
    )
}