import { View, Text, StyleSheet} from 'react-native'
import React from 'react'
import { Button} from 'react-native-paper'
import { defaultStyle, colors, fonts } from '../styles/styles'


const App = ({navigation}) => {

    const navigationToSignUp = () => {
        navigation.navigate('signup')
    }
    const navigationToLogin = () => {
        navigation.navigate('login')
    }
  return (
    <View style={{...defaultStyle, backgroundColor:colors.color1}}>
    
      <View style={style.container}>

        <Text style={style.title}>Le pain du jour</Text>
     
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
        backgroundColor: colors.color2,
        margin: 5,
        padding: 6,
        borderRadius:6,
      },
    title:{
        fontFamily: fonts.font1,
        textAlign:'center',
        fontSize:26,
        color: colors.color3
    }
})

export default App