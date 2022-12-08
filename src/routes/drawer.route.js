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

const Drawer = createDrawerNavigator();
export default function () {

    const styles = useStyle()

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
                    backgroundColor: styles.bgDark
                },
                drawerActiveTintColor: styles.primary,
                drawerInactiveTintColor: styles.fontColor
            }}
        >

            <Drawer.Screen
                name='Repertoires'
                component={Repertoires}
                options={{title: 'Repertórios', drawerIcon: (props) => <Icon name='playlist-play' {...props} />}}
            />
            <Drawer.Screen
                name='Songs'
                component={Songs}
                options={{title: 'Músicas', drawerIcon: (props) => <Icon name='folder-music-outline' {...props}/>}}
            />
            <Drawer.Screen
                name='Configs'
                component={Configs}
                options={{title: 'Configurações', drawerIcon: (props) => <Octicons name='gear' {...props}/>}}
            />
        </Drawer.Navigator>
    )
}