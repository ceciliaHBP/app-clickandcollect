import { View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import { defaultStyle} from '../styles/styles'
import { Button } from 'react-native-paper'
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';


import { removeFromCart, updateCart } from '../reducers/cartSlice';
import CartItem from '../components/CartItem';

const Panier = ({navigation}) => {

  const dispatch = useDispatch()

  const cart = useSelector((state) => state.cart.cart);
  const user = useSelector((state) => state.auth.user)
  const store = useSelector((state) => state.auth.selectedStore)
  // console.log('cart', cart)

  const totalPrice = cart.reduce((total, item) => total + item.qty * item.prix, 0);

  const handleBack = () => {
    navigation.navigate('home');
  };
 
  const incrementhandler = (index) => {
    // console.log('plus')
    const updatedCart = [...cart]
    updatedCart[index].qty += 1
    // Dispatchez l'action pour mettre à jour le panier
    dispatch(updateCart(updatedCart))
  }
  const decrementhandler = (index) => {
    // console.log('moins');
    const updatedCart = [...cart];
    if (updatedCart[index].qty > 1) {
      updatedCart[index].qty -= 1;
      dispatch(updateCart(updatedCart));
    } else {
      dispatch(removeFromCart(updatedCart[index].id));
    }
  }

  const totalQuantity = cart.reduce((total, item) => total + item.qty, 0)

  const handleConfirm = () => {
    console.log('******')
    console.log('Contenu du panier :', cart);
    console.log('user', user)
    console.log('magasin', store)
    console.log('******')
  }
  
  return (
    
    <View style={{ ...defaultStyle, alignItems: 'center', backgroundColor: 'white', margin: 30, paddingHorizontal: 5 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
         <TouchableOpacity onPress={handleBack}>
           <Icon name="arrow-back" size={30} color="#900" />
         </TouchableOpacity>
         <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 10 }}>Mon Panier</Text>
       </View>
       <ScrollView  style={{
        marginVertical:10,
          // paddingVertical: 40,
          flex: 1,
        }}>
          {cart.map((item, index) => (
              <CartItem 
                  libelle = {item.libelle}
                  prix = {item.prix}
                  incrementhandler={() => incrementhandler(index)}
                  decrementhandler={() => decrementhandler(index)}
                  image={item.image}
                  index={index}
                  qty={item.qty}
                  key={index}
              />
            ))}
       </ScrollView>
      
        <View  style={{ marginTop:10, alignItems:'center' }} >
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
            Total des quantités : {totalQuantity}
          </Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>
            Total de la commande : {totalPrice} euros
          </Text>
          <Button 
              buttonColor='lightgray' 
              onPress={handleConfirm}
          >Confirmer ma commande</Button>
        </View>
        
    </View>

  )
  
}



export default Panier