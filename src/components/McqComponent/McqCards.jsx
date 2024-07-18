import React, { useState } from 'react';
import './McqCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import SearchBar from './Search_bar';
import PageNotFound from "./404" // Make sure the import path is correct

const courses = [

  {
    title: 'HTML',
    description: 'A versatile, object-oriented programming language used for building web applications, mobile apps, and enterprise software.',
    image: 'https://www.freecodecamp.org/news/content/images/size/w2000/2023/03/HTML-Blog-Cover-1.png',
  },
  {
    title: 'CSS',
    description: 'A versatile, object-oriented programming language used for building web applications, mobile apps, and enterprise software.',
    image: 'https://img-c.udemycdn.com/course/480x270/278601_c731_5.jpg',
  },
  {
    title: 'TailWind CSS',
    description: 'A versatile, object-oriented programming language used for building web applications, mobile apps, and enterprise software.',
    image: 'https://miro.medium.com/v2/resize:fit:1200/0*vrbWwf92KcgylQsf.jpg',
  },
  {
    title: 'Java',
    description: 'A versatile, object-oriented programming language used for building web applications, mobile apps, and enterprise software.',
    image: 'https://img.freepik.com/free-vector/app-development-concept-with-programming-languages_23-2148688949.jpg?ga=GA1.1.1768007860.1714974725&semt=sph',
  },
  {
    title: 'JavaScript',
    description: 'A dynamic, high-level programming language commonly used for web development to create interactive effects within web browsers.',
    image: 'https://img.freepik.com/free-vector/programmers-using-javascript-programming-language-computer-tiny-people-javascript-language-javascript-engine-js-web-development-concept-bright-vibrant-violet-isolated-illustration_335657-986.jpg?ga=GA1.1.1768007860.1714974725&semt=sph',
  },
  {
    title: 'React.js',
    description: 'A JavaScript library for building user interfaces, especially single-page applications, using components.',
    image: 'https://img.freepik.com/free-vector/react-native-mobile-app-abstract-concept-illustration-cross-platform-native-mobile-app-development-framework-javascript-library-user-interface-operating-system_335657-3350.jpg?t=st=1721113453~exp=1721117053~hmac=7b48e815c0917ba7a5b9db4396b39dca29cf05824a906a09b0e272152a0854a4&w=740',
  },
  {
    title: 'Angular.js',
    description: 'A platform and framework for building single-page client applications using HTML and TypeScript.',
    image: 'https://miro.medium.com/v2/resize:fit:720/format:webp/1*4izN1GNG-r2tTfxZJg8uwQ.jpeg',
  },
  {
    title: 'Node.js',
    description: 'A JavaScript runtime built on Chrome\'s V8 JavaScript engine, enabling server-side scripting with JavaScript.',
    image: 'https://externlabs.com/blogs/wp-content/uploads/2021/12/1_ODU5V_oAmYmzvZ1wIw3rDw.jpg',
  },
  {
    title: 'MongoDB',
    description: 'A NoSQL database program that uses JSON-like documents with optional schemas for data storage.',
    image: 'https://www.digitalocean.com/cdn-cgi/image/quality=75,width=828/https://www.digitalocean.com/api/static-content/v1/images?src=https%3A%2F%2Fcommunity-cdn-digitalocean-com.global.ssl.fastly.net%2FMu3tf3evRUuYT2mbdPd93vmC&raw=1',
  },
  {
    title: 'SQL',
    description: 'A standard language for managing and manipulating relational databases, enabling data querying and updating.',
    image: 'https://media.licdn.com/dms/image/D4D12AQEcKqpMz-8gHQ/article-cover_image-shrink_600_2000/0/1701783458680?e=2147483647&v=beta&t=3V7DozyltbuE-QGunDY3Nq7epcDAYoH1CKF3UPrsjnA',
  },
  {
    title: 'PHP',
    description: 'A popular general-purpose scripting language that is especially suited to web development.',
    image: 'https://images.ctfassets.net/aq13lwl6616q/7DS3zhiTVGak4kjDNYSj6r/92bca96b51cd2de6777a250be8ce4c3d/PHP_2.jpg?w=500&fm=webp',
  },
  {
    title: 'Python',
    description: 'A high-level, interpreted programming language known for its readability, simplicity, and versatility.',
    image: 'https://t4.ftcdn.net/jpg/04/18/67/63/360_F_418676324_h6utFQWggqwkDi7GgSJWsmS8zZh7kCbI.jpg',
  },
  // Add more course objects here...
];

const McqCards = () => {
  const [filteredCourses, setFilteredCourses] = useState(courses); // State to hold filtered courses

  // Function to handle search input change
  const handleSearch = (searchTerm) => {
    const filtered = courses.filter(course =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  return (
    <>
      <SearchBar handleSearch={handleSearch} /><br/> {/* Pass handleSearch function to SearchBar */}
      <div  className="glassmorphic-background flex flex-wrap justify-center">
        {filteredCourses.length > 0 ? (
          filteredCourses.map((course, index) => (
            <div key={index} className="course_card">
              <div className="course_card_img">
                <img src={course.image} alt={course.title} />
              </div>
              <div className="course_card_content">
                <h3 className="course_title">{course.title}</h3><br/>
                <hr></hr><br/>
                <p className="course_description">{course.description}</p>
              </div>
              <div className="course_card_footer">
                <button className="btn btn-primary w-full">
                  <FontAwesomeIcon icon={faArrowRight} /> Start Test
                </button>
              </div>
            </div>
          ))
        ) : (
          <PageNotFound /> // Render PageNotFound component if no courses match
        )}
      </div>
    </>
  );
};

export default McqCards;
