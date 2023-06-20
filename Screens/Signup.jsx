import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState} from 'react'
import { Button, TextInput } from 'react-native-paper' 
import axios from 'axios'
import { defaultStyle, inputStyling } from '../styles/styles'
import { registerUser } from '../reducers/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import {Toast} from 'react-native-toast-message/lib/src/Toast';

import { validateLastName, validateFirstName, validateEmail, validatePassword} from '../validation/validationInput'

const inputOptions = {
    style:inputStyling,
    mode:"outlined",
}


const Signup = ({navigation}) => {

  const dispatch = useDispatch()
  const selectedStore = useSelector((state) => state.auth.selectedStore);

  const [lastname, setLastName] = useState('')
  const [firstname, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState({lastname: '', firstname: '', email: '', password: ''});

  const  submitHandler = () => {

    const clientData = {
      lastname,
      firstname,
      email,
      password,
      //modif ici id_magasin : null au lieu de '' (vide)
      storeId: selectedStore ? selectedStore.storeId : null,
    }
    //appel axios post pour s'enregister
    axios.post('http://localhost:8080/signup', clientData)
    .then(response => {
      // console.log('client data', clientData)
       console.log('response.data', response.data)
      
     
      const userId = response.data.id
      const user = { userId:userId ,firstname, lastname, email, password}; // Récupérez les données d'inscription du formulaire
       
      console.log('user avec id', user)
      dispatch(registerUser(user)); // Dispatchez l'action pour mettre à jour l'utilisateur dans le store
      //  console.log('user dans signup', user)
      
       navigation.navigate('stores')
       return Toast.show({
        type: 'success',
        text1: `Inscription validée`,
        text2: `Bienvenue ${user.firstname} ${user.lastname} ` 
      });
    })
    .catch(function (error) {
    console.log('erreur signup',error);
    if (error.response && error.response.status === 400) {
      console.log(error.response.data.error);
      Toast.show({
        type: 'error',
        text1: `Erreur d'inscription`,
        text2: error.response.data.error[0].message 
      });
    }
    // console.log(clientData)
    });
   
    // console.log('test')
  }

  return (
    <View style={defaultStyle}>

      
      <View style={style.container}>
      <Text style={style.title}>Veuillez renseigner les différents champs pour créer votre compte</Text>
      <TextInput 
       {...inputOptions}
        placeholder='Nom'
        keyboardType='default'
        value={lastname}
        // onChangeText={setLastName}
        onChangeText={(value) => {
          setLastName(value);
          setError({...error, lastname: validateLastName(value)});
        }}
        style={error.lastname ? {...inputOptions.style, borderColor: 'red'} : inputOptions.style}
      />
      {error.lastname ? <Text style={{color: 'red', textAlign:'center'}}>{error.lastname}</Text> : null}

      <TextInput 
        {...inputOptions}
        placeholder='Prénom'
        keyboardType='default'
        value={firstname}
        // onChangeText={setFirstName}
        onChangeText={(value) => {
          setFirstName(value);
          setError({...error, firstname: validateFirstName(value)});
        }}
        style={error.firstname ? {...inputOptions.style, borderColor: 'red'} : inputOptions.style}
      />
      {error.firstname ? <Text style={{color: 'red', textAlign:'center'}}>{error.firstname}</Text> : null}

      <TextInput 
        {...inputOptions}
        placeholder='Email'
        keyboardType='email-address'
        value={email}
        // onChangeText={setEmail}
        onChangeText={(value) => {
          setEmail(value);
          setError({...error, email: validateEmail(value)});
        }}
        style={error.email ? {...inputOptions.style, borderColor: 'red'} : inputOptions.style}
      />
       {error.email ? <Text style={{color: 'red', textAlign:'center'}}>{error.email}</Text> : null}
    
      <TextInput 
        {...inputOptions}
        placeholder='Mot de passe'
        secureTextEntry={true}
        value={password}
        // onChangeText={setPassword}
        onChangeText={(value) => {
          setPassword(value);
          setError({...error, password: validatePassword(value)});
        }}
        style={error.password ? {...inputOptions.style, borderColor: 'red'} : inputOptions.style}
      />
      {error.password ? <Text style={{color: 'red', textAlign:'center'}}>{error.password}</Text> : null}

      <Button
                style={style.btn} 
                textColor={'white'} 
                disabled={lastname === "" || firstname === ""||  email === "" ||  password === "" }
                onPress={() => {
                    submitHandler()
                }}
                >
            S'INSCRIRE
            </Button>

            <Text style ={{textAlign:'center'}}>Déja un compte ?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('login')}>
                <Text style={style.login}>Se Connecter</Text>
            </TouchableOpacity>
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
        // marginBottom:70
        backgroundColor:'white'
    },
  inputOpts : {
    height:50,
    marginHorizontal:20,
    marginVertical:10,
  },
  btn: {
    backgroundColor: 'red',
    margin: 20,
    padding: 6,
  },
  title:{
    textAlign:'center',
    fontWeight:'bold',
    marginVertical:20
  },
  login:{
    textAlign:'center',
    color:'red',
    fontWeight:'bold',
    marginVertical:10
}
})

export default Signup