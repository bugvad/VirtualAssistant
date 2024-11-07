import React, { useEffect, useState } from "react";
// import axios from "axios";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useSpeechSynthesis } from "react-speech-kit";
import micOn from "../../assets/images/icons/mic_on.png";
import micOff from "../../assets/images/icons/mic_off.png";
import useSound from "use-sound";
import CommandsModal from "../../components/CommandsModal";
import useCommandsModal from "../../hooks/useCommandsModal";
import Settings from "../../components/Settings";
import TodoAPIHelper from "../../helpers/TodoAPIHelper";
import TodoList from "../Todos/TodoForm";
import hilo_sparkle from "../../assets/sounds/testing/hilo_sparkle.mp3";
import Bells10 from "../../assets/sounds/testing/Bells10.mp3";
import Bells11 from "../../assets/sounds/testing/Bells11.mp3";
import LoadingTone from "../../assets/sounds/testing/Mech-Drone-12.mp3";
import PowerDown7 from "../../assets/sounds/testing/PowerDown7.mp3";
import PowerUp18 from "../../assets/sounds/testing/PowerUp18.mp3";
import SynthChime8 from "../../assets/sounds/testing/SynthChime8.mp3";
import SynthChime9 from "../../assets/sounds/testing/SynthChime9.mp3";
import SynthChime11 from "../../assets/sounds/testing/SynthChime11.mp3";
import Quirky7 from "../../assets/sounds/testing/UI_Quirky7.mp3";
import Quirky8 from "../../assets/sounds/testing/UI_Quirky8.mp3";
import Sprinkle from "../../assets/sounds/testing/sprinkle.mp3";
import LowTuTone from "../../assets/sounds/testing/lowTuTone.mp3";
import Heard from "../../assets/sounds/testing/heard.mp3";
import timer from "../../assets/sounds/testing/timer.mp3";
import "./VirtualAssistant.css";

/* DEEPL ENDPOINT EX
// https://api-free.deepl.com/v2/translate?auth_key=26b78442-234b-ac27-1823-37eb1d698edc%3Afx&text=&target_lang=de
*/

