import React, { useState } from "react";
import { Modal, Box, Typography, Button, IconButton } from "@mui/material"; // Import Material-UI components
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'; // Import Syntax Highlighter
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'; // Import dark theme for syntax highlighting
import CloseIcon from '@mui/icons-material/Close'; // Import close icon
import "./Apicards.css"; // Assuming you have this CSS file

const services = [
  {
    icon: "fa-shopping-cart",
    title: "E-commerce API",
    description: "Manage products, orders, and customer data seamlessly.",
    usage: "Use this API to create and manage an online store. This allows you to handle inventory, track orders, and manage customer information.",
    apiUrl: "https://api.example.com/e-commerce",
    exampleCode: `// Example of creating a product
const createProduct = async (product) => {
    const response = await fetch('https://api.example.com/e-commerce/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
    });
    return response.json();
};`,
    // Nested data response structure
    dataResponse: `{
  "success": true,
  "data": {
    "product": {
      "id": "12345",
      "name": "Product Name",
      "price": 19.99,
      "stock": 100,
      "category": {
        "id": "cat01",
        "name": "Electronics"
      },
      "supplier": {
        "id": "sup01",
        "name": "Supplier Name",
        "contact": {
          "email": "supplier@example.com",
          "phone": "123-456-7890"
        }
      }
    }
  }
}`,
    exampleResponse: `// Example response when creating a product
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "product": {
      "id": "12345",
      "name": "Product Name",
      "price": 19.99,
      "stock": 100,
      "category": {
        "id": "cat01",
        "name": "Electronics"
      },
      "supplier": {
        "id": "sup01",
        "name": "Supplier Name",
        "contact": {
          "email": "supplier@example.com",
          "phone": "123-456-7890"
        }
      }
    }
  }
}`
  },
  {
    icon: "fa-graduation-cap",
    title: "E-learning API",
    description: "Integration of courses, assessments, and student tracking.",
    usage: "Ideal for building e-learning platforms. This API enables you to create courses, manage student enrollments, and track progress.",
    apiUrl: "https://api.example.com/e-learning",
    exampleCode: `// Example of retrieving courses
const getCourses = async () => {
    const response = await fetch('https://api.example.com/e-learning/courses');
    return response.json();
};`,
    // Nested data response structure
    dataResponse: `{
  "success": true,
  "data": {
    "courses": [
      {
        "id": "1",
        "title": "Introduction to Programming",
        "duration": "4 weeks",
        "students_enrolled": 200,
        "instructor": {
          "id": "inst01",
          "name": "John Doe",
          "bio": "Experienced software developer and educator."
        }
      },
      {
        "id": "2",
        "title": "Advanced JavaScript",
        "duration": "6 weeks",
        "students_enrolled": 150,
        "instructor": {
          "id": "inst02",
          "name": "Jane Smith",
          "bio": "Expert in JavaScript and web technologies."
        }
      }
    ]
  }
}`,
    exampleResponse: `// Example response when retrieving courses
{
  "success": true,
  "message": "Courses retrieved successfully",
  "data": {
    "courses": [
      {
        "id": "1",
        "title": "Introduction to Programming",
        "duration": "4 weeks",
        "students_enrolled": 200,
        "instructor": {
          "id": "inst01",
          "name": "John Doe",
          "bio": "Experienced software developer and educator."
        }
      },
      {
        "id": "2",
        "title": "Advanced JavaScript",
        "duration": "6 weeks",
        "students_enrolled": 150,
        "instructor": {
          "id": "inst02",
          "name": "Jane Smith",
          "bio": "Expert in JavaScript and web technologies."
        }
      }
    ]
  }
}`
  },
  // Add other services similarly...
];


const AdvertisersService = () => {
  const [open, setOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const handleOpen = (service) => {
    setSelectedService(service);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedService(null);
  };

  return (
    <section id="advertisers" className="advertisers-service-sec pt-5 pb-5">
      <div className="container">
        {/* Section Header */}
        <div className="row">
          <div className="section-header text-center" style={{ marginBottom: '10%' }}>
            <h2 className="fw-bold fs-1">
              Our <span className="b-class-secondary">API</span> Services
            </h2>
            <p className="sec-icon">
              <i className="fa-solid fa-gear"></i>
            </p>
          </div>
        </div>
        
        {/* Service Cards */}
        <div className="row mt-5 mt-md-4 row-cols-1 row-cols-sm-1 row-cols-md-3 justify-content-center">
          {services.map((service, index) => (
            <div className="col" key={index}>
              <div className="service-card">
                {/* Card Icon */}
                <div className="icon-wrapper">
                  <i className={`fa-solid ${service.icon}`}></i>
                </div>
                {/* Card Title */}
                <h3>{service.title}</h3>
                {/* Card Description */}
                <p>{service.description}</p>
                {/* Button */}
                <div className="btn-container">
                  <button
                    className="btn btn-primary"
                    style={{ fontWeight: '600' }}
                    onClick={() => handleOpen(service)} // Open modal with selected service
                  >
                    View API
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for displaying API usage */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 700, // Adjust width as needed
          maxHeight: '80%', // Limit height for scrolling
          bgcolor: 'background.paper',
          borderRadius: '8px', // Make the modal rounded
          boxShadow: 24,
          p: 4,
          overflowY: 'auto', // Enable vertical scrolling
        }}>
          <IconButton
            onClick={handleClose}
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              color: 'gray'
            }}
          >
            <CloseIcon />
          </IconButton>
          <Typography variant="h6" component="h2">
          {selectedService?.title} Usage
        </Typography>
        <div style={{ width: '100%', height: '2px', backgroundColor: 'black', marginTop: '10px', textAlign:'center' }} />
        
          <Typography sx={{ mt: 4 }}>
            <strong>Description:</strong> {selectedService?.description}
          </Typography>
          <Typography sx={{ mt: 2 }}>
            <strong>Usage:</strong> {selectedService?.usage}
          </Typography>
          <Typography sx={{ mt: 2 }}>
            <strong>API URL:</strong> <a href={selectedService?.apiUrl} target="_blank" rel="noopener noreferrer">{selectedService?.apiUrl}</a>
          </Typography>
          <Typography sx={{ mt: 2 }}>
            <strong>Example Code:</strong>
          </Typography>
          <SyntaxHighlighter language="javascript" style={atomDark}>
            {selectedService?.exampleCode}
          </SyntaxHighlighter>
          <Typography sx={{ mt: 2 }}>
            <strong>Example Response:</strong>
          </Typography>
          <SyntaxHighlighter language="json" style={atomDark}>
            {selectedService?.exampleResponse}
          </SyntaxHighlighter>
          <Button onClick={handleClose} color="primary" variant="outlined" sx={{ mt: 2 }}>
            Close
          </Button>
        </Box>
      </Modal>
    </section>
  );
};

export default AdvertisersService;
