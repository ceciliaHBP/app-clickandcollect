import { View, Text } from 'react-native'
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Signup from './Screens/Signup'
import App from './Screens/App'
import Login from './Screens/Login'
import Home from './Screens/Home'
import Panier from './Screens/Panier'
import Stores from './Screens/Stores'
import OrderConfirmation from './Screens/OrderConfirmation'
import ChoixPaiement from './Screens/ChoixPaiement'
import  Toast  from 'react-native-toast-message'



const Main = () => {

    const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
        <Stack.Navigator initialRouteName='app' screenOptions={{headerShown:false}}>
            <Stack.Screen name="app" component={App}/>
            <Stack.Screen name="login" component={Login}/>
            <Stack.Screen name="signup" component={Signup}/>
            <Stack.Screen name="stores" component={Stores}/>
            <Stack.Screen name="home" component={Home}/>
            <Stack.Screen name="panier" component={Panier}/>
            <Stack.Screen name="choixpaiement" component={ChoixPaiement}/>
            <Stack.Screen name="orderconfirm" component={OrderConfirmation}/> 
        </Stack.Navigator>

        <Toast  position="bottom"/>
    </NavigationContainer>
  )
}

export default Main