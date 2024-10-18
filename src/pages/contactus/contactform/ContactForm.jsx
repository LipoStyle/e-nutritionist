import React, { useState } from 'react';
import './contactform.css';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL = 'https://e-nutritionist-08e05a1c6652.herokuapp.com/';
const API_Local_Host = "http://localhost:3000";

const ContactForm = () => {
  const navigate = useNavigate();
  const url = API_BASE_URL; // Update this conditionally based on the environment

  const [formData, setFormData] = useState({
    name: "",
    phone_number: "", // Ensure this matches the backend's expected parameter name
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch(`${url}/contact_messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ contact_message: formData }),
      });
  
      if (response.ok) {
        const result = await response.json();
        alert(result.message || 'Message sent successfully!');
        setFormData({
          name: "",
          phone_number: "",
          email: "",
          message: ""
        });
        navigate("/thankyoumessage");
      } else {
        // Capture and display error details
        const errorData = await response.json();
        console.error('Error details:', errorData);
        if (errorData.errors) {
          alert('Errors: ' + errorData.errors.join(', '));
        } else if (errorData.error) {
          alert('Error: ' + errorData.error);
        } else {
          alert('Unexpected error occurred. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error sending your message. Please try again later.');
    }

    console.log(formData)
  };
  
  

  return (
    <div className="contact-form-container-outer">
      <div className="contact-form-container">
        <h2>Share anything with us</h2>
        <form className="contact-form" onSubmit={handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Phone:
            <input
              type="tel"
              name="phone_number" // Matching the backend expectation
              value={formData.phone_number}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Message:
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
