// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   cartItems: [],
// };

// const cartSlice = createSlice({
//   name: 'cart',
//   initialState,
//   reducers: {
//     addToCart: (state, action) => {
//       const item = action.payload;
//       state.cartItems.push(item);
//     },
//     removeFromCart: (state, action) => {
//       const itemId = action.payload;
//       state.cartItems = state.cartItems.filter((item) => item.id !== itemId);
//     },
//     clearCart: (state) => {
//       state.cartItems = [];
//     },
//   },
// });

// export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
// export default cartSlice.reducer;


import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  cart: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // addToCart: (state, action) => {
    //   state.cart.push(action.payload);
    // },
    addToCart: (state, action) => {
        const product = action.payload;
        const existingProductIndex = state.cart.findIndex(
          (item) => item.id === product.id
        );
        if (existingProductIndex !== -1) {
          // Le produit existe déjà dans le panier, mettez à jour sa quantité
          state.cart[existingProductIndex].qty += 1;
        } else {
          // Le produit n'existe pas encore dans le panier, ajoutez-le avec une quantité de 1
          state.cart.push(product);
        }
      },
    removeFromCart: (state, action) => {
        const productId = action.payload;
        state.cart = state.cart.filter((item) => item.id !== productId);
      },
    updateCart(state, action) {
        state.cart = action.payload;
      },
    clearCart: (state) => {
        state.cart = [];
      },
      addDate: (state, action) => {
        state.date = action.payload;
      },
  },
});

export const { addToCart, removeFromCart, updateCart, clearCart, addDate } = cartSlice.actions;
export default cartSlice.reducer;
