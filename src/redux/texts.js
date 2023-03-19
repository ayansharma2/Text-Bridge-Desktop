import { createSlice } from "@reduxjs/toolkit";



export const text = createSlice({
    name:"text",
    initialState:{
        message:{},
    },reducers:{
        addText:(state,action)=>{
            state.message = action.payload
        }
    }
})

export const {addText} = text.actions

export default text.reducer