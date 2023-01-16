import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ChevronLeftIcon, IconButton, Text } from "native-base";
import React from "react";
import CutomHeaderBackButtom from "../components/CustomHeaderBackButtom";
import AddRepertory from "../pages/AddRepertory";
import AddRepertorySongs from "../pages/AddRepertorySongs";
import AddSong from "../pages/AddSong";
import CipherView from "../pages/CipherView";
import RepertoryView from "../pages/RepertoryView";
import useStyle from "../styles";
import useLang from "../utils/useLang";
import DrawerRoute from "./drawer.route";
import TabsRoute from "./tabs.route";

const Stack = createNativeStackNavigator()


const IndexRoute = function (props) {
    
    const styles = useStyle()
    const lang = useLang()
    // let navigation = useNavigation()

    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="TabsRoute"
                screenOptions={{
                    headerTransparent: true,
                    headerTintColor: styles.fontColor,
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    contentStyle: {
                        backgroundColor: styles.bgLight
                    },
                    animation: 'slide_from_right',
                    headerLeft: (props) => <CutomHeaderBackButtom {...props}/>
                }}
            >
                {/* <Stack.Screen
                    name='Drawer'
                    component={DrawerRoute}
                    options={{
                        headerShown: false,
                        contentStyle: {
                            paddingTop: 0
                        }
                    }}
                /> */}

                <Stack.Screen
                    name='TabsRoute'
                    component={TabsRoute}
                    options={{
                        headerShown: false,
                        contentStyle: {
                            paddingTop: 0
                        }
                    }}
                />
                
                <Stack.Screen
                    name='AddSong'
                    component={AddSong}
                    options={{title: lang('New Song')}}
                />

                <Stack.Screen
                    name='AddRepertory'
                    component={AddRepertory}
                    options={{title: lang('New Repertoire')}}
                />
                <Stack.Screen
                    name='AddRepertorySongs'
                    component={AddRepertorySongs}
                    options={{title: ''}}
                />
                
                <Stack.Screen
                    name='CipherView'
                    component={CipherView}
                    options={{title: '', contentStyle: {backgroundColor: styles.bg}}}
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