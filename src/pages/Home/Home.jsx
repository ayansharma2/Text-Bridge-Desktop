import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addText } from "../../redux/texts";
import Constants from "../../Constansts.js";
import search from "../../images/search.svg"
import "./Home.css";
const { ipcRenderer } = window.require("electron");
let count = 0;
const Home = () => {
  const dispatch = useDispatch();
  const [isOverlayVisible, setIsOverLayVisible] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState({});
  const authToken = useSelector((state) => state.auth.authToken);
  const currentDevice = useSelector((state) => state.currentDevice);
  const devices = useSelector((state) => state.devices.devicesArray);
  const [textList, setTextList] = useState(
    JSON.parse(localStorage.getItem("messageList"))
  );
  if (textList == null) {
    console.log("Text List Initialized");
    setTextList([]);
  }
  useEffect(() => {
    const interval = setInterval(() => {
      let currentText = ipcRenderer.sendSync("current-text");
      if (textList.length == 0) {
        dispatch(addText({ text: currentText }));
      } else if (currentText != textList[0].text) {
        dispatch(addText({ text: currentText, createdAt: Date.now() }));
      }
    }, 300);
    return () => {
      clearInterval(interval);
      localStorage.setItem("messageList", JSON.stringify(textList));
    };
  });
  const message = useSelector((state) => state.text.message);
  if (
    message.text != undefined &&
    message.text != "" &&
    textList != null &&
    (textList.length == 0 || textList[0].text != message.text)
  ) {
    setTextList((currentList) => {
      if (Array.isArray(currentList)) {
        currentList.unshift(message);
      }

      return currentList;
    });
  }

  const renderItem = () => {
    if (textList == null || textList.length == 0 || !Array.isArray(textList)) {
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
          console.log(value)
          <span>{value.text}</span>
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
      message: message.text,
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
        <img src={search}/>
    </div>
    )
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