export default function VirtualAssistant() {
  /////////////////////////////////////////////////////////////////
  // <------------------------- STATE -------------------------> //
  /////////////////////////////////////////////////////////////////
  // err msg:
  const [errorMessage, setErrorMessage] = useState("");
  // deepl secret key:
  const deeplApiKey = process.env.REACT_APP_DEEPL_KEY;
  // Translation POST data:
  const [langCode, setLangCode] = useState("");
  const [translations, setTranslations] = useState(null);
  // Translation GET data:
  const [langs, setLangs] = useState([]);
  // Settings:
  const [showSettings, setShowSettings] = useState(false);
  // Todos:
  const [showTodos, setShowTodos] = useState(false);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  // Geolocation(weather):
  const [lat, setLat] = useState([]);
  const [long, setLong] = useState([]);
  // Weather:
  const [weatherData, setWeatherData] = useState(null);
  // Voice:
  const [pitch, setPitch] = useState(1);
  const [rate, setRate] = useState(1);
  const [voiceIndex, setVoiceIndex] = useState(2);
  const [message, setMessage] = useState("");

  /////////////////////////////////////////////////////////////////
  // <------------------------- TODOS -------------------------> //
  /////////////////////////////////////////////////////////////////
  // // GET ALL
  // useEffect(() => {
  //   const fetchTodoAndSetTodos = async () => {
  //     const todos = await TodoAPIHelper.getAllTodos();
  //     setTodos(todos);
  //   };
  //   fetchTodoAndSetTodos();
  // }, []);
  // GET most recently aded task
  const getMostRecentTodo = async () => {
    const lastTodo = await TodoAPIHelper.getMostRecentTodo();
    return lastTodo.data[0];
  };
  // GET oldest task
  const getOldestTodo = async () => {
    const firstTodo = await TodoAPIHelper.getMostRecentTodo();
    return firstTodo.data[firstTodo.data.length - 1];
  };
  // DELETE most recent task
  const deleteMostRecentTodo = async () => {
    const lastTodo = await TodoAPIHelper.getMostRecentTodo();
    const lastTodoId = lastTodo.data[0]._id;
    if (lastTodoId) {
      TodoAPIHelper.deleteTodo(lastTodoId);
    }
  };
  // DELETE oldest task
  const deleteOldestTodo = async () => {
    const lastTodo = await TodoAPIHelper.getMostRecentTodo();
    const firstTodoId = lastTodo.data[lastTodo.data.length - 1]._id;
    if (firstTodoId) {
      TodoAPIHelper.deleteTodo(firstTodoId);
    }
  };
  // CREATE
  const createTodo = async (e) => {
    if (todos.some(({ task }) => task === newTodo)) {
      alert(`Task: ${newTodo} already exists`);
      return;
    }
    // create todo:
    const newTask = await TodoAPIHelper.createTodo(newTodo);
    // add todo to the list:
    setTodos([...todos, newTask]);
  };
  // UPDATE
  const updateTodo = async (e, id) => {
    e.stopPropagation();
    const payload = {
      done: !todos.find((todo) => todo._id === id).done,
    };
    const updatedTodo = await TodoAPIHelper.updateTodo(id, payload);
    setTodos(todos.map((todo) => (todo._id === id ? updatedTodo : todo)));
  };
  // DELETE
  const deleteTodo = async (e, id) => {
    try {
      e.stopPropagation();
      await TodoAPIHelper.deleteTodo(id);
      setTodos(todos.filter(({ _id: i }) => id !== i));
    } catch (err) {
      console.log(err);
    }
  };
  /////////////////////////////////////////////////////////////////
  // <------------------------- TIME -------------------------> //
  /////////////////////////////////////////////////////////////////
  // Seconds timer:
  const setSecondsTimer = (timeout) => {
    const countdown = parseInt(timeout) * 1000;
    setTimeout(function (countdown) {
      let counter = 0;
      while (countdown > 0) {
        countdown--;
      }
      handlePlayTimer();
      setMessage("beep.");
      // speak({ text: "beep.", voice: voices[voiceIndex], rate, pitch });
    }, countdown);
  };
  // Minutes timer:
  const setMinutesTimer = (timeout) => {
    const countdown = parseInt(timeout) * 60000;
    setTimeout(function (countdown) {
      while (countdown > 0) {
        countdown--;
      }
      setMessage("beep.");
      speak({ text: "beep.", voice: voices[voiceIndex], rate, pitch });
      return;
    }, countdown);
  };
  // current time:
  const fetchTime = () => {
    const today = new Date();
    const time =
      today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    setMessage(time);
    speak({ text: `${time}`, voice: voices[voiceIndex], rate, pitch });
  };
  // current date:
  const fetchDate = () => {
    const today = new Date();
    const date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    setMessage(date);
    speak({
      text: `the date is ${date}`,
      voice: voices[voiceIndex],
      rate,
      pitch,
    });
  };
  // current day:
  const fetchDay = () => {
    // Get the day of week, from 0 (Sunday) to 6 (Saturday).
    const today = new Date();
    const day = today.getDay();
    if (day === 0) {
      setMessage("Today is Sunday.");
      speak({ text: "sunday", voice: voices[voiceIndex], rate, pitch });
    } else if (day === 1) {
      setMessage("Today is Monday.");
      speak({ text: "monday", voice: voices[voiceIndex], rate, pitch });
    } else if (day === 2) {
      setMessage("Today is Tuesday.");
      speak({ text: "tuesday", voice: voices[voiceIndex], rate, pitch });
    } else if (day === 3) {
      setMessage("Today is Wednesday.");
      speak({ text: "wednesday", voice: voices[voiceIndex], rate, pitch });
    } else if (day === 4) {
      setMessage("Today is Thursday.");
      speak({ text: "thursday", voice: voices[voiceIndex], rate, pitch });
    } else if (day === 5) {
      setMessage("Today is Friday.");
      speak({ text: "friday", voice: voices[voiceIndex], rate, pitch });
    } else if (day === 6) {
      setMessage("Today is Saturday.");
      speak({ text: "saturday", voice: voices[voiceIndex], rate, pitch });
    }
  };
  /////////////////////////////////////////////////////////////////
  // <------------------------ Weather ------------------------> //
  /////////////////////////////////////////////////////////////////
  // Geolocation:
  useEffect(() => {
    const getLocation = async () => {
      await navigator.geolocation.getCurrentPosition(function (position) {
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
      });
    };
    getLocation();
  }, []);
  // fetch weather:
  const fetchWeather = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_WEATHER_API_URL}/onecall?lat=${lat}&lon=${long}&appid=${process.env.REACT_APP_WEATHER_API_KEY}&units=imperial`
    );
    const weather = await res.json();
    setWeatherData(weather);
    // console.log(weatherData);
    return weather;
  };
  // get current weather description:
  const getCurrentWeatherDescription = async () => {
    if (weatherData) {
      const weatherText = `${weatherData.current.weather[0].description}`;
      speak({ text: weatherText, voice: voices[voiceIndex] });
      setMessage(weatherText);
    } else {
      const weather = await fetchWeather();
      if (weather) {
        const weatherText = `${weather.current.weather[0].description}`;
        speak({ text: weatherText, voice: voices[voiceIndex] });
      }
    }
  };
  // get current temp:
  const getCurrentTemperature = async () => {
    if (weatherData) {
      const weatherText = `${weatherData.current.temp.toString()} degrees`;
      speak({ text: weatherText, voice: voices[voiceIndex] });
      setMessage(weatherText);
    } else {
      const weather = await fetchWeather();
      if (weather) {
        const weatherText = `${weather.current.temp.toString()} degrees`;
        speak({ text: weatherText, voice: voices[voiceIndex] });
      }
    }
  };
  // get current clouds:
  const getCurrentClouds = async () => {
    if (weatherData) {
      const weatherText = `${weatherData.current.clouds.toString()} %`;
      speak({ text: weatherText });
      setMessage(weatherText);
    } else {
      const weather = await fetchWeather();
      if (weather) {
        const weatherText = `${weather.current.clouds.toString()} %`;
        speak({ text: weatherText, voice: voices[voiceIndex] });
      }
    }
  };
  // get current humidity:
  const getCurrentHumidity = async () => {
    if (weatherData) {
      const weatherText = `${weatherData.current.humidity.toString()} %`;
      speak({ text: weatherText, voice: voices[voiceIndex] });
      setMessage(weatherText);
    } else {
      const weather = await fetchWeather();
      if (weather) {
        const weatherText = `${weather.current.humidity.toString()} %`;
        speak({ text: weatherText, voice: voices[voiceIndex] });
      }
    }
  };
  // get current moon phase
  const getMoonPhase = async () => {
    if (weatherData) {
      const phase = weatherData.daily[0].moon_phase;
      let currentPhase = "new moon";
      if (phase === 0.25) {
        currentPhase = "first quarter";
      } else if (phase === 0.5) {
        currentPhase = "full moon - that explains my mood.";
      } else if (phase === 0.75) {
        currentPhase = "last quarter";
      } else if (phase === 1 || phase === 0) {
        currentPhase = "new moon";
      } else if (phase > 0.75 && phase < 1) {
        currentPhase = "waning crescent";
      } else if (phase > 0.5 && phase < 0.75) {
        currentPhase = "waning gibous";
      } else if (phase > 0.25 && phase < 0.5) {
        currentPhase = "waxing gibous";
      } else if (phase > 0 && phase < 0.25) {
        currentPhase = "waxing crescent";
      }
      const weatherText = `${currentPhase}`;
      // speak({ text: weatherText, voice: voices[voiceIndex], });
      speak({ text: weatherText, voice: voices[voiceIndex], rate, pitch });
      setMessage(weatherText);
      // console.log("phase: ", weatherData.daily[0].moon_phase.toString());
    } else {
      speak({ text: "cannot fetch data", voice: voices[voiceIndex] });
    }
  };
  // get sunrise time:
  const getSunrise = async () => {
    if (weatherData) {
      const utc = `${weatherData.daily[0].sunrise}`;
      const date = new Date(utc * 1000);
      const timeString = date.toLocaleTimeString();
      const weatherText = timeString.split(":").join();
      speak({ text: weatherText, voice: voices[voiceIndex] });
      setMessage(timeString);
    } else {
      const weather = await fetchWeather();
      if (weather) {
        const weatherText = `${weather.daily[0].sunrise}`;
        speak({ text: weatherText, voice: voices[voiceIndex] });
      }
    }
  };
  // get sunset time:
  const getSunset = async () => {
    if (weatherData) {
      const utc = `${weatherData.daily[0].sunset}`;
      const date = new Date(utc * 1000);
      const timeString = date.toLocaleTimeString();
      const weatherText = timeString.split(":").join();
      speak({ text: weatherText, voice: voices[voiceIndex] });
      setMessage(timeString);
    } else {
      const weather = await fetchWeather();
      if (weather) {
        const weatherText = `${weather.daily[0].sunset}`;
        speak({ text: weatherText, voice: voices[voiceIndex] });
      }
    }
  };
  // get moonrise time:
  const getMoonrise = async () => {
    if (weatherData) {
      const utc = `${weatherData.daily[0].moonrise}`;
      const date = new Date(utc * 1000);
      const timeString = date.toLocaleTimeString();
      const weatherText = timeString.split(":").join();
      speak({ text: weatherText, voice: voices[voiceIndex] });
      setMessage(timeString);
    } else {
      const weather = await fetchWeather();
      if (weather) {
        const weatherText = `${weather.daily[0].moonrise}`;
        speak({ text: weatherText, voice: voices[voiceIndex] });
      }
    }
  };
  // get moonset time:
  const getMoonset = async () => {
    if (weatherData) {
      const utc = `${weatherData.daily[0].moonset}`;
      const date = new Date(utc * 1000);
      const timeString = date.toLocaleTimeString();
      const weatherText = timeString.split(":").join();
      speak({ text: weatherText, voice: voices[voiceIndex] });
      setMessage(timeString);
    } else {
      const weather = await fetchWeather();
      if (weather) {
        const weatherText = `${weather.daily[0].moonset}`;
        speak({ text: weatherText, voice: voices[voiceIndex] });
      }
    }
  };
  // get forecast:
  const getForecast = async () => {
    if (weatherData) {
      const monday = `${weatherData.daily[0].weather[0].description}`;
      const tuesday = `${weatherData.daily[1].weather[0].description}`;
      const wednesday = `${weatherData.daily[2].weather[0].description}`;
      const thursday = `${weatherData.daily[3].weather[0].description}`;
      const friday = `${weatherData.daily[4].weather[0].description}`;
      const saturday = `${weatherData.daily[5].weather[0].description}`;
      const sunday = `${weatherData.daily[6].weather[0].description}`;

      speak({
        text: `Monday: ${monday}, Tuesday: ${tuesday}, Wednesday: ${wednesday}, Thursday: ${thursday}, Friday: ${friday}, Saturday: ${saturday}, and Sunday: ${sunday}`,
        voice: voices[voiceIndex],
      });
      setMessage(
        `Monday: ${monday}, Tuesday: ${tuesday}, Wednesday: ${wednesday}, Thursday: ${thursday}, Friday: ${friday}, Saturday: ${saturday}, and Sunday: ${sunday}`
      );
    }
  };
  // get short forecast:
  const getShortForecast = async () => {
    if (weatherData) {
      const monday = `${weatherData.daily[0].weather[0].main}`;
      const tuesday = `${weatherData.daily[1].weather[0].main}`;
      const wednesday = `${weatherData.daily[2].weather[0].main}`;
      const thursday = `${weatherData.daily[3].weather[0].main}`;
      const friday = `${weatherData.daily[4].weather[0].main}`;
      const saturday = `${weatherData.daily[5].weather[0].main}`;
      const sunday = `${weatherData.daily[6].weather[0].main}`;

      speak({
        text: `Monday: ${monday}, Tuesday: ${tuesday}, Wednesday: ${wednesday}, Thursday: ${thursday}, Friday: ${friday}, Saturday: ${saturday}, and Sunday: ${sunday}`,
        voice: voices[voiceIndex],
      });
      setMessage(
        `Monday: ${monday}, Tuesday: ${tuesday}, Wednesday: ${wednesday}, Thursday: ${thursday}, Friday: ${friday}, Saturday: ${saturday}, and Sunday: ${sunday}`
      );
    }
  };
  // get the high temp:
  const getHigh = async () => {
    if (weatherData) {
      const weatherText = `${weatherData.daily[0].temp.max}`;

      speak({
        text: `${weatherText} degrees`,
        voice: voices[voiceIndex],
      });
      setMessage(`${weatherText} degrees`);
    }
  };
  // get the chance of rain:
  const getRainChance = async () => {
    if (weatherData) {
      const weatherText = `${weatherData.daily[0].pop}`;

      speak({
        text: `${weatherText} %`,
        voice: voices[voiceIndex],
      });
      setMessage(`${weatherText} %`);
    }
  };
  //////////////////////////////////////////////////////////////
  // <------------------------ Math ------------------------> //
  //////////////////////////////////////////////////////////////
  // Addition(2 nums):
  const add = (a, b) => {
    const c = parseInt(a) + parseInt(b);
    const ans = c.toString();
    setMessage(`${ans}`);
    speak({ text: `${ans}`, voice: voices[voiceIndex] });
    return ans;
  };
  // Subtraction(2 nums):
  const subtract = (a, b) => {
    const c = parseInt(a) - parseInt(b);
    const ans = c.toString();
    setMessage(`${ans}`);
    speak({ text: `${ans}`, voice: voices[voiceIndex] });
    return ans;
  };
  // Multiply(2 nums):
  const multiply = (a, b) => {
    const c = parseInt(a) * parseInt(b);
    const ans = c.toString();
    setMessage(`${ans}`);
    speak({ text: `${ans}`, voice: voices[voiceIndex] });
    return ans;
  };
  // Divide(2 nums):
  const divide = (a, b) => {
    const c = parseInt(a) / parseInt(b);
    const ans = c.toString();
    setMessage(`${ans}`);
    speak({ text: `${ans}`, voice: voices[voiceIndex] });
    return ans;
  };
  // Remainder:
  const remainder = (a, b) => {
    const c = parseInt(a) % parseInt(b);
    const ans = c.toString();
    setMessage(`${ans}`);
    speak({ text: `${ans}`, voice: voices[voiceIndex] });
    return ans;
  };
  const setWhisper = () => {
    setVoiceIndex(81);
    setMessage("ok i'll whisper");
    speak({ text: "ok I'll be quiet.", voice: voices[81] });
  };
  /////////////////////////////////////////////////////////////////
  // <----------------------- TRANSLATOR ----------------------> //
  /////////////////////////////////////////////////////////////////
  // Check API usage:
  const getUsage = async () => {
    const data = await fetch(
      "https://api-free.deepl.com/v2/usage?auth_key=26b78442-234b-ac27-1823-37eb1d698edc:fx"
    ).then((data) => data.json());
    console.log("usage data: ", data);
    if (data) {
      const charCount = `Your character count is at ${data.character_count.toString()} and your character limit is at ${data.character_limit.toString()}`;
      speak({
        text: charCount,
        voice: voices[voiceIndex],
      });
      setMessage(
        `Your character count is at ${data.character_count.toString()} and your character limit is at ${data.character_limit.toString()}`
      );
    } else {
      speak({
        text: "I'm sorry, I can't fetch that right now.",
        voice: voices[voiceIndex],
      });
      setMessage("I'm sorry, I can't fetch that right now.");
    }
  };
  // Fetch Languages:
  const getLanguages = async () => {
    const data = await fetch(
      "https://api-free.deepl.com/v2/languages?auth_key=26b78442-234b-ac27-1823-37eb1d698edc:fx"
    ).then((data) => data.json());
    setLangs([...data]);
    if (data) {
      return langs.data;
    } else {
      speak({
        text: "I'm sorry, I can't fetch that data right now.",
        voice: voices[voiceIndex],
      });
      setMessage("I'm sorry, I can't fetch that data right now.");
    }
  };
  // // Translate:
  // const translate = async (text) => {
  //   const translationText = text.split(" ").join("%20");
  //   try {
  //     const res = await fetch(
  //       `http://api-free.deepl.com/v2/translate?auth_key=26b78442-234b-ac27-1823-37eb1d698edc:fx&text=${translationText}&target_lang=es&source_lang=en`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/x-www-form-urlencoded",
  //         },
  //         body: JSON.stringify(translationText),
  //       }
  //     );
  //     await data
  //   } catch (err) {
  //     console.error(err);
  //   }
  //   if (data) {
  //     setTranslation(data);
  //     console.log("translation obj: ", data.translation[0]);
  //     console.log("translation: arr: ", data.translation);
  //   }
  // };
  /////////////////////////////////////////////////////////////////
  // <--------------------- AUDIO EARCONS ---------------------> //
  /////////////////////////////////////////////////////////////////
  // Bells10:
  const [playBells10] = useSound(Bells10);
  const handlePlayBells10 = () => {
    playBells10();
  };
  // Bells11:
  const [playBells11] = useSound(Bells11);
  const handlePlayBells11 = () => {
    playBells11();
  };
  // LoadingTone:
  const [playLoadingTone, { sound, stop, isPlaying }] = useSound(LoadingTone);
  const handlePlayLoadingTone = () => {
    playLoadingTone();
    sound.loop(true);
  };
  useEffect(() => stop, []);
  const handleStopLoadingTone = () => {
    stop();
  };
  // PowerDown7:
  const [playPowerDown7] = useSound(PowerDown7);
  const handlePlayPowerDown7 = () => {
    playPowerDown7();
  };
  // PowerUp18:
  const [playPowerUp18] = useSound(PowerUp18);
  const handlePlayPowerUp18 = () => {
    playPowerUp18();
  };
  // SynthChime8:
  const [playSynthChime8] = useSound(SynthChime8);
  const handlePlaySynthChime8 = () => {
    playSynthChime8();
  };
  // SynthChime9:
  const [playSynthChime9] = useSound(SynthChime9);
  const handlePlaySynthChime9 = () => {
    playSynthChime9();
  };
  // SynthChime11:
  const [playSynthChime11] = useSound(SynthChime11, {
    onend: () => {
      speak({
        text: "testing speech after audio",
        voice: voices[voiceIndex],
      });
      console.info("Sound has ended");
    },
  });
  const handlePlaySynthChime11 = () => {
    playSynthChime11();
  };
  // Quirky7:
  const [playQuirky7] = useSound(Quirky7);
  const handlePlayQuirky7 = () => {
    playQuirky7();
  };
  // Quirky8:
  const [playQuirky8] = useSound(Quirky8);
  const handlePlayQuirky8 = () => {
    playQuirky8();
  };
  // Sprinkle:
  const [playSprinkle] = useSound(Sprinkle);
  const handlePlaySprinkle = () => {
    playSprinkle();
  };
  // LowTuTone:
  const [playLowTuTone] = useSound(LowTuTone);
  const handlePlayLowTuTone = () => {
    playLowTuTone();
  };
  // Heard:
  const [playHeard] = useSound(Heard);
  const handlePlayHeard = () => {
    playHeard();
  };
  // timer:
  const [playTimer, { timerSound, timerStop, isTimerPlaying }] = useSound(
    timer,
    {
      onend: () => {
        speak({
          text: "timer has ended",
          voice: voices[voiceIndex],
        });
        console.info("Timer has ended");
      },
    }
  );
  const handlePlayTimer = () => {
    // would like to loop a couple times
    playTimer();
    timerSound.loop();
  };
  useEffect(() => timerStop, []);
  const handleTimerTone = () => {
    timerSound.loop();
    setTimeout(function (timerStop) {
      timerStop();
    }, 5000);
  };

  // Test:
  const [playSparkle] = useSound(hilo_sparkle);
  const handlePlayAudio = () => {
    playSparkle();
    // console.log("playing hilo_sparkle");
    // console.log("hilo_sparkle: ", hilo_sparkle);
  };
  const onEnd = () => {
    // Do something here after speaking has finished:
    // setMessage("audio testing...");
    // console.log("speaking : ", window.speechSynthesis.speaking);
    // console.log("msg: ", message);
  };
  const handlePlayAudioAndThenSpeak = () => {
    playSynthChime11();
    console.log();
  };

  /////////////////////////////////////////////////////////////////
  // <----------------------- COMMANDS -----------------------> //
  /////////////////////////////////////////////////////////////////
  const commands = [
    
  ];
  /////////////////////////////////////////////////////////////////
  // <------------------------- HOOKS -------------------------> //
  /////////////////////////////////////////////////////////////////
  // speech synth:
  // <-----------------------------------------------------------
  // const onEnd = () => {
  //   // You could do something here after speaking has finished
  // };

  const { speak, cancel, speaking, supported, voices } = useSpeechSynthesis({
    onEnd,
  });

  // Purpose of code below? <------------------------------------
  // I think it used to instantiate it? idk it's in the doc examples...
  const voice = voices[voiceIndex] || null;

  // // speech recog:
  // const {
  //   transcript,
  //   interimTranscript,
  //   finalTranscript,
  //   resetTranscript,
  //   listening,
  // } = useSpeechRecognition({ commands });

  const {
    transcript,
    interimTranscript,
    finalTranscript,
    resetTranscript,
    listening,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition({
    // transcribing,
    // clearTranscriptOnListen,
    commands,
  });

  
  useEffect(() => {
    if (interimTranscript !== '') {
      console.log('Got interim result:', interimTranscript)
    }
    if (finalTranscript !== '') {
      console.log('Got final result:', finalTranscript)
      // alert(finalTranscript)
      setMessage(`This is my mock-answer to "${finalTranscript}"`);
      speak({
        text: `This is my mock-answer to "${finalTranscript}"`,
        voice: voices[voiceIndex],
      });
    }
  }, [interimTranscript, finalTranscript]);
  

  // toggle show commands modal:
  const { isShowing, toggle } = useCommandsModal();

  /////////////////////////////////////////////////////////////////
  // <-------------------- EVENT HANDLERS ---------------------> //
  /////////////////////////////////////////////////////////////////
  // start animation/start listening:
  const handleMouseDown = async (e) => {
    e.preventDefault();

    const VirtualAss = document.getElementsByClassName("virtual-assistant");
    VirtualAss[0].classList.remove("paused");

    await SpeechRecognition.startListening({
      continuous: false,
      language: "en-US",
    });
  };
  // pause VA animation/stop listening:
  const handleMouseUp = async (e) => {
    e.preventDefault();

    const VirtualAss = document.getElementsByClassName("virtual-assistant");
    VirtualAss[0].classList.add("paused");

    // IN CASE OF EMERGENCY! <<<--------------------------!!
    // (Like when you try to make her read an entire monologue from Queen of the Damned for lulz and she get stuck unable to talk and you're afraid you broke it forever)
    // anyway, this is how you cancel the speech:
    // window.speechSynthesis.cancel();
    /*
    Tests:    
    console.log("speaking : ", window.speechSynthesis.speaking);
    console.log("listening : ", window.speechRecognition.listening);
    console.log("transcript : ", window.speechRecognition.transcript);
    console.log("interimTranscript : ", window.speechRecognition.interimTranscript);
    console.log("finalTranscript : ", window.speechRecognition.finalTranscript);
    console.log("commands : ", window.speechRecognition.commands);
    */

    await SpeechRecognition.stopListening();

  };
  // PROPS:
  const settingsProps = {
    voiceIndex,
    setVoiceIndex,
    rate,
    setRate,
    pitch,
    setPitch,
    // voices, <------ p sure I define this in settings anyway?
  };

  if (!browserSupportsSpeechRecognition) {
    console.log("Browser support? ", browserSupportsSpeechRecognition);
    return (
      <span>
        No browser support for Speech Recognition. Sorry, I'm trying to figure
        out polyfills{" "}
      </span>
    );
  }
  if (!supported) {
    return (
      <span>
        No browser support for Speech Synthesis. Sorry, I'm trying to figure out
        polyfills{" "}
      </span>
    );
  } else {
    return (
      <div className="page" id="VirtualAssistant">
        {/* {!supported && (
          <p>
            Oh no, it looks like your browser doesn't support Speech Synthesis.
          </p>
        )} */}
        {/* ///////////////////////////////////////////////////////////////// */}
        {/* <------------------------ COMMANDS MODAL -----------------------> */}
        {/* ///////////////////////////////////////////////////////////////// */}
        <CommandsModal isShowing={isShowing} hide={toggle} />
        <div className="center-col virtual-assistant-container">
          <div className="paused virtual-assistant"></div>
        </div>
        <div className="center-col main">
          {showSettings && <Settings {...settingsProps} />}
          {showTodos && <TodoList />}
          {!showSettings && !showTodos && (
            <div>
              <div>
                <div className="instructions-container">
                  {/* ///////////////////////////////////////////////////////////////// */}
                  {/* <----------------- INSTRUCTIONS/MESSAGE DISPLAY ----------------> */}
                  {/* ///////////////////////////////////////////////////////////////// */}

                  <div
                    className=" glass-panel"
                    id="instructions"
                    style={{
                      height: "150px",
                      width: "550px",
                      marginBottom: "1px",
                      value: { message },
                    }}
                  >
                    {message || "Hello, I'm a virtual assistant."}


                  </div>
                </div>
              </div>

              <div className="transcript-display">
                {/* ///////////////////////////////////////////////////////////////// */}
                {/* <-------------------------- TRANSCRIPT -------------------------> */}
                {/* ///////////////////////////////////////////////////////////////// */}
                <textarea
                  style={{
                    margin: "0px",
                    marginTop: "0px",
                    height: "150px",
                    width: "550px",
                  }}
                  className="glass-panel"
                  id="transcript"
                  value={transcript}
                  placeholder="Hold the button and ask your question"
                />{" "}
              </div>
            </div>
          )}
          <div className="form-container">
            <div
              className="center-col buttons"
              style={{ position: "relative", margin: "10px" }}
            >
              <div>
                {/* ///////////////////////////////////////////////////////////////// */}
                {/* <------------------------ HOT MIC "BTN" ------------------------> */}
                {/* ///////////////////////////////////////////////////////////////// */}
                <img className="hot-mic-btn" src={listening ? micOn : micOff} />
              </div>
              {/* ///////////////////////////////////////////////////////////////// */}
              {/* <------------------------- LISTEN BTN --------------------------> */}
              {/* ///////////////////////////////////////////////////////////////// */}
              <button
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                className="mic-btn"
              >
                🎤
              </button>
            </div>
          </div>
        </div>
        )
      </div>
    );
  }
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
