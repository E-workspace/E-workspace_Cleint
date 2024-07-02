import React from 'react';
import { CCard, CCardBody, CCardHeader, CCardTitle, CCardText, CButton, CRow, CCol } from '@coreui/react';

const ApiCards = () => {
  const cardsData = [
    { color: 'primary' },
    { color: 'secondary' },
    { color: 'success' },
    { color: 'danger' },
    { color: 'warning' },
    { color: 'info' },
    { color: 'light' },
    { color: 'dark' },
  ];

  return (
    <div className="container">
      <CRow>
        {cardsData.map((item, index) => (
          <CCol md="6" className="mb-3" key={index}>
            <CCard color={item.color} className="text-white">
              <CCardHeader>Header</CCardHeader>
              <CCardBody>
                <CCardTitle>{item.color} card title</CCardTitle>
                <CCardText>
                  Some quick example text to build on the card title and make up the bulk of the card's content.
                </CCardText>
                <CButton color="light">View</CButton>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>
    </div>
  );
};

export default ApiCards;
