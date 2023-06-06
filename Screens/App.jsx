import { View, Text, StyleSheet} from 'react-native'
import React from 'react'
import { Button} from 'react-native-paper'
import { defaultStyle } from '../styles/styles'


const App = ({navigation}) => {

    const navigationToSignUp = () => {
        navigation.navigate('signup')
    }
    const navigationToLogin = () => {
        navigation.navigate('login')
    }
  return (
    <View style={defaultStyle}>
      <Text>Application Click and collect </Text>
      <View style={style.container}>
     
             
            
            <Button
                style={style.btn} 
                textColor={'white'} 
                onPress={navigationToSignUp}
                >

                  
            S'INSCRIRE
            </Button>
            <Button
                style={style.btn} 
                textColor={'white'} 
                
                onPress={navigationToLogin}
                >
            SE CONNECTER
            </Button>
        </View>
    </View>
  )
}
const style = StyleSheet.create({
    
    container:{
        flex:1,
        padding:20,
        justifyContent:'center',
        //reajustement margin pour laisser de la place au footer
        marginBottom:70
    },
    btn: {
        backgroundColor: 'red',
        margin: 20,
        padding: 6,
      },
})

export default App