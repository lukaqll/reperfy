import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddRepertory from "../pages/AddRepertory";
import AddRepertorySongs from "../pages/AddRepertorySongs";
import AddSong from "../pages/AddSong";
import CipherView from "../pages/CipherView";
import Home from "../pages/Home"
import Repertoires from "../pages/Repertoires";
import RepertoryView from "../pages/RepertoryView";
import Songs from "../pages/Songs";
import { switchMode } from "../services/redux/actions";
import useStyle from "../styles";
import DrawerRoute from "./drawer.route";

const Stack = createNativeStackNavigator()


const IndexRoute = function () {
    
    const styles = useStyle()

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Repertoires"
                screenOptions={{
                    headerTransparent: true,
                    headerTintColor: styles.fontColor,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    contentStyle: {
                        backgroundColor: styles.bgLight
                    },
                    animation: 'slide_from_right'
                }}
            >
                <Stack.Screen
                    name='Drawer'
                    component={DrawerRoute}
                    options={{
                        headerShown: false,
                        contentStyle: {
                            paddingTop: 0
                        }
                    }}
                />
                
                <Stack.Screen
                    name='Home'
                    component={Home}
                    options={{ title: 'Início' }}

                />

                <Stack.Screen
                    name='AddSong'
                    component={AddSong}
                    options={{title: 'Nova Música'}}
                />

                <Stack.Screen
                    name='AddRepertory'
                    component={AddRepertory}
                    options={{title: 'Novo Repertório'}}
                />
                <Stack.Screen
                    name='AddRepertorySongs'
                    component={AddRepertorySongs}
                    options={{title: 'Editar Repertório'}}
                />
                
                <Stack.Screen
                    name='CipherView'
                    component={CipherView}
                    options={{title: '', contentStyle: {backgroundColor: styles.bgDark}}}
                />

                <Stack.Screen
                    name='RepertoryView'
                    component={RepertoryView}
                    options={{title: ''}}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default IndexRoute