import {Alert,  View, Text, Pressable, ScrollView , StyleSheet } from 'react-native'
 import  Picker  from 'react-native-picker-select';
import { defaultStyle} from '../styles/styles'
import React, {useState, useEffect, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser, updateSelectedStore, updateUser} from '../reducers/authSlice';
import { addDate, addTime, resetDateTime} from '../reducers/cartSlice';
import ProductCard from '../components/ProductCard'
import axios from 'axios'
import Icon from 'react-native-vector-icons/MaterialIcons';
import DatePicker from 'react-native-date-picker'
import { Badge } from 'react-native-paper';
import { TouchableOpacity } from 'react-native';
import {Toast} from 'react-native-toast-message/lib/src/Toast';


const Home =  ({navigation}) => {

  const [date, setDate] = useState(null)
  const [openDate, setOpenDate] = useState(false)
  const dateRedux = useSelector((state) => state.cart.date)
  //console.log('home date',dateRedux)
  const [time, setTime] = useState()
  const [openTime, setOpenTime] = useState(false)
  const timeRedux = useSelector((state) => state.cart.time)
  //console.log('home time',timeRedux)
 
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  //console.log('user role', user)
  // const { firstname, lastname, adresse } = user;
  const cart = useSelector((state) => state.cart.cart);
  console.log('cart home', cart)
  const selectedStore = useSelector((state) => state.auth.selectedStore);
  //const selectedDateString = useSelector((state) => state.cart.date); //chaine de caractère
  //const selectedDate = new Date(selectedDateString); //objet Date
  //console.log('selected store page home:', selectedStore)

  // const [selectedDate, setSelectedDate] = useState(null);

  const [stores, setStores] = useState([]);
  const [role, setRole] = useState('');
  //console.log('role', role)

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

  useEffect(() => {
    // Effectuez une requête GET pour récupérer le rôle de l'utilisateur
    axios.get(`http://127.0.0.1:8080/getOne/${user.userId}`)
      .then(response => {
        //console.log(response.data.role)
        const role  = response.data.role;
         setRole(role);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération du rôle de l\'utilisateur:', error);
      });
  }, [])

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
      const response = await axios.get('http://127.0.0.1:8080/getAllProducts');
    
      const updatedProducts = response.data.map((product) => ({
        ...product,
        qty: 0, 
      }));
      //console.log('all products', updatedProducts)
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
    dispatch(resetDateTime())
    setDate(null)
    setTime(null)
    dispatch(logoutUser(selectedStore)); 
    navigation.navigate('app')
  }

  //date formatée ou pas ? 
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString();
    //const hours = date.getHours().toString().padStart(2, '0');
    //const minutes = date.getMinutes().toString().padStart(2, '0');
    //return `${day}-${month}-${year} ${hours}h${minutes}`;
    return `${day}-${month}-${year}`;

  };
  // heure non formaté pour l'instant - inutile pour les collaborateurs
  const formatTime = (dateString) => {
    const time = new Date(dateString);
    //const day = date.getDate().toString().padStart(2, '0');
    //const month = (date.getMonth() + 1).toString().padStart(2, '0');
    //const year = date.getFullYear().toString();
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    //return `${day}-${month}-${year} ${hours}h${minutes}`;
    return `${hours}h${minutes}`;
  };

  const isTomorrowOrLater = (selectedDate) => {
    const currentDate = new Date();
    currentDate.setHours(23, 59, 0, 0); // Set current date to today at 23:59
    return selectedDate >= currentDate;
  };
 

  return (
    <>
    <View style={{...defaultStyle, alignItems:'center', flex:1, paddingHorizontal:5, paddingVertical:20}}>
   
      <View style={{flexDirection:'row', width: "100%", justifyContent:"space-around"}}>
      <View>
        {
          user && <Text>Bonjour {user.firstname} {user.lastname} </Text>
        }
         {/* <Text>Point choisi: {selectedStore.nom_magasin}</Text> */}

        
         <Picker
              placeholder={{
                  label: "Choisissez un magasin"
                }}
              value={selectedStore.nom_magasin}
              onValueChange={(value) => {
                const selected = stores.find((store) => store.nom_magasin === value);
                //console.log('user', user)

                if (selected) {
                  dispatch(updateSelectedStore(selected));
                // dispatch(updateUser({ ...user, id_magasin: selected.id_magasin }));
                dispatch(updateUser({ ...user, storeId: selected.storeId }));

                axios.put(`http://127.0.0.1:8080/updateOneUser/${user.userId}`, {storeId: selected.storeId})
                .then(response => {
                  // console.log('Le choix du magasin a été mis à jour avec succès dans la base de données');
                  // console.log(response.data)
                })
                .catch(error => {
                  console.error('Erreur lors de la mise à jour du choix du magasin dans la base de données - erreur ici:', error);
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

       {/* Selection Jour */}
        <TouchableOpacity onPress={() => setOpenDate(true)} >
        {/* <Text>{dateRedux ? <Text style={style.picker}>{dateRedux}</Text> : "Choisissez votre jour"}</Text> */}
        <Text>
          {date ? (
            isTomorrowOrLater(date) ? (
              <Text style={style.picker}>{formatDate(date)}</Text>
            ) : (
              "Il est trop tard pour commander pour  demain"
            )
          ) : (
            "Choisissez votre jour"
          )}
        </Text>

        </TouchableOpacity>
              <DatePicker
                modal
                open={openDate}
                date={date ? new Date(date) : new Date()}
                mode="date"
                onConfirm={(date) => {
                  setOpenDate(false)

                //test date
                if (isTomorrowOrLater(date)) {
                  setDate(date);
                  dispatch(addDate(formatDate(date.toISOString())));
                  //converti en chaine de caractères
                 console.log('date commande',formatDate(date) )
                  //console.log('dateR', dateR)
                  //console.log('selection date store redux:', selectedDateString)
                  //console.log('selection date chaine de caractère:', selectedDateString)
                  return Toast.show({
                    type: 'success',
                    text1: 'Succès',
                    text2: `Commande prévue pour ${formatDate(date)}`
                  });
                } else {
                  setDate(null)
                  dispatch(addDate(null))
                  console.log('La date sélectionnée doit être supérieure ou égale à demain');
                  return Toast.show({
                    type: 'error',
                    text1: 'Erreur, Vous arrivez trop tard pour demain',
                    text2: 'Veuillez selectionner une nouvelle date'
                  });
                } 
                }}
                onCancel={() => {
                  setOpenDate(false)
                }}
                minimumDate={new Date()}
                
              />

        {/* Selection Heure */}
        {/* non visible pour les collaborateurs car heure = tournée du camion */}
        
        {role !== 'collaborateur' && (
       <TouchableOpacity onPress={() => setOpenTime(true)} >
        <Text>{timeRedux ? <Text style={style.picker}>{timeRedux}</Text> : "Choisissez votre heure"}</Text>
        </TouchableOpacity>
        )}
        {role !== 'collaborateur' && (
              <DatePicker
                modal
                open={openTime}
                date={time ? new Date(time) : new Date()}
                mode="time"
                onConfirm={(time) => {
                  setOpenTime(false)
                  setTime(time)
                  dispatch(addTime(formatTime(time.toISOString())));
                  //converti en chaine de caractères
                  console.log('heure commande',formatTime(time))
                  //console.log('selection date store redux:', selectedDateString)
                  //console.log('selection date chaine de caractère:', selectedDateString)
                }}
                onCancel={() => {
                  setOpenTime(false)
                }}
              /> 
        )}
    
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
                  key={item.productId}
                  id={item.productId}
                  index={index}
                  image={item.image}
                  prix={item.prix_unitaire}
                  qty={item.qty}
                  stock={item.stock}
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
  picker:{
    color:'red',
    fontWeight:'bold'
  }
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
 