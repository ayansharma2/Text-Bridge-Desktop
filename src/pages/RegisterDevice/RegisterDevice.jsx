import axios from "axios";
import { useEffect, useState } from "react";
import { CircularProgress } from "react-loading-indicators";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Constants from "../../Constansts";
import { setDeviceId,setDeviceName } from "../../redux/currentDevice";
import "./RegisterDevice.css";

const RegisterDevice = () => {
  const deviceId = window.getMac.default();
  const dispatch = useDispatch()
  const navigator = useNavigate();
  const [deviceName, setDevicenName] = useState(
    window.hostName ? window.hostName : ""
  );
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const onNameChange = (event) => {
    setIsErrorVisible(false);
    setDevicenName(event.target.value);
  };
  const [loading, setIsLoading] = useState(false);
  const dialog = () => {
    return (
      <div className="dialog">
        <div className="dialogContainer">
          <CircularProgress color="black" />
          <p>Registering Device</p>
        </div>
      </div>
    );
  };

  const registerDevice = (event) => {
    if (deviceName == "") {
      setIsErrorVisible(true);
      return;
    }
    setIsLoading(true);
    const params = new URLSearchParams();
    params.append("deviceName", deviceName);
    params.append("deviceId", deviceId);
    axios({
      method: "post",
      url: Constants.baseUrl + "/registerDesktop",
      params,
    })
      .then((value) => {
        dispatch(setDeviceName(deviceName))
        dispatch(setDeviceId(deviceId))
        
        setIsLoading(false);
        navigator("/qrCode");
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        alert("Error Registering device");
      });
  };

  return (
    <div className="parentContainer">
      {loading && dialog()}
      <div className="container">
        <p>What would you like to name this device</p>
        <input
          value={deviceName}
          onChange={onNameChange}
          placeholder="Device Name"
          className="deviceName"
        />
        {isErrorVisible && (
          <span className="errorText">Device name can't be empty</span>
        )}
        <button className="submitButton" onClick={registerDevice}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default RegisterDevice;
