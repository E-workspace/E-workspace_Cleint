// CourseCardDetails.jsx
import React from 'react';
import McqCards from './McqCards';

const courses = [
  {
    title: 'Course 1',
    description: 'This is the description for course 1.',
    image: 'https://via.placeholder.com/300x200',
  },
  {
    title: 'Course 2',
    description: 'This is the description for course 2.',
    image: 'https://via.placeholder.com/300x200',
  },
  // Add more course objects here...
];

const CourseCardDetails = () => {
  return (
    <div className="flex flex-wrap justify-center">
      {courses.map((course, index) => (
        <McqCards key={index} course={course} />
      ))}
    </div>
  );
};

export default CourseCardDetails;
