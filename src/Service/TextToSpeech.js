export const speakText = (text) => {
    if ('speechSynthesis' in window) {
        const speech = new SpeechSynthesisUtterance();
        speech.text = text;
        speech.lang = 'hi-IN';
        // Selecting a male voice
        const voices = speechSynthesis.getVoices();
        const maleVoice = voices.find((voice) => voice.name === 'Google हिन्दी-इंडिया');
        speech.voice = maleVoice;

        // Adjusting speech speed
        speech.rate = 0.85; // Adjust the rate as desired (0.1 to 10)
        speechSynthesis.speak(speech);
        speech.onend = ()=>{
            debugger;
        };
    } else {
        console.log('Text-to-speech not supported in this browser.');
    }
};