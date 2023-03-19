import "./Splash.css";
import appImage from "../../images/appImage.png";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addText } from "../../redux/texts";
import axios from "axios";
import Constants from "../../Constansts";
import { setDevices } from "../../redux/devices";
const Splash = () => {
  const dispatch = useDispatch();
  const navigator = useNavigate();
  const deviceId = useSelector((state) => state.currentDevice.deviceId);
  const authToken = useSelector((state) => state.auth.authToken);
  useEffect(() => {
    dispatch(addText({}));
    getAllDevices()
  }, [deviceId]);
  const getAllDevices = ()=>{
    let config = {
        headers: {
          authToken,
        },
      };
  
      if (authToken != "") {
        const url = Constants.baseUrl + "/getAllDevices?deviceId=" + deviceId;
  
        axios
          .get(url, config)
          .then((value) => {
            console.log("Response Received", value);
            dispatch(setDevices(value.data));
            navigateByConditions();
          })
          .catch((error) => {
            setTimeout(getAllDevices,500)
            console.log("Error Encountered", error);
            
          });
      } else{
          navigateByConditions()
      }
  }
  const navigateByConditions = () => {
    if (authToken) {
      navigator("/home");
    } else if (deviceId != "") {
      navigator("/qrCode");
    } else {
      navigator("/registerDevice");
    }
  };
  return (
    <div className="container">
      <img src={appImage} className="splashImage" />
    </div>
  );
};

export default Splash;
