import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Swal from 'sweetalert2';
import './Style.css';

const MyComponent = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [responses, setResponses] = useState([]);
    const { transcript, resetTranscript } = useSpeechRecognition();
    const [isRecording, setIsRecording] = useState(false);
    const [currentSkillLevel, setCurrentSkillLevel] = useState({ skill: '', level: '' });
    const [isReadingIntro, setIsReadingIntro] = useState(true);
    const [progress, setProgress] = useState(0);
    const [timeLeft, setTimeLeft] = useState(100);
    const [totalQuestions, setTotalQuestions] = useState(0); // New state for total questions

    const users = {
        username: user?.username,
        email: user?.email,
        role: user?.role
    };

    const getRandomQuestions = (questions, numQuestions) => {
        const shuffledQuestions = questions.sort(() => 0.5 - Math.random());
        return shuffledQuestions.slice(0, numQuestions);
    };

    useEffect(() => {
        const getData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL_MS2}/startinterview/getQuestions`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(users)
                });

                if (response.ok) {
                    const data = await response.json();
                    if (!data.questions || data.questions.length === 0) {
                        console.error('No questions found');
                        return;
                    }

                    let questionCount = 0; // Variable to keep track of total questions

                    const flattenedQuestions = data.questions.flatMap(skillLevel => {
                        const skillQuestions = Object.values(skillLevel.questions).map(question => ({
                            question,
                            skill: skillLevel.skill,
                            level: skillLevel.level
                        }));
                        questionCount += Math.min(skillQuestions.length, 15); // Add up to 15 questions per skill level
                        return getRandomQuestions(skillQuestions, 3);
                    });

                    if (flattenedQuestions.length === 0) {
                        console.error('No questions after flattening');
                        return;
                    }

                    setQuestions(flattenedQuestions);
                    setTotalQuestions(questionCount); // Update total questions
                    setCurrentSkillLevel({ skill: flattenedQuestions[0].skill, level: flattenedQuestions[0].level });
                } else {
                    console.error('Error fetching questions:', response.statusText);
                }
            } catch (error) {
                console.error('Error submitting data:', error);
            }
        };

        if (user) {
            getData();
        }
    }, [user]);

    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            handleNextQuestion();
        }
    }, [timeLeft]);

    const handleNextQuestion = async () => {
        const newResponses = [
            ...responses,
            {
                question: questions[currentQuestionIndex].question,
                response: transcript
            }
        ];
        
        setResponses(newResponses);
        resetTranscript();
        
        if (currentQuestionIndex < questions.length - 1) {
            const nextIndex = currentQuestionIndex + 1;
            const nextQuestion = questions[nextIndex];
        
            if (nextQuestion.skill !== currentSkillLevel.skill || nextQuestion.level !== currentSkillLevel.level) {
                setIsReadingIntro(true);
                setCurrentSkillLevel({ skill: nextQuestion.skill, level: nextQuestion.level });
            } else {
                setIsReadingIntro(false);
            }
        
            setCurrentQuestionIndex(nextIndex);
            setProgress((prevProgress) => prevProgress + 1);
            setTimeLeft(100); // Reset timer
        } else {
            handleSubmit(newResponses);
        }
    };

    const handleStartRecording = () => {
        setIsRecording(true);
        SpeechRecognition.startListening({ continuous: true });
    };

    const handleStopRecording = () => {
        setIsRecording(false);
        SpeechRecognition.stopListening();
    };

    useEffect(() => {
        if (questions.length > 0) {
            if (isReadingIntro) {
                const utterance = new SpeechSynthesisUtterance(`This is a ${currentSkillLevel.skill} question for ${currentSkillLevel.level} level.`);
                utterance.onend = () => setIsReadingIntro(false);
                speechSynthesis.speak(utterance);
            } else {
                const utterance = new SpeechSynthesisUtterance(questions[currentQuestionIndex].question);
                speechSynthesis.speak(utterance);
            }
        }
    }, [currentQuestionIndex, questions, isReadingIntro]);

    const handleSubmit = async (finalResponses = responses) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL_MS2}/Aiservice/scoreMyAnswer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ responses: finalResponses })
            });
    
            if (response.ok) {
                const result = await response.json();
                console.log(result, 'backend res');
    
                Swal.fire({
                    title: "Analysis Result",
                    text: "Here are your scores and feedback.",
                    imageUrl: "https://media.istockphoto.com/id/1384642917/vector/3d-quality-guarantee-vector-medal-with-star-and-ribbon-vector-illustration-icon-realistic-3d.webp?s=1024x1024&w=is&k=20&c=VcZrZFr6ztsmJ2Y7rgkzCZ3HDyW2W89R3ayyAYHRZWk=", // Custom image URL
                    imageWidth: 1000,
                    imageHeight: 200,
                    width:1000,
                    html: `<pre>${result.analysis}</pre>`, // Display analysis text in preformatted style
                    customClass: {
                        popup: 'custom-swal-width',  // Add custom class to the popup
                    },
                }).then(() => {
                    navigate('/dashboard'); // Navigate to the dashboard after closing the modal
                });
                
            } else {
                console.error('Error submitting answers');
            }
        } catch (error) {
            console.error('Error submitting answers:', error);
        }
    };

    if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
        return <div>Your browser does not support speech recognition software! Please use Chrome desktop, for example.</div>;
    }

    if (questions.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <div className="progress-bar">
                <div className="progress" style={{ width: `${(progress / totalQuestions) * 100}%` }}></div>
                <div className="progress-text">{progress}/{totalQuestions}</div>
            </div>
            <div className="timer-bar">
                <div className="timer" style={{ width: `${(timeLeft / 100) * 100}%` }}></div>
                <div className="timer-text">{timeLeft}s</div>
            </div>
            <div className="content">
                <div className="question-container">
                    <p className="question">
                        {isReadingIntro 
                            ? `This is a ${currentSkillLevel.skill} question for ${currentSkillLevel.level} level.`
                            : questions[currentQuestionIndex].question}
                    </p>
                </div>
                <div className="glowing-circle glow">
                    <div className="inner-circle">
                        <p className="inner-text">E</p>
                    </div>
                </div>
                <button className="voice-button" onClick={isRecording ? handleStopRecording : handleStartRecording}>
                    {isRecording ? 'Stop Recording' : 'Start answering'}
                </button>
                <button className="next-button" onClick={handleNextQuestion}>
                    {currentQuestionIndex < questions.length - 1 ? 'Next question' : 'Submit'}
                </button>
            </div>
        </div>
    );
};

export default MyComponent;
