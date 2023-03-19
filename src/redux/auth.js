import { createSlice } from "@reduxjs/toolkit";



export const auth = createSlice({
    name:"auth",
    initialState:{
        authToken:""
    },reducers:{
        setAuthToken:(state,action)=>{
            
            state.authToken = action.payload
        }
    }
})


export const {setAuthToken} = auth.actions
export default auth.reducer