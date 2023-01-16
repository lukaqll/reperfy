import React from "react";

import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import Repertoires from "../pages/Repertoires";
import useStyle from "../styles";
import { HamburgerIcon, IconButton } from "native-base";
import DrawerCutomHeaderButtom from "../components/DrawerCutomHeaderButtom";
import Songs from "../pages/Songs";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Octicons from "react-native-vector-icons/Octicons";
import Configs from "../pages/Configs";
import SongSearch from "../pages/SongSearch";
import useLang from "../utils/useLang";
import PlusHeaderIcon from "../components/PlusHeaderIcon";

const Drawer = createDrawerNavigator();
export default function ({navigation}) {

    const styles = useStyle()
    const lang = useLang()

    return (
        <Drawer.Navigator 
            initialRouteName="Repertoires"
            screenOptions={{
                headerTransparent: true,
                headerTintColor: styles.fontColor,
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                sceneContainerStyle: {
                    backgroundColor: styles.bgLight,
                    // paddingTop: 50
                },
                headerLeft: () => <DrawerCutomHeaderButtom/>,
                drawerStyle: {
                    backgroundColor: styles.bg
                },
                drawerActiveTintColor: styles.primary,
                drawerInactiveTintColor: styles.fontColor
            }}
        >

            <Drawer.Screen
                name='Repertoires'
                component={Repertoires}
                options={{
                    title: lang('Repertoires'), 
                    drawerIcon: (props) => <Icon name='playlist-play' {...props} />,
                    headerRight: () => <PlusHeaderIcon onPress={() => navigation.navigate('AddRepertory')}/>
            }}
            />
            <Drawer.Screen
                name='Songs'
                component={Songs}
                options={{
                    title: lang('Songs'), 
                    drawerIcon: (props) => <Icon name='folder-music-outline' {...props}/>,
                    headerRight: () => <PlusHeaderIcon onPress={() => navigation.navigate('AddSong')}/>
                }}
            />
            <Drawer.Screen
                name='SongSearch'
                component={SongSearch}
                options={{
                    title: lang('Web Search'), 
                    drawerIcon: (props) => <Octicons name='search' {...props}/>
                }}
            />
            <Drawer.Screen
                name='Configs'
                component={Configs}
                options={{title: lang('Settings'), drawerIcon: (props) => <Octicons name='gear' {...props}/>}}
            />
        </Drawer.Navigator>
    )
}