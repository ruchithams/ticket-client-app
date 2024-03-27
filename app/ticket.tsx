"use client"; // This is a client component 

import React, { useState } from 'react';
import axios from 'axios';
import { submitTicket } from './api/submit-ticket';

const SubmitTicketForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    description: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null); // Clear error message
    setSuccessMessage(null); // Clear success message

    // Check if any field is empty
    if (!formData.username || !formData.email || !formData.description) {
      setError('All fields are required');
      return;
    }

    // Check if email address is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Invalid email address');
      return;
    }

     // Create a new FormData object
    //  const formDataToSend = new FormData();
    //  formDataToSend.append('username', formData.username);
    //  formDataToSend.append('email', formData.email);
    //  formDataToSend.append('description', formData.description);

    try {
      // Make API request using the function exported from submit-ticket.ts
      //const response = await submitTicket(formDataToSend);
      // const response = await axios.post('http://127.0.0.1:3000/api/proxy', formData);
      const response = await fetch('http://127.0.0.1:3001/api/ticket', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          'username': formData.username,
          'email': formData.email,
          'description': formData.description
        }),
      })
      setSuccessMessage('Ticket submitted successfully!');
      setFormData({ username: '', email: '', description: '' });
    } catch (error) {
      console.error('Error submitting ticket:', error);
      setError('Failed to submit ticket. Please try again later.');
    }
  };

  return (
    <div className="mt-8 p-8 bg-white rounded-md shadow-lg">
      <h2 className="text-xl font-bold mb-4">Submit Ticket</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-700">Username:</label>
          <input type="text" name="username" id="username" value={formData.username} onChange={handleChange} required className="border-gray-300 border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring focus:border-blue-500 block w-full" />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700">Email:</label>
          <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className="border-gray-300 border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring focus:border-blue-500 block w-full" />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700">Description:</label>
          <textarea name="description" id="description" value={formData.description} onChange={handleChange} required className="border-gray-300 border rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring focus:border-blue-500 block w-full"></textarea>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Submit</button>
      </form>
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default SubmitTicketForm;