import { createSlice } from "@reduxjs/toolkit";



export const currentDevice = createSlice({
    name:"device",
    initialState:{
        deviceName:"",
        deviceId:""
    },reducers:{
        setDeviceId:(state,action)=>{
            
            state.deviceId = action.payload
        },
        setDeviceName:(state,action)=>{
            state.deviceName = action.payload
        }
    }
})


export const {setDeviceId,setDeviceName} = currentDevice.actions
export default currentDevice.reducer