import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Button, RadioButton} from 'react-native-paper' 
import { defaultStyle} from '../styles/styles'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux';
import { addPaiement} from '../reducers/cartSlice';

const ChoixPaiement = ({navigation}) => {
  
    const choixpaiement = useSelector((state) => state.cart.paiement)
    // console.log('choix paiement:', choixpaiement)

    const [paiement, setPaiement] = useState('')

    const submitHandlerPaiement = (value) => {
        setPaiement(value);
        console.log('paiement', value);
    }

  return (
    <View style={defaultStyle}>
        <View style={style.container}>

            <Text>Veuillez choisir votre choix de paiement </Text>

            
            <Button  
            style={style.btn}
            textColor='white'
            value="online"
            onPress={() => submitHandlerPaiement('online')}>
                En ligne</Button>

                <Button  
            style={style.btn}
            textColor='white'
            value="online"
            onPress={() => submitHandlerPaiement('onsite')}>
               Sur Place</Button>


        </View>
        
    </View>
  );
};


const style = StyleSheet.create({
container: {
    height:"100%",
    justifyContent:'center', 
    alignItems:'center',
    gap: 20,
},
touchable:{
    backgroundColor:'gray',
    paddingVertical:15,
    paddingHorizontal:25,
    borderRadius:15,
    alignItems:'center',
    justifyContent:'center'
},
text:{
    color:'white'
},
btn: {
    backgroundColor: 'red',
    margin: 20,
    padding: 6,
  },
selection: {
    justifyContent:'center', 
    alignItems:'center'
}
})

export default ChoixPaiement;
