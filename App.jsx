import React from 'react'
import Main from './Main'
import { Provider } from 'react-redux'
import  store  from './store'
import { StripeProvider } from '@stripe/stripe-react-native';


const App = () => {
  return (
    
        <Provider store ={store}>
          <StripeProvider
            publishableKey='pk_test_51NKoFqGnFAjiWNhKQl9LgCIj0vQALtlpR5ldZhteod9iDo1PXI2WnZg70yJvJZ31YUQveFoiJky7lYdIC1gOORGo00NI0EuPLh'
            merchantIdentifier='test_identifier'
            threeDSecureParams={{
              backgroundColor:"#fff",
              timeout:5
            }}
            > 
            <Main />
          </StripeProvider>
      </Provider>
    
    
    
  )
}

export default App