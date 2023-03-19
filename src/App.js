import './App.css';
import { Route, Router, Routes, useNavigate } from 'react-router-dom';
import Splash from './pages/Splash/splash';
import { useEffect } from 'react';
import RegisterDevice from './pages/RegisterDevice/RegisterDevice';
import QrCode from './pages/QrCode/QrCode';
import Home from './pages/Home/Home';
import {addText} from './redux/texts'
import { setAuthToken } from './redux/auth';
import { useDispatch,useSelector, useStore } from 'react-redux';
import Constants from './Constansts';

const electron = window.require("electron");
const clipboard = electron.clipboard;
function App() {
    const deviceId = window.getMac.default();
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useEffect(() => {
        initSocket()
      }, []);
      const initSocket = ()=>{
        const socket = new WebSocket("ws://"+Constants.baseIp+":8081/desktop")
        socket.onopen = function(e){
            const deviceDetails = {deviceId}
            socket.send(JSON.stringify(deviceDetails))
        }
        socket.onmessage = OnNewMessage
        socket.onerror = function(event){
            console.log("Retrying")
            setTimeout(initSocket,500)
          }
      }
      function OnNewMessage(event){
        const data = JSON.parse(event.data)

        if(data.type == "auth"){
            console.log(data)    
            const authToken = data.data.authToken
            dispatch(setAuthToken(authToken))
            navigate("/home")
        } else if(data.type=="message"){
            console.log(data)
            clipboard.writeText(JSON.stringify(data.data.message))
        
        }  
    }
  return (
    <div className='app'>
    <Routes>
        <Route path='/' element={<Splash/>}/> 
        <Route path="/registerDevice" element={<RegisterDevice/>}/>
        <Route path='/qrCode' element={<QrCode/>}/>
        <Route path='/home' element={<Home/>}/>
    </Routes>  
    </div>
  );
}

export default App;
