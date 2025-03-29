const words = [
    { word: "cat", difficulty: "easy" },
    { word: "sun", difficulty: "easy" },
    { word: "umbrella", difficulty: "medium" },
    { word: "dyslexia", difficulty: "hard" },
  ];
  
  let currentIndex = 0;
  let score = 0;
  let recognition;
  let isListening = false;
  
  const wordDisplay = document.getElementById("word-display");
  const resultText = document.getElementById("result-text");
  const scoreDisplay = document.getElementById("score-display");
  const transcriptText = document.getElementById("transcript");
  const wordCount = document.getElementById("word-count");
  
  function speakWord() {
    const utterance = new SpeechSynthesisUtterance(words[currentIndex].word);
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  }
  
  function listenWord() {
    if (!recognition || isListening) return;
  
    resultText.textContent = "";
    transcriptText.textContent = "";
    isListening = true;
  
    recognition.start();
  }
  
  function validateSpokenWord(spoken) {
    const correct = words[currentIndex].word.toLowerCase() === spoken.toLowerCase();
    transcriptText.textContent = `You said: "${spoken}"`;
  
    if (correct) {
      resultText.textContent = "✅ Correct! Great job!";
      resultText.style.color = "green";
      score++;
      scoreDisplay.textContent = `Score: ${score}`;
    } else {
      resultText.textContent = `❌ Try again. The word was "${words[currentIndex].word}"`;
      resultText.style.color = "red";
    }
  }
  
  function nextWord() {
    if (currentIndex < words.length - 1) {
      currentIndex++;
      updateUI();
    } else {
      alert(`🎉 Exercise Complete! Final score: ${score}/${words.length}`);
    }
  }
  
  function prevWord() {
    if (currentIndex > 0) {
      currentIndex--;
      updateUI();
    }
  }
  
  function updateUI() {
    wordDisplay.textContent = "*".repeat(words[currentIndex].word.length);
    transcriptText.textContent = "";
    resultText.textContent = "";
    wordCount.textContent = `Word ${currentIndex + 1} of ${words.length}`;
  }
  
  function setupSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support speech recognition. Try Chrome.");
      return;
    }
  
    recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
  
    recognition.onresult = function (event) {
      const spoken = event.results[0][0].transcript;
      validateSpokenWord(spoken);
      isListening = false;
    };
  
    recognition.onerror = function (event) {
      console.error("Speech recognition error:", event.error);
      isListening = false;
      resultText.textContent = "Error with speech recognition.";
      resultText.style.color = "red";
    };
  
    recognition.onend = () => {
      isListening = false;
    };
  }
  
  window.addEventListener("DOMContentLoaded", () => {
    setupSpeechRecognition();
    updateUI();
  
    document.getElementById("speak-btn").addEventListener("click", speakWord);
    document.getElementById("listen-btn").addEventListener("click", listenWord);
    document.getElementById("next-btn").addEventListener("click", nextWord);
    document.getElementById("prev-btn").addEventListener("click", prevWord);
  });
  