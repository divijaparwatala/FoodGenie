//store cart items and track the restaurant info....
import {cartSlice} from "@reduxjs/toolkit";

const initialState={
    cartItems:[],
    restaurant:{},
    loading:false,
    error:null
}

const cartSlice = createSlice({
    name:"cart",
     initialState,
    reducers:{
        cartRequest:(state)=>{
            state.loading=true
        },
        cartSuccess:(state,action)=>{
            state.loading = false,
            state.cartItems = action.payload.items,
            state.restaurant = action.payload.restaurant
        },
        cartFail:(state,action)=>{
            state.loading = false,
            state.error = action.payload
        },
        updateCartSuccess:(state,action)=>{
            state.cartItems = action.payload.items
        },
        removeCartSucces:(state,action)=>{
            state.cartItems = action.payload?.cart?.items || null
        },
        clearCart:(state)=>{
            state.cartItems = []
        },
        clearErrors:(state)=>{
            state.error=null
        },
        saveDeliveryInfo:(state,success)=>{
            state.deliverInfo=action.payload
        }
    }
})

export const{
    cartRequest,
    cartSuccess,
    cartFail,
    updateCartSuccess,
    removeCartSucces,
    clearCart,
    clearErrors,
    saveDeliveryInfo
} = cartSlice.actions;

export default cartSlice.reducers;