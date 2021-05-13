import micOn from "../../assets/images/icons/mic_on.png";
import micOff from "../../assets/images/icons/mic_off.png";
import VoiceSynthesizer from "../VoiceSynthesizer/VoiceSynthesizer";
import "./Demo.css";
import React, { useEffect, useState } from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

export default function Demo() {
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // <------------------------------------------ STATE ------------------------------------------> //
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  const [voiceSelector, setVoiceSelector] = useState(false);
  const [message, setMessage] = useState("");
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // <---------------------------------------- VARIABLES ----------------------------------------> //
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  const websearch = (website, searchTerm) => {
    window.open("http://" + website.split(" ").join("") + ".com");
  };

  const commands = [
    {
      command: ["hello", "hi"],
      callback: () => setMessage("Hello, how can I help you?"),
      matchInterim: true,
      bestMatchOnly: true,
    },
    {
      command: "(hello) my name is *",
      callback: (name) =>
        setMessage(`Hello, ${name}! I hope to remember that in the future.`),
    },
    {
      command: "clear",
      callback: ({ resetTranscript }) => resetTranscript(),
    },
    {
      command: ["quit", "end", "exit"],
      callback: () => SpeechRecognition.stopListening(),
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.2,
      bestMatchOnly: true,
    },
    {
      command: "help",
      callback: () => setMessage("How can I help you?"),
    },
    {
      command: ["log in", "login"],
      callback: () => {
        window.open("http://localhost:3000/login", "_self");
      },
    },
    {
      command: "demo",
      callback: () => {
        window.open("http://localhost:3000/demo", "_self");
      },
    },
    {
      command: "demo voice synthesis",
      callback: () => {
        setVoiceSelector(true);
      },
    },
    {
      command: "back to demo",
      callback: () => {
        setVoiceSelector(false);
      },
    },
    {
      command: "search google for *",
      callback: (website) => {
        window.open("http://" + website.split(" ").join("") + ".com");
      },
    },
    {
      command: "what's the forecast",
      callback: () => {
        console.log("fetch weather forecast");
      },
    },
    {
      command: "search google for *",
      callback: () => {
        console.log("randomize background image");
      },
    },
  ];

  const { transcript, resetTranscript, listening } = useSpeechRecognition({
    commands,
  });
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  // <------------------------------------------ HOOKS ------------------------------------------> //
  ///////////////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => {
    SpeechRecognition.startListening();
  }, []);
  //////////////////////////////////////////////////////////////////////////////////////////////////
  // <------------------------------------- EVENT HANDLERS -------------------------------------> //
  //////////////////////////////////////////////////////////////////////////////////////////////////
  const listenContinuously = () => {
    SpeechRecognition.startListening({
      continuous: true,
      language: "en-US",
    });
  };

  const handleChange = (e) => {
    e.preventDefault();
    console.log(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e.target.value);
  };

  return (
    <div className="page" id="Demo">
      <div className="center-col virtual-assistant-container">
        <div className="virtual-assistant"></div>
      </div>

      <div className=" center-col main">
        <div className="">
          <div className="">
            {voiceSelector === true ? (
              <VoiceSynthesizer />
            ) : (
              <div
                className="demo instructions glass-panel"
                style={{ height: "300px" }}
              >
                <p>
                  Welcome to the demo! Here is a list of commands you can try:
                </p>
                <ul>
                  <li>1. "Demo voice synthesis."</li>
                  <li>2. "What's the forecast?" </li>
                  <li>
                    3. "Search Google for" + search term.{" "}
                    <p>
                      <small>
                        <em>warning: opens new window</em>
                      </small>
                    </p>
                  </li>
                  <li>4. "Randomize background image."</li>
                  <li>5</li>
                </ul>
                {/* ///////////////////////////////////////////////////////////////////////////// */}
                {/* <-------------------------- TEXT RESPONSE DISPLAY --------------------------> */}
                {/* ///////////////////////////////////////////////////////////////////////////// */}
                <div className="message-display-container">
                  <textarea
                    style={{ height: "100px", width: "500px" }}
                    className="message-textbox glass-panel"
                  >
                    {message}
                  </textarea>
                </div>
              </div>
            )}
            <div style={{ marginTop: "20px" }} className="form-container">
              <form onSubmit={handleSubmit}>
                {/* ////////////////////////////////////////////////////////////////////////// */}
                {/* <------------------------------ TRANSCRIPT ------------------------------> */}
                {/* ////////////////////////////////////////////////////////////////////////// */}
                <textarea
                  className="transcript glass-panel"
                  value={transcript}
                  onChange={handleChange}
                />{" "}
                <div className="center-col">
                  <div className="hot-mic-btn">
                    {/* /////////////////////////////////////////////////////////////////////////// */}
                    {/* <----------------------------- HOT MIC "BTN" -----------------------------> */}
                    {/* /////////////////////////////////////////////////////////////////////////// */}
                    <img
                      src={listening ? micOn : micOff}
                      alt=""
                      style={{
                        with: "38px",
                        height: "38px",
                        margin: "5px",
                      }}
                    />
                  </div>
                  {/* //////////////////////////////////////////////////////////////////////////// */}
                  {/* <------------------------------- LISTEN BTN -------------------------------> */}
                  {/* //////////////////////////////////////////////////////////////////////////// */}
                  <button
                    onMouseDown={listenContinuously}
                    onMouseUp={SpeechRecognition.stopListening}
                    style={{
                      width: "50px",
                      height: "50px",
                      border: "none",
                      borderRadius: "30px",
                      backgroundColor: "lightgray",
                      cursor: "pointer",
                    }}
                  >
                    🎤
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
//////////////////////////////////////////////////////////////////////////////////////////////////
// <-------------------------------- CREATE FALLBACK BEHAVIOR --------------------------------> //
//////////////////////////////////////////////////////////////////////////////////////////////////
/*
  if (SpeechRecognition.browserSupportsSpeechRecognition()) {
    // continue
  } else {
    // Fallback behavior
  }

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    console.log(
      "I'm sorry - This browser does not support speech recognition software."
    );
  }

    if (browserSupportsContinuousListening) {
    SpeechRecognition.startListening({ continuous: true });
  } else {
    // Fallback behaviour
  }
*/
