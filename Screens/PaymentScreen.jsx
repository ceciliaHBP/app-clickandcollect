import React, { useState , useEffect} from 'react';
import { Button } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';

const PaymentScreen = ({navigation}) => {
  const [checkoutSession, setCheckoutSession] = useState(null);
  const route = useRoute();
  const { orderInfo } = route.params;

  useEffect(() => {
    // Utiliser les informations de confirmation de commande récupérées
    console.log('Informations de confirmation de commande :', orderInfo.cartItems);

    // Effectuer les opérations nécessaires liées au paiement
    // ...
  }, [orderInfo]);

  const handlePress = async ({navigation}) => {
    // Récupérez l'ID de la session de paiement depuis votre serveur
    const response = await axios.post('http://localhost:8080/checkout_session', {orderInfo});
    const sessionId = response.data.id;
    //console.log('response.data', response.data)
    const sessionUrl = response.data.session
    const stripeCheckoutUrl = `${sessionUrl}`;
    
    setCheckoutSession(stripeCheckoutUrl);
    
  };
  const handleNavigationChange = (navState) => {
    // navState est un objet qui contient des informations sur l'état de navigation actuel.
    // navState.url est l'URL actuelle dans le WebView.

    // Vérifiez si l'URL actuelle est l'URL de succès.
    if (navState.url.startsWith('http://localhost:8080/success')) {
      // Le paiement a réussi, fermez le WebView et redirigez l'utilisateur vers la page de succès.
      setCheckoutSession(null);
      console.log('ok')
      navigation.navigate('success');
      // Ici, vous pouvez également mettre à jour l'état de votre application pour refléter le succès du paiement.
    }

    // Vérifiez si l'URL actuelle est l'URL d'annulation.
    if (navState.url.startsWith('http://localhost:8080/cancel')) {
      // Le paiement a été annulé, fermez le WebView et redirigez l'utilisateur vers la page d'annulation.
      setCheckoutSession(null);
      console.log('nok')
      navigation.navigate('echec');
      // Ici, vous pouvez également mettre à jour l'état de votre application pour refléter l'annulation du paiement.
    }
  };

  if (checkoutSession) {
    return <WebView source={{ uri: checkoutSession }} onNavigationStateChange={handleNavigationChange}/>;
  }

  return <Button title="Valider" onPress={handlePress} />;
};

export default PaymentScreen;
