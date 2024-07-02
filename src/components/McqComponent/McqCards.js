import React, { useState } from 'react';
import { CCard, CCardBody, CCardHeader, CCardTitle, CCardText, CButton, CRow, CCol } from '@coreui/react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

const McqCards = () => {
  // Define the tech stacks and their respective cards
  const techStacks = [
    {
      stack: "Front-End Development",
      cards: [
        { topic: 'React.js', content: 'Concept: This MCQ Question Is Based On Your Experience' },
        { topic: 'React.js', content: 'Concept: This MCQ Question Is Based On Your Experience' },
        { topic: 'React.js', content: 'Concept: This MCQ Question Is Based On Your Experience' },
      ],
    },
    {
      stack: "Back-End Development",
      cards: [
        { topic: 'Express.js', content: 'Concept: This MCQ Question Is Based On Your Experience' },
        { topic: 'Express.js', content: 'Concept: This MCQ Question Is Based On Your Experience' },
        { topic: 'Express.js', content: 'Concept: This MCQ Question Is Based On Your Experience' },
      ],
    },
    {
      stack: "Databases",
      cards: [
        { topic: 'MongoDB', content: 'Concept: This MCQ Question Is Based On Your Experience' },
        { topic: 'MongoDB', content: 'Concept: This MCQ Question Is Based On Your Experience' },
        { topic: 'MongoDB', content: 'Concept: This MCQ Question Is Based On Your Experience' },
      ],
    },
    {
      stack: "Programming Languages",
      cards: [
        { topic: 'JavaScript', content: 'Concept: This MCQ Question Is Based On Your Experience' },
        { topic: 'Python', content: 'Concept: This MCQ Question Is Based On Your Experience' },
        { topic: 'Java', content: 'Concept: This MCQ Question Is Based On Your Experience' },
      ],
    },
  ];

  // Define the inline styles for iOS glassmorphism effect
  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.15)', // Semi-transparent white background
    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', // Light shadow
    backdropFilter: 'blur(18px)', // iOS-like blur effect
    WebkitBackdropFilter: 'blur(18px)', // iOS-like blur effect for Safari
    border: '1px solid rgba(255, 255, 255, 0.18)', // Light border
    borderRadius: '10px', // Rounded corners
    color: 'rgba(0, 0, 0, 0.7)', // Light black text
    padding: '10px', // Padding inside the card
    marginBottom: '1rem', // Margin at the bottom
  };

  const cardHeaderStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.3)', // Semi-transparent background
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)', // Light border at the bottom
    color: 'rgba(0, 0, 0, 0.7)', // Light black text
  };

  const backgroundStyle = {
    overflow: 'hidden',
    position: 'fixed',
    width: '100vw',
    height: '100vh',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: -1,
  };

  const bgStyle = {
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(100px)',
  };

  const bg1Style = {
    ...bgStyle,
    height: '300px',
    width: '800px',
    top: '0px',
    left: '-200px',
    background: '#AEB8FE',
    filter: 'blur(80px)',
    borderRadius: '30%',
  };

  const bg2Style = {
    ...bgStyle,
    height: '300px',
    width: '800px',
    top: '0px',
    right: '-200px',
    background: '#AEB8FE',
    filter: 'blur(80px)',
    borderRadius: '30%',
  };

  const bg3Style = {
    ...bgStyle,
    height: '400px',
    width: '1000px',
    top: '0px',
    right: '-600px',
    background: '#FFBD00',
  };

  const bg4Style = {
    ...bgStyle,
    height: '350px',
    width: '1200px',
    bottom: '0px',
    right: '-300px',
    background: '#FF0054',
    filter: 'blur(200px)',
  };

  const bg5Style = {
    ...bgStyle,
    height: '700px',
    width: '600px',
    bottom: '-300px',
    left: '-100px',
    background: '#758BFD',
    filter: 'blur(170px)',
    borderRadius: '30%',
  };

  const contentStyle = {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem 0',
  };

  const headingStyle = {
    marginBottom: '2rem',
    fontSize: '2rem',
    color: '#fff',
  };

  // Modal state and handlers
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ header: '', content: '', difficulty: '' });
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleOpenModal = (header, content) => {
    setModalContent({ header, content, difficulty: '' });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleDifficultyChange = (event) => {
    setModalContent((prevContent) => ({ ...prevContent, difficulty: event.target.value }));
  };

  const handleSubmit = () => {
    setSelectedOptions((prevOptions) => [...prevOptions, modalContent]);
    handleCloseModal();
  };

  return (
    <>
      <div style={backgroundStyle}>
        <div style={bg1Style}></div>
        <div style={bg2Style}></div>
        <div style={bg3Style}></div>
        <div style={bg4Style}></div>
        <div style={bg5Style}></div>
      </div>

      <div style={contentStyle}>
        {techStacks.map((tech, techIndex) => (
          <div key={techIndex} style={{ width: '100%', textAlign: 'center' }}>
            <div style={headingStyle}>{tech.stack}</div>
            <CRow>
              {tech.cards.map((item, index) => (
                <CCol md="4" className="mb-3" key={index}>
                  <CCard style={cardStyle}>
                    <CCardHeader style={cardHeaderStyle}>{item.topic}</CCardHeader>
                    <CCardBody>
                      <CCardTitle>{item.topic} Card</CCardTitle>
                      <CCardText>{item.content}</CCardText>
                      <CButton color="light" onClick={() => handleOpenModal(item.topic, item.content)}>View</CButton>
                    </CCardBody>
                  </CCard>
                </CCol>
              ))}
            </CRow>
          </div>
        ))}
      </div>

      {/* Modal Component */}
      <Dialog
        open={modalOpen}
        onClose={handleCloseModal}
        PaperComponent={PaperComponent}
        aria-labelledby="draggable-dialog-title"
      >
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          {modalContent.header}
        </DialogTitle>
        <DialogContent>
          <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '30ch' }, width: '100%' }} noValidate autoComplete="off">
            <FormControl fullWidth>
              <InputLabel id="difficulty-select-label">Difficulty</InputLabel>
              <Select
                labelId="difficulty-select-label"
                id="difficulty-select"
                value={modalContent.difficulty}
                onChange={handleDifficultyChange}
                label="Difficulty"
              >
                <MenuItem value="easy">Easy</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="hard">Hard</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default McqCards;
        