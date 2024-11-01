import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { FaTrashAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/AuthContext'; // Adjust the import path as necessary

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
  height: 85%;
  padding: 20px;
`;

const Form = styled.div`
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

const Label = styled.p`
  font-size: 16px;
  margin-bottom: 5px;
  font-weight: bold;
`;

const FormRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
`;

const Input = styled.input`
  width: 48%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Select = styled.select`
  width: 48%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #ff0000;
`;

const AddMoreSkillsButton = styled.button`
  color: #6666ff;
  border: none;
  background: none;
  cursor: pointer;
  margin-bottom: 20px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #6666ff;
  color: #ffffff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #5555ff;
  }
`;

const Note = styled.p`
  font-size: 12px;
  color: #999999;
  margin-top: 20px;
  text-align: center;
`;

const Footer = styled.div`
  text-align: center;
  margin-top: 20px;
`;

function Ai() {
  const [skills, setSkills] = useState([
    { id: 1, skill: '', level: '' },
    { id: 2, skill: '', level: '' },
    { id: 3, skill: '', level: '' }
  ]);

  const { user } = useAuth();
  const navigate = useNavigate();

  const allTechnologies = [
    'HTML', 'CSS', 'JavaScript', 'React.js', 'Express.js', 'Angular.js', 
    'MongoDB', 'SQL', 'Node.js', 'API', 'GraphQL'
  ];

  const getAvailableTechnologies = (currentSkillId) => {
    const selectedTechnologies = skills
      .filter(skill => skill.id !== currentSkillId)
      .map(skill => skill.skill);
    return allTechnologies.filter(tech => !selectedTechnologies.includes(tech));
  };

  const handleAddSkill = () => {
    if (skills.length < 5) {
      setSkills([...skills, { id: skills.length + 1, skill: '', level: '' }]);
    }
  };

  const handleRemoveSkill = (id) => {
    setSkills(skills.filter((skill) => skill.id !== id));
  };

  const handleChange = (id, field, value) => {
    const updatedSkills = skills.map((skill) =>
      skill.id === id ? { ...skill, [field]: value } : skill
    );
    setSkills(updatedSkills);
  };

  const handleSubmit = async () => {
    const data = {
      user: {
        email: user.email,
        username: user.username,
        role: user.role
      },
      skills
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL_MS2}/skills`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        const { value: bookingID } = await Swal.fire({
          title: 'Enter Booking ID',
          input: 'text',
          inputLabel: 'Booking ID',
          inputPlaceholder: 'Enter your Booking ID',
          inputAttributes: {
            maxlength: '10',
            autocapitalize: 'off',
            autocorrect: 'off'
          }
        });

        if (bookingID) {
          const checkResponse = await fetch(`${process.env.REACT_APP_API_URL_MS2}/checkBooking/${bookingID}`, {
            method: 'GET'
          });
          if (checkResponse.ok) {
            const result = await checkResponse.json();
            if (result.match) {
              toast.success('Booking ID matched! Proceeding...');
              navigate('/mic-check');
            } else {
              toast.error('Invalid Booking ID. Please try again.');
            }
          } else {
            toast.error('Invalid Booking ID. Please try again.');
          }
        }
      } else {
        console.error('Error submitting data');
      }
    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  return (
    <Container>
      <GlobalStyle />
      <Form>
        <Title>Add your top skills</Title>
        <Label>Enter main skills</Label>
        {skills.map((skill) => (
          <FormRow key={skill.id}>
            <Select
              value={skill.skill}
              onChange={(e) => handleChange(skill.id, 'skill', e.target.value)}
            >
              <option value="" disabled>Select a technology</option>
              {getAvailableTechnologies(skill.id).map((tech, idx) => (
                <option key={idx} value={tech}>{tech}</option>
              ))}
            </Select>
            <Select
              value={skill.level}
              onChange={(e) => handleChange(skill.id, 'level', e.target.value)}
            >
              <option value="" disabled>Select</option>
              <option value="fresher">Fresher</option>
              <option value="junior">Junior</option>
              <option value="experience">Experience</option>
            </Select>
            {skills.length > 3 && (
              <IconButton onClick={() => handleRemoveSkill(skill.id)}>
                <FaTrashAlt />
              </IconButton>
            )}
          </FormRow>
        ))}
        {skills.length < 5 && (
          <AddMoreSkillsButton onClick={handleAddSkill}>
            + Add up to {5 - skills.length} more skills (optional)
          </AddMoreSkillsButton>
        )}
        <Button onClick={handleSubmit}>Continue</Button>
        <Footer>Powered by E-learn</Footer>
      </Form>
      <ToastContainer />
    </Container>
  );
}

export default Ai;
