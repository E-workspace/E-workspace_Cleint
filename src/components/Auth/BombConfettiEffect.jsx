// src/components/BombConfettiEffect.js
import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import './Confetti.css';
import { FaTimes } from 'react-icons/fa';

const BombConfettiEffect = ({ modalDuration = 8000, confettiColors = ['#FF5733', '#33FF57', '#3357FF'] }) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    setShowConfetti(true); // Start showing confetti

    const closeConfettiTimer = setTimeout(() => {
      setShowConfetti(false); // Hide confetti after duration
    }, 8000);

    const closeModalTimer = setTimeout(() => {
      setShowModal(false); // Hide modal after specified duration
    }, modalDuration);

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(closeConfettiTimer);
      clearTimeout(closeModalTimer);
      window.removeEventListener('resize', handleResize);
    };
  }, [modalDuration]);

  const closeModal = () => {
    setShowModal(false); // Function to close the modal
  };

  return (
    <div style={styles.container}>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <FaTimes className="close-icon" onClick={closeModal} />
            <h1 className="blink-zoom-text">Congratulations!</h1>
          </div>
        </div>
      )}

      {showConfetti && (
        <Confetti
          width={dimensions.width}
          height={dimensions.height}
          numberOfPieces={1000} // Increased number of pieces for a bigger effect
          gravity={0.5} // Adjusted gravity for a more dramatic fall
          initialVelocityX={20} // Increased horizontal initial velocity for the blast effect
          initialVelocityY={20} // Increased vertical initial velocity for the blast effect
          colors={confettiColors}
        />
      )}
    </div>
  );
};

const styles = {
  container: {
    position: 'relative',
    height: '100vh',
    textAlign: 'center',
    paddingTop: '20vh',
    backgroundColor: '#f0f8ff',
    zIndex: 10,
  },
};

export default BombConfettiEffect;
