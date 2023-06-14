import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { defaultStyle} from '../styles/styles'
import { Button} from 'react-native-paper'
import { logoutUser} from '../reducers/authSlice';
import Icon from 'react-native-vector-icons/MaterialIcons';

const OrderConfirmation = ({navigation}) => {
  const dispatch = useDispatch()
  const user = useSelector(state => state.auth.user);
  const selectedStore = useSelector(state => state.auth.selectedStore);
  const cartItems = useSelector(state => state.cart.cart); 
//   console.log('cart items', cartItems)
  const totalPrice = cartItems.reduce((total, item) => total + item.qty * item.prix, 0);
//   console.log(totalPrice)
const totalQuantity = cartItems.reduce((total, item) => total + item.qty, 0)
// console.log('qty', totalQuantity)


const handleLogout = () => {
  dispatch(logoutUser(selectedStore));
  navigation.navigate('app')
}
const handleBack = () => {
  navigation.navigate('home');
};


//ENVOI DE LA COMMANDE VERS LE SERVER
  const submitHandler = () => {
    console.log('******')
    console.log('Envoi de la commande au serveur - test')
    console.log('Contenu du panier :', cartItems);
    console.log('Utilisateur :', user);
    console.log('Magasin sélectionné :', selectedStore);
    console.log('Prix total :', totalPrice);
    console.log('Nb de produits:', totalQuantity)
    console.log('******')
  }
 
  // Utilisez les informations récupérées pour afficher les détails de la commande
  return (
    <View style={{ ...defaultStyle, alignItems: 'center', backgroundColor: 'white', margin: 30, paddingHorizontal: 5 }}>
      <TouchableOpacity onPress={handleBack}>
           <Icon name="arrow-back" size={30} color="#900" />
         </TouchableOpacity>
      <Icon name="logout" size={30} color="#000" onPress={() => handleLogout()}/>
    <View style={styles.container}>
      <Text>Contenu du panier :</Text>
      {cartItems.map(item => (
        <View key={item.id} style={styles.itemContainer}>
          <Text>{item.libelle}</Text>
          <Text>Prix unitaire : {item.prix}</Text>
          <Text>Quantité : {item.qty}</Text>
          
        </View>
      ))}
      <View>
        <Text> Prix total: {totalPrice} euros</Text>
        <Text>Nb de produits: {totalQuantity}</Text>
      </View>
      <View style={{marginVertical:40}}>    
        <Text>Informations Client:</Text>
        <Text>Utilisateur : {user.firstname} {user.lastname}</Text>
        {
            user.adresse ? <Text>Adresse : {user.adresse}</Text> : <Text>Adresse : <Text style={{color:'lightgray', fontStyle:'italic'}}>Non renseigné</Text></Text>
        }
        {
            user.telephone ? <Text>Telephone : {user.telephone}</Text> : <Text>Telephone : <Text style={{color:'lightgray', fontStyle:'italic'}}>Non renseigné</Text></Text>
        }
        <Text>Heure de retrait (à finaliser)</Text>
        <Text>Choix de paiement: (à finaliser)</Text>
        
        <Text>Magasin : {selectedStore.nom_magasin}</Text>
      </View>
      <Button
                style={styles.btn} 
                textColor={'white'} 
                onPress={submitHandler}
                >
                VALIDER
            </Button>
      
     
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  itemContainer: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'gray',
    padding: 8,
  },
  btn: {
    backgroundColor: 'red',
    margin: 20,
    padding: 6,
  }
});

export default OrderConfirmation;
