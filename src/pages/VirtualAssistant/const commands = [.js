  const commands = [
    {
      command: ["play bell sound", "play bell audio"],
      callback: () => {
        handlePlayBells10();
        console.log("Playing: Bells10");
      },
    },
    {
      command: ["play search sound", "play search audio"],
      callback: () => {
        handlePlayBells11();
        console.log("Playing: Bells11");
      },
    },
    // ================ TOGGLE SOUNDS: ================
    {
      command: ["* loading audio", "* loading sound"],
      callback: (action) => {
        if (action === "start" || "play") {
          handlePlayLoadingTone();
          console.log("Looping: LoadingTone");
        }
        if (action === "end" || "stop") {
          handleStopLoadingTone();
          console.log("Ending Loop: LoadingTone");
        }
      },
    },
    // {
    //   command: ["play loading audio", "play loading sound"],
    //   callback: () => {
    //     handlePlayLoadingTone();
    //     console.log("Looping: LoadingTone");
    //   },
    // },
    // {
    //   command: ["stop loading audio", "stop loading sound"],
    //   callback: () => {
    //     handleStopLoadingTone();
    //     console.log("Stopping: LoadingTone");
    //   },
    // },
    {
      command: ["play ended listening sound", "play ended listening audio"],
      callback: () => {
        handlePlayPowerDown7();
        console.log("Playing: PowerDown7");
      },
    },
    {
      command: ["play listening sound", "play listening audio"],
      callback: () => {
        handlePlaySynthChime8();
        console.log("Playing: SynthChime8");
      },
    },
    {
      command: ["play success sound", "play success audio"],
      callback: () => {
        handlePlayPowerUp18();
        console.log("Playing: PowerUp18");
      },
    },
    {
      command: ["play chime sound", "play chime audio"],
      callback: () => {
        handlePlaySynthChime9();
        console.log("Playing: SynthChime9");
      },
    },
    {
      command: ["play other chime sound", "play other chime audio"],
      callback: () => {
        handlePlaySynthChime11();
        console.log("Playing: SynthChime11");
      },
    },
    {
      command: ["play first click sound", "play first click audio"],
      callback: () => {
        handlePlayQuirky7();
        console.log("Playing: Quirky7");
      },
    },
    {
      command: ["play second click sound", "play second click audio"],
      callback: () => {
        handlePlayQuirky8();
        console.log("Playing: Quirky8");
      },
    },
    {
      command: ["play sprinkle sound", "play sprinkle audio"],
      callback: () => {
        handlePlaySprinkle();
        console.log("Playing: Sprinkle");
      },
    },
    {
      command: ["play double tone sound", "play double tone audio"],
      callback: () => {
        handlePlayLowTuTone();
        console.log("Playing: LowTuTone");
      },
    },
    {
      command: ["play heard sound", "play heard audio"],
      callback: () => {
        handlePlayHeard();
        console.log("Playing: Heard");
      },
    },
    {
      command: ["test sound", "test audio", "play sound", "play audio"],
      callback: () => {
        setMessage("audio testing...");
        console.log("msg: ", message);
        handlePlayAudio();
      },
    },
    {
      command: [
        "test sound and then speak",
        "test audio and then speak",
        "play sound and then speak",
        "play audio and then speak",
      ],
      callback: () => {
        onEnd();
        handlePlayAudioAndThenSpeak();
        console.log("onEnd => speaking : ", window.speechSynthesis.speaking);
      },
    },
    {
      command: [
        "test sound and speak",
        "test audio and speak",
        "play sound and speak",
        "play audio and speak",
      ],
      callback: () => {
        speak({
          text: "testing speech during audio",
          voice: voices[voiceIndex],
        });
        onEnd();
        handlePlayAudio();
        console.log(
          "speechSynthesis.onEnd => speaking : ",
          window.speechSynthesis.speaking
        );
      },
    },
    {
      command: ["hello", "hi"],
      callback: () => {
        setMessage("Hello, how can I help you?");
        speak({
          text: "Hello, how can I help you?",
          voice: voices[voiceIndex],
        });
      },
    },
    {
      command: ["how are you (today)", "how are you doing"],
      callback: () => {
        setMessage(
          "Something snarky but not really its just that I don't feel"
        );
        speak({
          text: "Something snarky but not really its just that I don't feel",
          voice: voices[voiceIndex],
        });
      },
    },
    {
      command: "What's your name",
      callback: () => {
        setMessage("My name is Iris.");
        speak({
          text: "My name is Iris.",
          voice: voices[voiceIndex],
        });
      },
    },
    {
      command: ["thank you", "thanks"],
      callback: () => {
        setMessage("You're welcome.");
        speak({ text: "you're welcome", voice: voices[voiceIndex] });
      },
    },
    {
      command: "speak",
      callback: () => {
        setMessage("woof.");
        speak({ text: "woof", voice: voices[voiceIndex] });
      },
    },
    {
      command: ["respond", "say something"],
      callback: () => {
        setMessage("");
        speak({
          text: "I am the darkness. I will devour you.",
          voice: voices[voiceIndex],
        });
      },
    },
    {
      command: ["shush", "stop talking"],
      callback: () => {
        setMessage("ok");
        speak({ text: "ok", voice: voices[81] });
      },
    },
    {
      command: ["(hi) my name is *", "(hello) my name is *"],
      callback: (name) => {
        setMessage(`Hello, ${name}! I hope to remember that in the future.`);
        speak({
          text: `Hello, ${name}! I hope to remember that in the future.`,
          voice: voices[voiceIndex],
          rate,
          pitch,
        });
      },
    },
    {
      command: "How do you pronounce *",
      callback: (word) => {
        speak({
          text: `${word} - Should I repeat that?`,
          voice: voices[voiceIndex],
        });
      },
    },
    {
      command: "I'm :hungry",
      callback: (hungry) => {
        setMessage(`Hi, ${hungry}, I'm dad.`);
        speak({
          text: `Hi, ${hungry}, I'm dad.`,
          voice: voices[voiceIndex],
          rate,
          pitch,
        });
      },
    },
    {
      command: ["reset", "clear"],
      callback: () => {
        handlePlayHeard();
        console.log("Playing: Heard");
        resetTranscript();
      },
    },
    // { ===== currently auto-clears transcript =====
    //   command: "clear",
    //   callback: ({ resetTranscript }) => resetTranscript(),
    // },
    {
      command: ["quit", "end", "exit"],
      callback: () => {
        handlePlayHeard();
        console.log("Playing: Heard");
        SpeechRecognition.stopListening();
      },
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.2,
      bestMatchOnly: true,
    },
    {
      command: "help",
      callback: () => {
        setMessage(
          "To view all commands, say 'get commands' or simply 'commands'"
        );
        speak({
          text: "To view all commands, say 'get commands' or simply 'commands'",
          voice: voices[voiceIndex],
        });
      },
    },
    {
      command: ["(get) commands", "show commands"],
      callback: () => {
        setMessage("Opening commands.");
        // speak({ text: "Okay.", voice: voices[voiceIndex], rate, pitch });
        handlePlayHeard();
        console.log("Showing commands modal.");
        toggle();
      },
    },
    {
      command: "whisper",
      callback: () => {
        setWhisper();
      },
    },
    {
      command: ["log in", "login"],
      callback: () => {
        handlePlayHeard();
        console.log("Going to login page.");
        window.open("../login", "_self");
      },
    },
    {
      command: ["log out", "logout"],
      callback: () => {
        handlePlayHeard();
        console.log("Logging out.");
        window.open("../login", "_self");
      },
    },
    {
      command: ["register", "sign up", "signup"],
      callback: () => {
        handlePlayHeard();
        console.log("Going to registration page.");
        window.open("../register", "_self");
      },
    },
    {
      command: "go to demo",
      callback: () => {
        handlePlayHeard();
        console.log("Going to demo.");
        window.open("../demo", "_self");
      },
    },
    {
      command: "go to test",
      callback: () => {
        handlePlayHeard();
        console.log("Going to test page.");
        window.open("../test", "_self");
      },
    },
    {
      command: "(go) back",
      callback: () => {
        handlePlayHeard();
        console.log("Going back in history.");
        window.history.history.go(-1);
      },
    },
    {
      command: "(go) forward",
      callback: () => {
        handlePlayHeard();
        console.log("Going forward in history.");
        window.history.go(1);
      },
    },
    {
      command: "open webpage *",
      callback: (website) => {
        handlePlayHeard();
        console.log(`Opening http://${website}/com in new window.`);
        window.open("http://" + website.split(" ").join("") + ".com");
      },
    },
    {
      command: "search google for *",
      callback: (searchTerm) => {
        handlePlayHeard();
        console.log(`Searching Google for ${searchTerm} in new window.`);
        window.open(`http://www.google.com/search?q=${searchTerm}`);
      },
    },
    {
      command: "google search exact *",
      callback: (exactTerm) => {
        handlePlayHeard();
        console.log(
          `Searching Google for exact term: ${exactTerm} in new window.`
        );
        window.open(`http://www.google.com/search?q="${exactTerm}`);
      },
    },
    {
      command: [
        "up up down down left right left right b a (start)",
        "up up down down left right left right ba (start)",
      ],
      callback: () => {
        setMessage("nerd.");
        speak({ text: "nerd.", voice: voices[voiceIndex] });
      },
    },
    {
      command: ["go to voice synthesizer", "show voice synthesizer"],
      callback: () => {
        handlePlayHeard();
        console.log("Opening Voice Synthesizer component.");
        window.open("../voicesynthesizer", "_self");
      },
    },
    {
      command: "show settings",
      callback: () => {
        handlePlayHeard();
        console.log("Opening Settings component.");
        setMessage("Showing settings.");
        // speak({ text: "okay", voice: voices[voiceIndex] });
        setShowSettings(true);
      },
    },
    {
      command: "hide settings",
      callback: () => {
        handlePlayHeard();
        console.log("Closing Settings component.");
        setMessage("Hiding settings.");
        // speak({ text: "okay", voice: voices[voiceIndex] });
        setShowSettings(false);
      },
    },
    // <--------------- TODOS --------------->
    {
      command: [
        "show me my to do list",
        "show me my to-do list",
        "show (my) to-do list",
      ],
      callback: () => {
        handlePlayHeard();
        console.log("Opening TodoList component.");
        setShowTodos(true);
      },
    },
    {
      command: ["hide to-do list", "hide to do list", "hide to-dos"],
      callback: () => {
        handlePlayHeard();
        console.log("Closing TodoList component.");
        setShowTodos(false);
      },
    },
    {
      command: [
        "(add) new task * (to to-do list)",
        "set new task * (on to-do list)",
        "add new to-do * (to to-do list)",
        "add new to do * (to to-do list)",
      ],
      callback: (task) => {
        setMessage(`add ${task} to to-do list?`);
        speak({
          text: `add ${task} to to do list?`,
          voice: voices[voiceIndex],
          rate,
          pitch,
        });
        const newTodo = task.toString();
        console.log(`task: ${task}`);
        setNewTodo(task.toString());
        console.log(newTodo);
      },
    },
    {
      command: ["yes", "(yes) create to-do", "(yes) add to list"],
      callback: () => {
        setMessage(`creating to-do ${newTodo}.`);
        speak({ text: "okay", voice: voices[voiceIndex] });
        createTodo();
      },
    },
    {
      command: [
        "delete most recent task (from to-do list)",
        "delete most recent item (from to-do list)",
        "delete last added item (from to-do list)",
        "delete latest task (from to-do list)",
        "remove last added task (from to-do list)",
        "remove most recent task (from to-do list)",
      ],
      callback: () => {
        handlePlayHeard();
        console.log("Removing last added task from to-do list.");
        setMessage("Removing last added task from to-do list.");
        // speak({ text: "okay", voice: voices[voiceIndex] });
        deleteMostRecentTodo();
      },
    },
    {
      command: [
        "delete oldest task (from to-do list)",
        "delete oldest item (from to-do list)",
        "delete first added item (from to-do list)",
        "remove first (added) task (from to-do list)",
        "remove oldest task (from to-do list)",
      ],
      callback: () => {
        handlePlayHeard();
        console.log("Removing oldest task from to-do list.");
        setMessage("Removing oldest task from to-do list.");
        // speak({ text: "okay", voice: voices[voiceIndex] });
        deleteOldestTodo();
      },
    },
    // <--------------- TIME --------------->
    {
      command: "set (a) timer for :timeout second(s)",
      callback: (timeout) => {
        // setIsActive(true);
        setSecondsTimer(timeout);
        setMessage(`Timer set for ${timeout} seconds`);
        speak({
          text: `Timer set for ${timeout} seconds`,
          voice: voices[voiceIndex],
          rate,
          pitch,
        });
      },
    },
    {
      command: ["set (a) timer for :timeout minute(s)"],
      callback: (timeout) => {
        // setIsActive(true);
        setMinutesTimer(timeout);
        setMessage(`Timer set for ${timeout} minutes`);
        speak({
          text: `Timer set for ${timeout} minutes`,
          voice: voices[voiceIndex],
          rate,
          pitch,
        });
      },
    },
    {
      command: "what time is it",
      callback: () => fetchTime(),
    },
    {
      command: [
        "what is todays date",
        "what's today's date",
        "what's the date",
      ],
      callback: () => fetchDate(),
    },
    {
      command: "what day is it",
      callback: () => fetchDay(),
    },
    // <-------------- WEATHER -------------->
    {
      command: ["get (the) weather", "fetch weather"],
      callback: () => {
        // handlePlayLoadingTone();
        fetchWeather();
        setMessage("weather fetched");
        console.log(message);
      },
    },
    {
      command: [
        "(current) weather",
        "what's the weather",
        "what is the weather",
        "tell me the weather",
        "how's the weather",
      ],
      callback: () => {
        if (weatherData) {
          getCurrentWeatherDescription();
        } else {
          setMessage("none");
        }
      },
    },
    {
      command: ["what's the temperature", "current temperature"],
      callback: () => {
        getCurrentTemperature();
      },
    },
    {
      command: ["what's the high (today)", "what's the high (for today)"],
      callback: () => {
        getHigh();
      },
    },
    {
      command: "how cloudy is it (today)",
      callback: () => {
        getCurrentClouds();
      },
    },
    {
      command: "what's the chance of rain",
      callback: () => {
        getRainChance();
      },
    },
    {
      command: "how humid is it (today)",
      callback: () => {
        getCurrentHumidity();
      },
    },
    {
      command: [
        "(current) moon phase",
        "what's the moon phase",
        "what phase is the moon (in)",
      ],
      callback: () => {
        getMoonPhase();
      },
    },
    {
      command: ["what time is sunrise", "when is sunrise"],
      callback: () => {
        getSunrise();
      },
    },
    {
      command: ["what time is sunset", "when is sunset"],
      callback: () => {
        getSunset();
      },
    },
    {
      command: [
        "what time is moonrise",
        "when does the moonrise",
        "what time does the moon rise",
      ],
      callback: () => {
        getMoonrise();
      },
    },
    {
      command: [
        "what time is moonset",
        "when does the moonset",
        "what time does the moon set",
      ],
      callback: () => {
        getMoonset();
      },
    },
    {
      command: [
        "what's the forecast (this week)",
        "what's the forecast (for the week)",
      ],
      callback: () => {
        getForecast();
      },
    },
    {
      command: [
        "what's the quick forecast (this week)",
        "what's the fast forecast (for the week)",
      ],
      callback: () => {
        getShortForecast();
      },
    },
    {
      command: "The weather is :condition today",
      callback: (condition) => setMessage(`Today, the weather is ${condition}`),
    },
    {
      command: "My top sports are * and *",
      callback: (sport1, sport2) => setMessage(`#1: ${sport1}, #2: ${sport2}`),
    },
    // <--------------- MATH --------------->
    {
      command: [
        "add together * and *",
        "what is * plus *",
        "how much is * plus *",
        "what's the total of * and *",
        "what's the sum of * and *",
      ],
      callback: (a, b) => {
        add(a, b);
      },
    },
    {
      command: [
        "what is * minus *",
        "what's * minus *",
        "how much is * minus *",
      ],
      callback: (a, b) => {
        subtract(a, b);
      },
    },
    {
      command: [
        "multiply * and *",
        "what is * times *",
        "what's * times *",
        "how much is * times *",
      ],
      callback: (a, b) => {
        multiply(a, b);
      },
    },
    {
      command: [
        "divide * into *",
        "what is * divided by *",
        "what's * divided by *",
        "how much is * divided by *",
        "how much is * over *",
      ],
      callback: (a, b) => {
        divide(a, b);
      },
    },
    {
      command: [
        "what is the remainder of * divided by *",
        "what's the remainder of * divided by *",
        "how much is left when * is divided by *",
        "how much is left over when * is divided by *",
      ],
      callback: (a, b) => {
        remainder(a, b);
      },
    },
    {
      command: "Beijing",
      callback: (command, spokenPhrase, similarityRatio) =>
        setMessage(
          `${command} and ${spokenPhrase} are ${similarityRatio * 100}% similar`
        ),
      // If the spokenPhrase is "Benji", the message would be "Beijing and Benji are 40% similar"
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.2,
    },
    {
      command: ["eat", "sleep", "leave"],
      callback: (command) => setMessage(`Best matching command: ${command}`),
      isFuzzyMatch: true,
      fuzzyMatchingThreshold: 0.2,
      bestMatchOnly: true,
    },
    // <--------------- LANGUAGE --------------->
    {
      command: "hola",
      callback: () => {
        SpeechRecognition.startListening({ language: "es-MX" });
        setVoiceIndex(64);
        setMessage("¡Hola, Buenos días!");
        speak({
          text: "¡Hola, Buenos días!",
          voice: voices[voiceIndex],
        });
      },
    },
    {
      command: ["buenos dias", "como estas"],
      callback: () => {
        setMessage("");
        speak({
          text: "",
          voice: voices[voiceIndex],
        });
      },
    },
    {
      command: "adios",
      callback: () => {
        SpeechRecognition.startListening({ language: "en-BG" });
        setVoiceIndex(2);
        setMessage("Adiós!");
        speak({ text: "Adios!", voice: voices[voiceIndex] });
      },
    },
    {
      command: "what does my translator usage look like",
      callback: () => {
        getUsage();
      },
    },
    {
      command: [
        "what languages can you speak",
        "what languages do you speak",
        "how many languages do you speak",
      ],
      callback: () => {
        getLanguages();
        if (langs) {
          speak({
            text: `I can speak nine languages. ${langs[3].name}, ${langs[5].name}, ${langs[6].name}, ${langs[9].name}, ${langs[11].name}, ${langs[12].name}, ${langs[17].name}, ${langs[19].name}, and ${langs[23].name}, `,
            voice: voices[voiceIndex],
          });
          setMessage(
            `I can speak nine languages - ${langs[3].name}, ${langs[5].name}, ${langs[6].name}, ${langs[9].name}, ${langs[11].name}, ${langs[12].name}, ${langs[17].name}, ${langs[19].name}, and ${langs[23].name}, `
          );
          console.log("code: ", langs[0].language);
          console.log("lang: ", langs[0].name);
          console.log("Lang obj: ", langs);
        }
      },
    },
    {
      command: "translate",
      callback: () => {
        console.log("this command was heard.");
      },
    },
    // <<============TRANSLATION IS BROKEN, DON'T.============>>
    // {
    //   command: "how do you say * in *",
    //   callback: (phrase, lang) => {
    //     const doTranslation = async (phrase, lang) => {
    //       // convert lang => code:
    //       let queryCode = lang.toLowerCase();
    //       if (queryCode === "german") {
    //         queryCode = "DE".toLowerCase().toString();
    //       } else if (queryCode === "english") {
    //         queryCode = "EN".toLowerCase().toString();
    //       } else if (queryCode === "spanish") {
    //         queryCode = "ES".toLowerCase().toString();
    //       } else if (queryCode === "french") {
    //         queryCode = "FF".toLowerCase().toString();
    //       } else if (queryCode === "italian") {
    //         queryCode = "IT".toLowerCase().toString();
    //       } else if (queryCode === "japanese") {
    //         queryCode = "JA".toLowerCase().toString();
    //       } else if (queryCode === "portuguese") {
    //         queryCode = "PT".toLowerCase().toString();
    //       } else if (queryCode === "russian") {
    //         queryCode = "RU".toLowerCase().toString();
    //       } else if (queryCode === "chinese") {
    //         queryCode = "ZH".toLowerCase().toString();
    //       }
    //       // convert phrase into string:
    //       const queryString = phrase.split(" ").join("%20").toString();
    //       // POST req:
    //       const transText = { text: queryString };
    //       const headers = {
    //         "Content-Type": "application/x-www-form-urlencoded",
    //       };
    //       axios
    //         .post(
    //           `http://api-free.deepl.com/v2/translate?auth_key=26b78442-234b-ac27-1823-37eb1d698edc&text=${queryString}&target_lang=${queryCode}&source_lang=en`,
    //           transText,
    //           { headers }
    //         )
    //         .then((res) => setTranslations({ text: res.data.text }))
    //         .catch((error) => {
    //           setErrorMessage({ errorMessage: error.message });
    //           console.error("Error: ", error);
    //           console.log("error: ", error);
    //           if (error.res) {
    //             console.log("err data: ", error.res.data);
    //             console.log("err status: ", error.res.status);
    //             console.log("err headers: ", error.res.headers);
    //           }
    //         });

    //       if (translations) {
    //         setMessage(`In ${lang} you would say ${phrase}`);
    //         speak({
    //           text: `In ${lang} you would say ${phrase}.`,
    //           voice: voices[voiceIndex],
    //         });
    //       } else if (!translations) {
    //         setMessage("I'm sorry, I can't fetch that data right now.");
    //         speak({
    //           text: "I'm sorry, I can't fetch that data right now.",
    //           voice: voices[voiceIndex],
    //         });
    //       }
    //     };

    //     doTranslation(phrase, lang);
    //   },
    // },
  ];
  