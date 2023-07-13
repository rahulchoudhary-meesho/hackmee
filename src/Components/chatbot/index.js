import React, { useState, useEffect } from 'react';
import './style.css';
import axios from 'axios';
import { tableData } from '../../Constants/mockData';

function Chatbot() {
    const [showWindow, setShowWindow] = useState(false);
    const [selectedLanguageKey, setLanguageKey] = useState(localStorage.getItem('language-selected'));
    const [languagesList, setLanguagesList] = useState([]);
    const [resultText, setResultText] = useState('');
    const [textToSpeech, setTextToSpeech] = useState('');
    const [showLanguage, setShowLanguage] = useState(true);
    const [buttonDisable, setButtonDisable] = useState(localStorage.getItem('language-selected') ? false : true);
    
    const toggleWindow = () => {
        setShowWindow(showWindow ? false : true);
    }
    
    const languageKey = (selectedLanguage) => {
        setLanguageKey(selectedLanguage.target.value);
    }

    const translateText = (text) => {
        let data = {
            q : text,
            source: selectedLanguageKey === 'en' ? 'hi' : 'en',
            target: selectedLanguageKey
        }
        debugger;
        axios.post(`https://libretranslate.de/translate`, data)
        .then((response) => {
            debugger;
            setResultText(response.data.translatedText);
        })
    }

    const handleKnowMore = (text) => {
        toggleWindow();
        setTextToSpeech(text);
    }

    const speakText = (text) => {
        if ('speechSynthesis' in window) {
            const speech = new SpeechSynthesisUtterance();
            speech.text = text;
            speech.lang = selectedLanguageKey === 'en' ? 'en-US' : 'hi-IN';
            // Selecting a male voice
            const voices = speechSynthesis.getVoices();
            const maleVoice = voices.find((voice) => (selectedLanguageKey === 'en' ? (voice.name === 'Google UK English Male') : (voice.name === 'Google हिन्दी-इंडिया')));
            speech.voice = maleVoice;
    
            // Adjusting speech speed
            speech.rate = selectedLanguageKey === 'en' ? 1 : 0.85; // Adjust the rate as desired (0.1 to 10)
            speechSynthesis.speak(speech);
            speech.onend = ()=>{
                debugger;
            };
        } else {
            console.log('Text-to-speech not supported in this browser.');
        }
    };

    const setLanguage = () => {
        debugger;
        localStorage.setItem('language-selected', selectedLanguageKey);
        translateText(textToSpeech);
        debugger;
        speakText(resultText);
        let p = document.createElement('p');
        debugger;
        p.textContent = resultText;
        document.getElementById('chatWindow').appendChild(p);
        debugger;
        setButtonDisable(true);
    }

    useEffect(() => {
        axios.get(`https://libretranslate.de/languages`)
        .then((response) => {
            const langs = response.data.filter((language) => {
                return language.code === 'en' || language.code === 'hi';
            });
            setLanguagesList(langs);
        })
    }, [])

    return (
      <div backgroundColor={'red'} width={'20%'}>
        {showWindow && (
          <div className="chat-window-main" id="chatWindow">
            <div className='header'>
                <h3>Meesho Support</h3>
                <span onClick={toggleWindow}>x</span>
            </div>
            <div className='language-div'>
                {showLanguage && <><select className="language-select" onChange={languageKey}>
                    <option>Please Select Language..</option>
                    {languagesList.map((language) => {
                        return <option value={language.code} selected={language.code === selectedLanguageKey}>{language.name}</option>;
                    })}
                </select>
                <button disabled={false} onClick={setLanguage}>Choose a language</button></>}
            </div>
          </div>
        )}
        <table>
            <tr style={{background:'rgb(230, 235, 242)'}}>
                <th>Campaign</th>
                <th>Budget</th>
                <th>Budget Utilised</th>
                <th>Views</th>
                <th>Clicks</th>
                <th>Orders</th>
                <th>Revenue</th>
                <th>ROI</th>
                <th>Insights</th>
            </tr>
            {tableData.map((row) => (<tr>
                <td>{row.campaign}</td>
                <td>{row.budget}</td>
                <td>{row.budget_utilized}</td>
                <td>{row.views}</td>
                <td>{row.clicks}</td>
                <td>{row.orders}</td>
                <td>{row.revenue}</td>
                <td>{row.roi}</td>
                <td>
                    <p>{row.insight}</p>
                    <button onClick={() => handleKnowMore(row.audio_text)}>Know More</button>
                </td>
            </tr>))}
        </table>
      </div>
    );
}

export default Chatbot;