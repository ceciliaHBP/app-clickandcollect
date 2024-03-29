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
import SuccessPage from './Screens/SuccessPage'
import EchecPage from './Screens/EchecPage'



const Main = () => {


const linking = {
  prefixes: ['clickandcollect://'],
  config: {
    screens: {
      success: 'success',
      echec: 'echec',
      // Ajoutez d'autres routes ici
    },
  },
};
  

    const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer linking={linking}>
        <Stack.Navigator initialRouteName='app' screenOptions={{headerShown:false}}>
            <Stack.Screen name="app" component={App}/>
            <Stack.Screen name="login" component={Login}/>
            <Stack.Screen name="signup" component={Signup}/>
            <Stack.Screen name="stores" component={Stores}/>
            <Stack.Screen name="home" component={Home}/>
            <Stack.Screen name="panier" component={Panier}/>
            <Stack.Screen name="choixpaiement" component={ChoixPaiement}/>
            <Stack.Screen name="orderconfirm" component={OrderConfirmation}/> 
            <Stack.Screen name="success" component={SuccessPage}/> 
            <Stack.Screen name="echec" component={EchecPage}/> 
        </Stack.Navigator>

        <Toast  position="bottom"/>
    </NavigationContainer>
  )
}

export default Main