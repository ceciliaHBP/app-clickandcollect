import { View, Text, Pressable, ScrollView , StyleSheet, Button } from 'react-native'
 import  Picker  from 'react-native-picker-select';
import { defaultStyle} from '../styles/styles'
import React, {useState, useEffect }from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser, updateSelectedStore, updateUser} from '../reducers/authSlice';
import { addDate} from '../reducers/cartSlice';
import ProductCard from '../components/ProductCard'
import axios from 'axios'
import Icon from 'react-native-vector-icons/MaterialIcons';
import DatePicker from 'react-native-date-picker'

import { Badge } from 'react-native-paper';
import { TouchableOpacity } from 'react-native';


const Home =  ({navigation}) => {

  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false)

  
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  // console.log('user page Home', user)
  // const { firstname, lastname, adresse } = user;
  const cart = useSelector((state) => state.cart.cart);
  const selectedStore = useSelector((state) => state.auth.selectedStore);
  const selectedDateString = useSelector((state) => state.cart.date); //chaine de caractère
  const selectedDate = new Date(selectedDateString); //objet Date
  //  console.log('selected store page home:', selectedStore)

  const [stores, setStores] = useState([]);

  const allStores = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8080/getAllStores');
      // console.log('all stores', response.data)
      setStores(response.data);
    } catch (error) {
      console.error("Une erreur s'est produite :", error);
    }
  };

  useEffect(() => {
    allStores();
  }, []);

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
    // console.log('user logout', user)
    dispatch(logoutUser(selectedStore)); // Passez l'id_magasin en tant qu'arguments
    navigation.navigate('app')
  }

  //date formatée ou pas ? 
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day}-${month}-${year} ${hours}h${minutes}`;
  };


  return (
    <>
    <View style={{...defaultStyle, alignItems:'center', flex:1, paddingHorizontal:5}}>
      <View style={{flexDirection:'row', width: "100%", justifyContent:"space-around"}}>
      <View>
        <Text>Home</Text>
        
        {
          user && <Text>Bonjour {user.lastname} {user.firstname}</Text>
        }
         {/* <Text>Point choisi: {selectedStore.nom_magasin}</Text> */}

        
         <Picker
              placeholder={{
                  label: "Choisissez un magasin"
                }}
              value={selectedStore.nom_magasin}
              onValueChange={(value) => {
                const selected = stores.find((store) => store.nom_magasin === value);

                if (selected) {
                  dispatch(updateSelectedStore(selected));
                dispatch(updateUser({ ...user, id_magasin: selected.id_magasin }));

                // requete vers le serveur pour modifier le choix du magasin dans la Table Clients
                axios.put(`http://127.0.0.1:8080/updateOneUser/${user.id}`, {id_magasin: selected.id_magasin})
                .then(response => {
                  console.log('Le choix du magasin a été mis à jour avec succès dans la base de données');
                  console.log(response.data)
                })
                .catch(error => {
                  console.error('Erreur lors de la mise à jour du choix du magasin dans la base de données:', error);
                });
              }
            else {
              console.log('pas de magasin selectionné encore')
            }}
            }
              items={stores.map((store) => ({
                label: store.nom_magasin,
                value: store.nom_magasin,
              }))}
               
                
              
            />

       
        <TouchableOpacity onPress={() => setOpen(true)} >
          <Text>Planifier votre commande</Text>
        </TouchableOpacity>
              <DatePicker
                modal
                open={open}
                date={date}
                onConfirm={(date) => {
                  setOpen(false)
                  setDate(date)
                  dispatch(addDate(date.toISOString())); // Sauvegarder la date dans le store Redux
                  //converti en chaine de caractères
                  console.log('date commande',formatDate(date) )
                 
                  console.log('selection date objet:', selectedDate)
                  console.log('selection date chaine de caractère:', selectedDateString)
                }}
                onCancel={() => {
                  setOpen(false)
                }}
              />
        

        
    
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
