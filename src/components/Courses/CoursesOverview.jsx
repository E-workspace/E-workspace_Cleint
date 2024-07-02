import React from 'react';
import { CCard, CCardBody, CCardTitle, CCardText, CCardImage, CRow, CCol, CButton } from '@coreui/react';

const ImgSrc = "https://miro.medium.com/v2/resize:fit:720/format:webp/1*a3BHGbuAMpOaZj6HkTrNqA.png";

const imagesrc =  ["https://www.uttarainfo.com/blog/wp-content/uploads/2023/06/screenshot-2021-02-11-at-115416.png",

  'https://www.logicraysacademy.com/blog/wp-content/uploads/2020/04/python-programming.png',
  "https://assets.toptal.io/images?url=https%3A%2F%2Fbs-uploads.toptal.io%2Fblackfish-uploads%2Fcomponents%2Fblog_post_page%2F4087150%2Fcover_image%2Fretina_500x200%2Fcover-0828_AfterAllTheseYearstheWorldisStillPoweredbyCProgramming_Razvan_Newsletter-f6055ebd7fd2dcf631141dc5acc0f8b5.png",
  "https://flatirons.com/static/ec437dccb021a7d53634be2408cf26ae/92cb1/What-is-Flask_-Overview-of-the-Flask-Python-Framework-in-2024.webp",
  "https://kinsta.com/wp-content/uploads/2023/10/PHP_Feature-Image-1024x536.jpg",
  "https://www.uttarainfo.com/blog/wp-content/uploads/2023/06/screenshot-2021-02-11-at-115416.png",

  'https://www.logicraysacademy.com/blog/wp-content/uploads/2020/04/python-programming.png',
  "https://assets.toptal.io/images?url=https%3A%2F%2Fbs-uploads.toptal.io%2Fblackfish-uploads%2Fcomponents%2Fblog_post_page%2F4087150%2Fcover_image%2Fretina_500x200%2Fcover-0828_AfterAllTheseYearstheWorldisStillPoweredbyCProgramming_Razvan_Newsletter-f6055ebd7fd2dcf631141dc5acc0f8b5.png",
  "https://flatirons.com/static/ec437dccb021a7d53634be2408cf26ae/92cb1/What-is-Flask_-Overview-of-the-Flask-Python-Framework-in-2024.webp",
  "https://kinsta.com/wp-content/uploads/2023/10/PHP_Feature-Image-1024x536.jpg",
  "https://www.uttarainfo.com/blog/wp-content/uploads/2023/06/screenshot-2021-02-11-at-115416.png",

  'https://www.logicraysacademy.com/blog/wp-content/uploads/2020/04/python-programming.png',
  "https://assets.toptal.io/images?url=https%3A%2F%2Fbs-uploads.toptal.io%2Fblackfish-uploads%2Fcomponents%2Fblog_post_page%2F4087150%2Fcover_image%2Fretina_500x200%2Fcover-0828_AfterAllTheseYearstheWorldisStillPoweredbyCProgramming_Razvan_Newsletter-f6055ebd7fd2dcf631141dc5acc0f8b5.png",
  "https://flatirons.com/static/ec437dccb021a7d53634be2408cf26ae/92cb1/What-is-Flask_-Overview-of-the-Flask-Python-Framework-in-2024.webp",
  "https://kinsta.com/wp-content/uploads/2023/10/PHP_Feature-Image-1024x536.jpg",
  "https://www.uttarainfo.com/blog/wp-content/uploads/2023/06/screenshot-2021-02-11-at-115416.png",

  'https://www.logicraysacademy.com/blog/wp-content/uploads/2020/04/python-programming.png',
  "https://assets.toptal.io/images?url=https%3A%2F%2Fbs-uploads.toptal.io%2Fblackfish-uploads%2Fcomponents%2Fblog_post_page%2F4087150%2Fcover_image%2Fretina_500x200%2Fcover-0828_AfterAllTheseYearstheWorldisStillPoweredbyCProgramming_Razvan_Newsletter-f6055ebd7fd2dcf631141dc5acc0f8b5.png",
  "https://flatirons.com/static/ec437dccb021a7d53634be2408cf26ae/92cb1/What-is-Flask_-Overview-of-the-Flask-Python-Framework-in-2024.webp",
  "https://kinsta.com/wp-content/uploads/2023/10/PHP_Feature-Image-1024x536.jpg",
  "https://www.uttarainfo.com/blog/wp-content/uploads/2023/06/screenshot-2021-02-11-at-115416.png",

  'https://www.logicraysacademy.com/blog/wp-content/uploads/2020/04/python-programming.png',
  "https://assets.toptal.io/images?url=https%3A%2F%2Fbs-uploads.toptal.io%2Fblackfish-uploads%2Fcomponents%2Fblog_post_page%2F4087150%2Fcover_image%2Fretina_500x200%2Fcover-0828_AfterAllTheseYearstheWorldisStillPoweredbyCProgramming_Razvan_Newsletter-f6055ebd7fd2dcf631141dc5acc0f8b5.png",
  "https://flatirons.com/static/ec437dccb021a7d53634be2408cf26ae/92cb1/What-is-Flask_-Overview-of-the-Flask-Python-Framework-in-2024.webp",
  "https://kinsta.com/wp-content/uploads/2023/10/PHP_Feature-Image-1024x536.jpg"
]

const courses = Array.from({ length: 25 }, (_, index) => ({
  title: `Course Title ${index + 1}`,
  description: 'This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.',
  lastUpdated: `Last updated ${index + 1} mins ago`
}));

const CoursesOverview = () => {
  return (
    <>
      <h1>JavaScript</h1>
      <CRow>
        {courses.map((course, index) => (
          <CCol key={index} md={6} className="mb-4">
            <CCard>
              <CRow className="g-0">
                <CCol md={4}>
                  <CCardImage src={imagesrc[index]} style={{ height: '100%' }} />
                </CCol>
                <CCol md={8}>
                  <CCardBody>
                    <CCardTitle>{course.title}</CCardTitle>
                    <CCardText>
                      {course.description}
                    </CCardText>
                    <CCardText>
                      <small className="text-body-secondary">{course.lastUpdated}</small>
                    </CCardText>
                    <CButton color="primary" href="#">Go somewhere</CButton>
                  </CCardBody>
                </CCol>
              </CRow>
            </CCard>
          </CCol>
        ))}
      </CRow>
    </>
  );
};

export default CoursesOverview;
