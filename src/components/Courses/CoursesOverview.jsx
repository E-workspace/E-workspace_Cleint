import React, { useState, useEffect, useRef } from 'react';
import { Card, Row, Col, Button, Tabs, Spin, message } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Meta } = Card;
const { TabPane } = Tabs;

// Simulate fetching course data from an API
const fetchCourseData = async () => {
  // You can replace this with the actual API call
  const response = await fetch(`https://eworkspacems2-loszcsdz.b4a.run/api/GetcourseData/CourseData`); // Replace with actual API endpoint
  if (!response.ok) throw new Error('Failed to fetch data');
  return response.json();
};

const CourseCard = ({ title, imgSrc, instructor, rating, reviews, price, originalPrice }) => {
  return (
    <div style={{ marginBottom: 32 }}>
      <Card
        hoverable
        cover={<img alt={title} src={imgSrc} />}
        style={{ width: 300, marginBottom: 16 }}
      >
        <Meta title={title} description={instructor} />
        <p>Rating: {rating} ★ ({reviews} reviews)</p>
        <p>
          <span style={{ fontWeight: 'bold', fontSize: 16 }}>₹{price}</span>
          <span style={{ textDecoration: 'line-through', color: 'gray', marginLeft: 8 }}>
            ₹{originalPrice}
          </span>
        </p>
        <Button type="primary">Enroll Now</Button>
      </Card>
    </div>
  );
};

const CoursesOverview = () => {
  const [categories, setCategories] = useState({});
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const subcategoryContainerRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchCourseData();
        setCategories(data.categories);
        setSelectedCategory(Object.keys(data.categories)[0]); // Default to first category
        setLoading(false);
      } catch (error) {
        setLoading(false);
        message.error('Failed to fetch course data');
      }
    };
    loadData();
  }, []);

  const handleCategoryChange = (key) => {
    setSelectedCategory(key);
    setSelectedSubcategory(null); // Reset selected subcategory when changing category
    if (subcategoryContainerRef.current) {
      subcategoryContainerRef.current.scrollLeft = 0; // Reset scroll position
    }
  };

  const handleSubcategoryClick = (subcategory) => {
    setSelectedSubcategory(subcategory);
    // Scroll to the corresponding row based on the subcategory
    const rowElement = document.getElementById(subcategory);
    if (rowElement) {
      rowElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const scrollSubcategories = (direction) => {
    if (subcategoryContainerRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      subcategoryContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const courses = selectedSubcategory
    ? categories[selectedCategory]?.courses[selectedSubcategory] || []
    : Object.values(categories[selectedCategory]?.courses || {}).flat();

  return (
    <div style={{ padding: '20px' }}>
      {loading ? (
        <Spin size="large" />
      ) : (
        <>
          <Tabs
            activeKey={selectedCategory}
            onChange={handleCategoryChange}
            centered
            tabBarGutter={24}
            size="large"
            tabBarStyle={{ fontSize: 18, fontWeight: 'bold' }}
          >
            {Object.keys(categories).map((category) => (
              <TabPane tab={category} key={category} />
            ))}
          </Tabs>

          <div style={{ display: 'flex', alignItems: 'center', marginTop: 10 }}>
            <Button icon={<LeftOutlined />} onClick={() => scrollSubcategories('left')} />
            <div
              ref={subcategoryContainerRef}
              style={{
                display: 'flex',
                overflowX: 'auto',
                padding: '10px 0',
                gap: '10px',
                flex: 1,
                scrollbarWidth: 'none', // Hide scrollbar for Firefox
              }}
            >
              {categories[selectedCategory]?.subcategories?.map((subcategory) => (
                <Button
                  key={subcategory}
                  type={selectedSubcategory === subcategory ? 'primary' : 'default'}
                  onClick={() => handleSubcategoryClick(subcategory)}
                  shape="round"
                  size="middle"
                >
                  {subcategory}
                </Button>
              ))}
            </div>
            <Button icon={<RightOutlined />} onClick={() => scrollSubcategories('right')} />
          </div>

          <div style={{ marginTop: 20 }}>
            {Object.keys(categories[selectedCategory]?.courses || {}).map((subcategoryKey) => {
              const coursesInSubcategory = categories[selectedCategory]?.courses[subcategoryKey] || [];
              if (coursesInSubcategory.length > 0) {
                return (
                  <div key={subcategoryKey} id={subcategoryKey} style={{ marginBottom: '40px' }}>
                  <h3 
                    style={{ 
                      fontSize: '24px', 
                      fontWeight: 'bold', 
                      color: '#333', 
                      marginBottom: '8px' // Adds some space between the title and the underline
                    }}
                  >
                    {subcategoryKey} Courses
                  </h3>
                  <span 
                    style={{ 
                      display: 'block', // Makes the span behave like a block element
                      height: '2px', // Set the thickness of the underline
                      width: '10%', // Make the underline span the full width of the container
                      backgroundColor: 'black' // Set the color of the underline
                    }} 
                  ></span>
                  <br></br>
                  <Row gutter={[16, 16]} justify="start" id="course-section">
                    {coursesInSubcategory.map((course, index) => {
                      console.log(course,"map course")
                      const { title, imgSrc, instructor, rating, reviews, price, originalPrice } = course;
                      return (
                        <Col key={index} xs={24} sm={12} md={8} lg={8}>
                        <CourseCard
                          title={title}
                          imgSrc={imgSrc}
                          instructor={instructor}
                          rating={rating}
                          reviews={reviews}
                          price={price}
                          originalPrice={originalPrice}
                        />
                        <Link to={`/course/${course.id}`}>
                          <button style={{ marginTop: '10px', padding: '10px 20px', fontSize: '16px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px' }}>
                            Enroll Now
                          </button>
                        </Link>
                      </Col>
                      );
                    })}
                  </Row>
                </div>
                
                
                );
              }
              return null;
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default CoursesOverview;
