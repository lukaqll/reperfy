import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import AddRepertory from "../pages/AddRepertory";
import AddSong from "../pages/AddSong";
import CipherView from "../pages/CipherView";
import Home from "../pages/Home"
import Repertoires from "../pages/Repertoires";
import RepertoryView from "../pages/RepertoryView";
import Songs from "../pages/Songs";
import styles from "../styles";
import {Text} from 'native-base'

const Stack = createNativeStackNavigator()

const IndexRoute = function () {

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Repertoires"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: styles.primary,
                        justifyContent: 'center',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    contentStyle: {
                        backgroundColor: styles.bgLight,
                    },
                }}
                options={{
                    Component: () => <Text>a</Text>
                }}
            >
                <Stack.Screen
                    name='Home'
                    component={Home}
                    options={{ title: 'Início' }}

                />
                <Stack.Screen
                    name='Songs'
                    component={Songs}
                    options={{title: 'Músicas'}}
                />
                <Stack.Screen
                    name='AddSong'
                    component={AddSong}
                    options={{title: 'Nova Música'}}
                />

                <Stack.Screen
                    name='Repertoires'
                    component={Repertoires}
                    options={{title: 'Repertórios'}}
                />
                <Stack.Screen
                    name='AddRepertory'
                    component={AddRepertory}
                    options={{title: 'Novo Repertório'}}
                />
                
                <Stack.Screen
                    name='CipherView'
                    component={CipherView}
                    options={{title: ''}}
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