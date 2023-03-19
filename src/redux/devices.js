import { createSlice } from "@reduxjs/toolkit";



export const devices = createSlice({
    name:"devices",
    initialState:{
        devicesArray:[]
    },reducers:{
        setDevices:(state,action)=>{
          state.devicesArray = action.payload
        }
    }
})


export const {setDevices} = devices.actions
export default devices.reducer