import { View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import React, {useState} from 'react'
import { defaultStyle, inputStyling } from '../styles/styles'
import { Button, TextInput } from 'react-native-paper'
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { useDispatch, useSelector} from 'react-redux'
import { loginUser, updateSelectedStore } from '../reducers/authSlice';

import axios from 'axios'

//options des input
const inputOptions = {
    style:inputStyling,
    mode:"outlined",
}


const Login = ({navigation}) => {

    const dispatch = useDispatch()
   

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const submitHandler = async () => {

        const clientData = {
            email,
            password
        }

        try{
            //appel axios pour se loger
            const res = await axios.post('http://localhost:8080/login', clientData)
            const user = res.data.user
            const selectedStoreId = user.id_magasin;
            // console.log('user page login', user)
            // console.log('user selectedstore page login', selectedStoreId)

            axios.get(`http://localhost:8080/getOneStore/${selectedStoreId}`)
                .then(storeResponse => {
                    const selectedStore = storeResponse.data; // Récupérez les détails du magasin choisi
                    console.log('store selectionnés' ,selectedStore)
                    // Dispatchez l'action pour mettre à jour le magasin choisi dans le store
                     dispatch(updateSelectedStore(selectedStore));
                     console.log('store selectionnés après dispatch Login.jsx' ,selectedStore)
                    // Continuez avec la navigation vers la page appropriée de votre application
                    
                    dispatch(loginUser(user))
                  
                    console.log("user in Login.jsx", user)
                    navigation.navigate('home')
                    //champs de connexion vide (une fois connecté)
                    //setEmail('');
                    //setPassword('');
                })
                .catch(error => {
                    console.error('Erreur lors de la récupération des informations du magasin:', error);
                });
  
           
        }catch (error){
            console.log(error)
        }
    }
    
  return (
    <View style={defaultStyle}>
        {/* <TouchableOpacity  onPress={() => navigation.navigate('signup') }>
          <MaterialIcons name="arrow-back" />
        </TouchableOpacity> */}
      
      <View style={style.container}>
            <Text style={style.title}>Le pain du Jour</Text>
            <TextInput
                {...inputOptions} 
                placeholder='Email' 
                keyboardType='email-address'
                value={email} 
                onChangeText={setEmail}
            />
            <TextInput 
                {...inputOptions} 
                placeholder='Mot de passe' 
                secureTextEntry={true}
                value={password} 
                onChangeText={setPassword}
                
            />
            <Button
                style={style.btn} 
                textColor={'white'} 
                //inactif si email ou password vide
                disabled={email === "" || password === ""}
                onPress={submitHandler}
                >
                SE CONNECTER
            </Button>

            <Text style ={{textAlign:'center'}}>Pas encore de compte ?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('signup')}>
                <Text style={style.signup}>S'enregistrer</Text>
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
        // marginBottom:70,
        backgroundColor:'white', 
        borderRadius:10,
    },
    title:{
        textAlign:'center',
        margin: 20,
    },
    btn: {
        backgroundColor: 'red',
        margin: 20,
        padding: 6,
      },
    signup:{
        textAlign:'center',
        color:'red',
        fontWeight:'bold',
        marginVertical:10
    }
})

export default Login