import axios from "axios";
import { useEffect } from "react";
import QRCode from "react-qr-code";
import { shallowEqual, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Constants from "../../Constansts";
import "./QrCode.css";
const QrCode = () => {
  const deviceId = useSelector((state)=>state.currentDevice.deviceId)
  const deviceName = useSelector((state)=>state.currentDevice.deviceName)
  const deviceDetails = {
    deviceId,
    deviceName,
  };
  return (
    <div className="qrCodeContainer">
      <p className="message">
        Scan this code using your mobile to get the most out of the Text Bridge
      </p>
      <QRCode value={JSON.stringify(deviceDetails)} />
    </div>
  );
};

export default QrCode;
