import React, { useState } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import { useNavigate } from 'react-router-dom';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body, html {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    background-color: #e6e6ff;
    font-family: Arial, sans-serif;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 20px;
`;

const Box = styled.div`
  background-color: #ffffff;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 800px;

`;

const Title = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
  font-weight: bold;
`;

const Note = styled.p`
  font-size: 12px;
  color: #999999;
  margin-top: 20px;
  text-align: center;
`;

const Button = styled.button`
  width: 30%;
  padding: 10px;
  background-color: #6666ff;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left : auto;
  margin-right:auto;
  display:flex;
  justify-content:center;
  font-size: 16px;
  margin-top: 20px;
  border-radius:30px;
  &:hover {
    background-color: #5555ff;
  }
`;

const SubmitButton = styled.button`
  width: 30%;
  padding: 10px;
  background-color: #6666ff;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left : auto;
  margin-right:auto;
  display:flex;
  justify-content:center;
  font-size: 16px;
  margin-top: 20px;
  border-radius:30px;
  &:hover {
    background-color: #5555ff;
  }
`;

const MicCheck = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [clickContinue, setClickContinue] = useState(false);
  const { startRecording, stopRecording, mediaBlobUrl } = useReactMediaRecorder({ audio: true });
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (isRecording) {
      stopRecording();
      setIsRecording(false);
    } else {
      startRecording();
      setIsRecording(true);
      setAudioUrl(null);
    }
  };

  const handleClickContinue = () => {
    setClickContinue(true);
    if (clickContinue) {
      navigate('/start-interview');
    }
  };

  React.useEffect(() => {
    if (mediaBlobUrl) {
      setAudioUrl(mediaBlobUrl);
    }
  }, [mediaBlobUrl]);

  return (
    <Container>
      <GlobalStyle />
      <Box>
        <Title>Check Microphone</Title>
        <Note>Speak and pause to check your Microphone; you will then hear your voice.</Note>
        <Button onClick={handleButtonClick}>
          {isRecording ? 'Pause' : 'Speak'}
        </Button>
        {audioUrl && !isRecording && (
          <audio src={audioUrl} controls autoPlay style={{display:'none'}} />
          
        )}
        <SubmitButton onClick={handleClickContinue}>Continue</SubmitButton>
      </Box>
    </Container>
  );
};

export default MicCheck;
