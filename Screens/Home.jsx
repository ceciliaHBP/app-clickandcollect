import { View, Text, Pressable, ScrollView , StyleSheet} from 'react-native'
import { defaultStyle} from '../styles/styles'
import React, {useState, useEffect }from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser, updateSelectedStore} from '../reducers/authSlice';
import ProductCard from '../components/ProductCard'
import axios from 'axios'
import Icon from 'react-native-vector-icons/MaterialIcons';

import { Badge } from 'react-native-paper';


const Home =  ({navigation}) => {

  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  console.log('user page Home', user)
  // const { firstname, lastname, adresse } = user;
  const cart = useSelector((state) => state.cart.cart);
  const selectedStore = useSelector((state) => state.auth.selectedStore);
  // console.log('selected store page home:', selectedStore)
  
  

  //total d'articles dans le panier pour le badge
  const totalQuantity = cart.reduce((total, item) => total + item.qty, 0);
  // console.log(totalQuantity);
 

  const [ selectedCategory, setSelectedCategory] = useState(null)
  const [ products, setProducts] = useState([])
  const [ categories, setCategories] = useState([])
  
  
  useEffect(() => {
    // Fonction pour récupérer les données de la base de données
    const fetchData = async () => {
      try {
        // const response = await axios.get('http://127.0.0.1:8080/getAllProducts');
        // // console.log('element', elements)
        // // console.log("response", response)
        // setProducts(response.data);
        // setCategories(response.data.map((product) => product.categorie));

      const response = await axios.get('http://127.0.0.1:8080/getAllProducts');
      const updatedProducts = response.data.map((product) => ({
        ...product,
        qty: 0, // Initial quantity set to 0
      }));
      setProducts(updatedProducts);
      setCategories([...new Set(updatedProducts.map((product) => product.categorie)), 'Tous']);
      // setCategories(updatedProducts.map((product) => product.categorie));
      } catch (error) {
        console.error('Une erreur s\'est produite :', error);
      }
    };

    fetchData(); // Appel de la fonction fetchData lors du montage du composant
  }, []);



  const categoryButtonHandler = (categorie) => {
    //  console.log(categorie)
    if ( categorie === 'Tous'){
      setSelectedCategory(null)
    } else {
      setSelectedCategory(categorie)
    }
  }
 
  const handleLogout = () => {
    dispatch(logoutUser());
    navigation.navigate('app')
  }
 

  return (
    <>
    <View style={{...defaultStyle, alignItems:'center', flex:1, paddingHorizontal:5}}>
      <View style={{flexDirection:'row', width: "100%", justifyContent:"space-around"}}>
      <View>
        <Text>Home</Text>
        
        {
          user && <Text>Bonjour {user.lastname} {user.firstname}</Text>
        }
         <Text>Point choisi: {selectedStore.nom_magasin}</Text>
        
    
      </View>
      <View style={{flexDirection:'row', gap: 10}}>
      <Badge visible={cart.length > 0} size={18} style={style.badge}>
        {totalQuantity}
      </Badge>
        <Icon name="shopping-cart" size={30} color="#000" onPress={() => navigation.navigate('panier')} style={style.container}/>
        <Icon name="logout" size={30} color="#000" onPress={() => handleLogout()} />
       
      </View>
      </View>
      

      {/* categories */}
      <View style={{flexDirection: "row", flexWrap:"wrap", justifyContent:'center', marginVertical: 20}}>
          {/* <ScrollView horizontal showsHorizontalScrollIndicator={false}> */}
          {
            categories.map((item, index) => (
              //* pressable = button on ios */
              <Pressable title="button" 
                style={{
                  borderRadius:50,
                  height:30,
                  marginVertical:5,
                  marginHorizontal:10,
                  paddingHorizontal:10,
                  justifyContent:'center',
                  alignItems:'center',
                  borderColor:'lightgray',
                  borderWidth:1,
                  backgroundColor: item.categorie === selectedCategory ? 'lightblue' : 'white'
                }} 
                key={index}
                // onPress={() => categoryButtonHandler(item.categorie)}
                onPress={() => categoryButtonHandler(item)}
              >
                {/* <Text style={{fontSize:12, }}>{item.categorie}</Text> */}
                <Text style={{fontSize:12, }}>{item}</Text>
              </Pressable>
            ))
          }
          {/* </ScrollView> */}
        </View>

          {/* card products */}
        
          <ScrollView vertical showsVerticalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', width:"100%"}}>
          {products
              .filter((item) =>
                selectedCategory ? item.categorie === selectedCategory : true
              )
              // .filter((item) => (selectedCategory === 'Tous les produits' ? true : item.categorie === selectedCategory))
 
              .map((item, index) => (
                <ProductCard
                  libelle={item.libelle}
                  key={item.id_produit}
                  id={item.id_produit}
                  index={index}
                  image={item.image}
                  prix={item.prix}
                  qty={item.qty}
                />
              ))}
              </View>
          </ScrollView>
         
    </View>
    </>
  )
}
const style = StyleSheet.create({
  container: {
    position: 'relative',
    marginRight: 10,
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: 40,
  },
});

export default Home


  // const products = [
  //   {
  //     id_produit: "1",
  //     nom:"Le parisien",
  //     prix: 10,
  //     categorie:"Sandwich",
  //     source:{ uri : require('../assets/sandwich.png')}
  //   },
  //   {
  //     id_produit: "2",
  //     nom:"Salade cesar",
  //     categorie:"Salade",
  //     prix: 6,
  //     source:{ uri : require('../assets/salade.png')}
  //   }
  // ]
 
  // const categories = [
  //   {
  //     categorie:"Sandwich",
  //     _id:"cat1",
  //   },
  //   {
  //     categorie:"Salade",
  //     _id:"cat2",
  //   },
  //   {
  //     categorie:"Desserts",
  //     _id:"cat3",
  //   },
  //   {
  //     categorie:"Boissons",
  //     _id:"cat4",
  //   },
  //   {
  //     categorie:"Tous",
  //     _id:"cat5",
  //   }
  // ]