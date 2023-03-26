import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addText } from "../../redux/texts";
import Constants from "../../Constansts.js";
import search from "../../images/search.svg";
import "./Home.css";
import useInterval from "../../hooks/useInterval";
const { ipcRenderer } = window.require("electron");
const Home = () => {
  const [isOverlayVisible, setIsOverLayVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState({});
  const authToken = useSelector((state) => state.auth.authToken);
  const currentDevice = useSelector((state) => state.currentDevice);
  const devices = useSelector((state) => state.devices.devicesArray);
  const [textList, setTextList] = useState([]);
  useEffect(() => {
    ipcRenderer.invoke("get-all-texts").then((result) => {
      setTextList(result);
    });
  }, []);

  useInterval(() => {
    let currentText = ipcRenderer.sendSync("current-text");
    if (
      textList.length == 0 ||
      (currentText != textList[0].note &&
        currentText != textList[textList.length - 1].note)
    ) {
      const note = { note: currentText, createdAt: Date.now() };
      console.log("Current Note ", note);
      setTextList((list) => [note, ...list]);
      console.log("List After Updating ", textList.length);
      ipcRenderer.send("save-text", {
        id: 0,
        note: currentText,
        time: Date.now(),
      });
    }
  }, 300);

  const renderItem = () => {
    if (textList == null || textList.length == 0 || !Array.isArray(textList)) {
      console.log("Rendering No Message Text");
      return (
        <span className="noMessageTexts">
          You Don't have any texts right now
        </span>
      );
    } else {
      return textList.map((value, index, array) => (
        <div
          className="messageItem"
          key={index}
          onClick={() => {
            showOptions(index);
          }}
        >
          <span>{JSON.stringify(value.note)}</span>
        </div>
      ));
    }
  };

  const showOptions = (index) => {
    setSelectedMessage(textList[index]);
    setIsOverLayVisible(true);
  };

  const sendMessage = (device, message) => {
    const body = {
      message: message.note,
      fcmToken: device.fcmToken,
      deviceId: device.deviceId,
      currentDevice: currentDevice,
    };
    let config = {
      headers: {
        authToken,
      },
    };
    const url = Constants.baseUrl + "/sendMessageToDevice";
    axios
      .post(url, body, config)
      .then((value) => {
        setIsOverLayVisible(false);
      })
      .catch((error) => {
        alert("Error Sending Data");
      });
  };

  const renderOverlay = () => {
    return (
      <div
        className="overlayParent"
        onClick={() => {
          setIsOverLayVisible(false);
        }}
      >
        <div className="overlayBody">
          <span className="optionBackground">Copy to clipboard</span>
          {devices.map((value, index, _) => (
            <div
              className="optionBackground"
              onClick={() => {
                sendMessage(value, selectedMessage);
              }}
              key={index}
            >
              Send to {value.deviceName}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAppBar = () => {
    return (
      <div className="appBar">
        <span>Text Bridge</span>
        <img src={search} />
      </div>
    );
  };

  return (
    <div className="homeParent">
      {isOverlayVisible ? renderOverlay() : null}
      <div className="textsParent">
        {renderAppBar()}
        <div className="notesParent">{renderItem()}</div>
      </div>
    </div>
  );
};

export default Home;
