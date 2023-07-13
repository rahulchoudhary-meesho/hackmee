import React, { useState, useEffect } from 'react';
import './style.css';
import axios from 'axios';
import { speakText } from '../../Service/TextToSpeech';
import { getLanguages } from '../../Service/TranslateText';

function Chatbot() {
    const [showWindow, setShowWindow] = useState(false);
    const [inputText, setInputText] = useState('');
    const [detectLanguageKey, setdetectedLanguageKey] = useState('en');
    const [selectedLanguageKey, setLanguageKey] = useState('');
    const [languagesList, setLanguagesList] = useState([]);
    const [resultText, setResultText] = useState('');
    
    const toggleWindow = () => {
        setShowWindow(showWindow ? false : true);
    }

    const getLanguageSource = () => {
        axios.post(`https://libretranslate.de/detect`, {
            q: inputText
        })
        .then((response) => {
            setdetectedLanguageKey(response.data[0].language)
        })
    }
    
    

    const languageKey = (selectedLanguage) => {
        setLanguageKey(selectedLanguage.target.value)
    }

    const translateText = () => {
        getLanguageSource();

        let data = {
            q : inputText,
            source: detectLanguageKey,
            target: selectedLanguageKey
        }
        axios.post(`https://libretranslate.de/translate`, data)
        .then((response) => {
            setResultText(response.data.translatedText)
        })
    }

    const handleKnowMore = () => {
        toggleWindow();

    }

    const setLanguage = () => {
        localStorage.setItem('language-selected',selectedLanguageKey);
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
          <div className="chat-window-main">
            <div className='header'>
                <h3>Meesho Support</h3>
                <span onClick={toggleWindow}>x</span>
            </div>
            <div className='language-div'>
                <select className="language-select" onChange={languageKey}>
                    <option>Please Select Language..</option>
                    {languagesList.map((language) => {
                        return <option value={language.code}>{language.name}</option>;
                    })}
                </select>
                <button disabled={!selectedLanguageKey} onClick={setLanguage}>Choose a language</button>
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
            <tr>
                <td>123456</td>
                <td>300 Daily</td>
                <td>22,000</td>
                <td>1223435</td>
                <td>2323</td>
                <td>23532</td>
                <td>323526</td>
                <td>3</td>
                <td>
                    <p>Your campaign is giving Good Roi of 3.</p>
                    <p>But your campaign finishes budget by 10AM. You can get 30% more orders by increasing budget</p>
                    <button onClick={handleKnowMore}>Know More</button>
                </td>
            </tr>
        </table>
      </div>
    );
}

export default Chatbot;