import React, { useState, useEffect } from 'react';
import './style.css';
import axios from 'axios';
import { mockAnotherQuestions, mockQuestions, tableData } from '../../Constants/mockData';
import { Rating } from '@smastrom/react-rating';
import '@smastrom/react-rating/style.css'

function Chatbot() {
    const [showWindow, setShowWindow] = useState(false);
    const [selectedLanguageKey, setLanguageKey] = useState(localStorage.getItem('language-selected'));
    const [languagesList, setLanguagesList] = useState([]);
    const [textToSpeech, setTextToSpeech] = useState('');
    const [showLanguage, setShowLanguage] = useState(true);
    const [buttonDisable, setButtonDisable] = useState(false);
    const [firstMessage, setFirstMessage] = useState('');
    const [showFirstMessage, setShowFirstMessage] = useState(false);
    const [haveMoreQuestions, setShowHaveMoreQuestions] = useState(false);
    const [showRatingMeter, setShowRatingMeter] = useState(false);
    const [rating, setRating] = useState();
    const [secondLevelQuestion, setSecondLevelQuestions] = useState([]);
    const [showSecondLevelQuestion, setShowSecondLevelQuestion] = useState(false);
    const [selectedQuestion, setSelectedQuestion] = useState('');
    
    const toggleWindow = () => {
        setShowWindow(showWindow ? false : true);
    }
    
    const languageKey = (selectedLanguage) => {
        setLanguageKey(selectedLanguage.target.value);
    }

    const translateText = async (text) => {
        let data = {
            q : text,
            source: selectedLanguageKey === 'en' ? 'hi' : 'en',
            target: selectedLanguageKey
        }
        const res = await axios.post(`https://libretranslate.de/translate`, data);
        return res;
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
            const maleVoice = selectedLanguageKey === 'en' ? 'Google UK English Male' : 'Google हिन्दी-इंडिया';
            speech.voiceURI = maleVoice;
    
            // Adjusting speech speed
            speech.rate = selectedLanguageKey === 'en' ? 1 : 0.85; // Adjust the rate as desired (0.1 to 10)
            speechSynthesis.speak(speech);
            speech.onend = ()=>{
                setShowHaveMoreQuestions(true);
            };
        } else {
            console.log('Text-to-speech not supported in this browser.');
        }
    };

    const setLanguage = () => {
        localStorage.setItem('language-selected', selectedLanguageKey);
        translateText(textToSpeech).then((data)=> {
            setFirstMessage(data.data.translatedText);
            setShowFirstMessage(true);
            speakText(data.data.translatedText);
        });
        setButtonDisable(true);
    }

    // Rating Questions

    const SadFace = (
        <path d="M12.0000002,1.99896738 C17.523704,1.99896738 22.0015507,6.47681407 22.0015507,12.0005179 C22.0015507,17.5242217 17.523704,22.0020684 12.0000002,22.0020684 C6.47629639,22.0020684 1.99844971,17.5242217 1.99844971,12.0005179 C1.99844971,6.47681407 6.47629639,1.99896738 12.0000002,1.99896738 Z M12.0000002,3.49896738 C7.30472352,3.49896738 3.49844971,7.30524119 3.49844971,12.0005179 C3.49844971,16.6957946 7.30472352,20.5020684 12.0000002,20.5020684 C16.6952769,20.5020684 20.5015507,16.6957946 20.5015507,12.0005179 C20.5015507,7.30524119 16.6952769,3.49896738 12.0000002,3.49896738 Z M12.0000001,13.4979816 C13.6312483,13.4979816 15.1603686,14.1528953 16.2810488,15.2934358 C16.5713583,15.5888901 16.5671876,16.0637455 16.2717333,16.354055 C15.976279,16.6443646 15.5014236,16.6401939 15.211114,16.3447396 C14.3696444,15.4883577 13.2246935,14.9979816 12.0000001,14.9979816 C10.7726114,14.9979816 9.62535029,15.4905359 8.78347552,16.3502555 C8.49366985,16.6462041 8.01882223,16.6511839 7.72287367,16.3613782 C7.4269251,16.0715726 7.4219453,15.5967249 7.71175097,15.3007764 C8.83296242,14.155799 10.3651558,13.4979816 12.0000001,13.4979816 Z M9.00044779,8.75115873 C9.69041108,8.75115873 10.2497368,9.3104845 10.2497368,10.0004478 C10.2497368,10.6904111 9.69041108,11.2497368 9.00044779,11.2497368 C8.3104845,11.2497368 7.75115873,10.6904111 7.75115873,10.0004478 C7.75115873,9.3104845 8.3104845,8.75115873 9.00044779,8.75115873 Z M15.0004478,8.75115873 C15.6904111,8.75115873 16.2497368,9.3104845 16.2497368,10.0004478 C16.2497368,10.6904111 15.6904111,11.2497368 15.0004478,11.2497368 C14.3104845,11.2497368 13.7511587,10.6904111 13.7511587,10.0004478 C13.7511587,9.3104845 14.3104845,8.75115873 15.0004478,8.75115873 Z" />
      )
      
    const SmilingFace = (
        <path d="M12.0000002,1.99896738 C17.523704,1.99896738 22.0015507,6.47681407 22.0015507,12.0005179 C22.0015507,17.5242217 17.523704,22.0020684 12.0000002,22.0020684 C6.47629639,22.0020684 1.99844971,17.5242217 1.99844971,12.0005179 C1.99844971,6.47681407 6.47629639,1.99896738 12.0000002,1.99896738 Z M12.0000002,3.49896738 C7.30472352,3.49896738 3.49844971,7.30524119 3.49844971,12.0005179 C3.49844971,16.6957946 7.30472352,20.5020684 12.0000002,20.5020684 C16.6952769,20.5020684 20.5015507,16.6957946 20.5015507,12.0005179 C20.5015507,7.30524119 16.6952769,3.49896738 12.0000002,3.49896738 Z M8.46174078,14.7838355 C9.31087697,15.8615555 10.6018926,16.5020843 11.9999849,16.5020843 C13.396209,16.5020843 14.6856803,15.8632816 15.5349376,14.7880078 C15.7916692,14.4629512 16.2633016,14.4075628 16.5883582,14.6642944 C16.9134148,14.9210259 16.9688032,15.3926584 16.7120717,15.717715 C15.5813083,17.1494133 13.8601276,18.0020843 11.9999849,18.0020843 C10.1373487,18.0020843 8.41411759,17.1471146 7.28351576,15.7121597 C7.02716611,15.3868018 7.08310832,14.9152347 7.40846617,14.6588851 C7.73382403,14.4025354 8.20539113,14.4584777 8.46174078,14.7838355 Z M9.00044779,8.75115873 C9.69041108,8.75115873 10.2497368,9.3104845 10.2497368,10.0004478 C10.2497368,10.6904111 9.69041108,11.2497368 9.00044779,11.2497368 C8.3104845,11.2497368 7.75115873,10.6904111 7.75115873,10.0004478 C7.75115873,9.3104845 8.3104845,8.75115873 9.00044779,8.75115873 Z M15.0004478,8.75115873 C15.6904111,8.75115873 16.2497368,9.3104845 16.2497368,10.0004478 C16.2497368,10.6904111 15.6904111,11.2497368 15.0004478,11.2497368 C14.3104845,11.2497368 13.7511587,10.6904111 13.7511587,10.0004478 C13.7511587,9.3104845 14.3104845,8.75115873 15.0004478,8.75115873 Z" />
    )
    
    const myStyles = {
        itemShapes: [SadFace, SmilingFace],
        activeFillColor: ['#da1600', '#61bb00'],
        inactiveFillColor: '#a8a8a8'
    }

    const resetEverything = () => {
        setShowWindow(false);
        setButtonDisable(false);
        setShowFirstMessage(false);
        setShowHaveMoreQuestions(false);
        setShowRatingMeter(false);
    }

    const getMoreQuestions = () => {
        setSecondLevelQuestions([mockQuestions]);
        setShowSecondLevelQuestion(true);
        setShowHaveMoreQuestions(false);
    }

    const addMoreQuestions = () => {
        const question = [...secondLevelQuestion];
        question.push(mockAnotherQuestions);
        setSecondLevelQuestions(question, () => {debugger});
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
                {showLanguage && 
                    <div style={{paddingTop: '40px'}}>
                        <select className="language-select" onChange={languageKey}>
                            <option>Please Select Language..</option>
                            {languagesList.map((language) => {
                                return <option value={language.code} selected={language.code === selectedLanguageKey}>{language.name}</option>;
                            })}
                        </select>
                        <button disabled={buttonDisable} onClick={setLanguage}>Choose a language</button>
                    </div>
                }
                {showFirstMessage && 
                    <div className='message_box'>
                    <p style={{padding:0}}>
                        {firstMessage}
                    </p>
                    </div>
                }
                {haveMoreQuestions && 
                    <>
                        <p>
                            Have More Questions??
                        </p>
                        <div style={{display:'flex', alignItems: 'center', justifyContent: 'flex-start'}}>
                            <button style={{marginRight: 8}} onClick={getMoreQuestions}>Yes</button>
                            <button onClick={()=>setShowRatingMeter(true)}>No</button>
                        </div>
                    </>
                }
                {showRatingMeter && 
                    <div style={{display:'flex', justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
                        <Rating
                            style={{ maxWidth: 200 }}
                            value={rating}
                            onChange={setRating}
                            items={2}
                            itemStyles={myStyles}
                            highlightOnlySelected
                        />
                        <p style={{textAlign:'center'}}>Rate us</p>
                        <button onClick={resetEverything}>Submit Feedback</button>
                    </div>
                }
                {showSecondLevelQuestion && 
                    <div>
                        {secondLevelQuestion && secondLevelQuestion.map((data) => (
                            <>
                            <div>
                                Choose any one option from below suggestions - 
                                {data.follow_up_ques.map((question) => (
                                    <div className={`message_box ${selectedQuestion === question ? 'active': ''}`} onClick={()=>(setSelectedQuestion(question))} style={{cursor:'pointer'}}>
                                        <p style={{padding:0}}>{question}</p>
                                    </div>
                                ))}
                            </div>
                            {secondLevelQuestion.length > 1 && <hr></hr>}
                            </>
                        ))}
                        <button style={{cursor: 'pointer'}} onClick={addMoreQuestions}>Submit</button>
                    </div>
                }
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