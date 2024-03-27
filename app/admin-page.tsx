"use client"; // This is a client component 

import React, { useState, useEffect } from 'react';
import './css/styles.css';

const serverURL = 'https://ticket-server-sc6x.onrender.com';
//const serverURL = 'http://127.0.0.1:3001';

interface Ticket {
  id: number;
  username: string;
  email: string;
  description: string;
  response: string;
  createdat: string;
  updatedat: string;
  status: string;
}
// Function to format date string
const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

const AdminPage: React.FC = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch tickets from the database and update state
    const fetchTickets = async () => {
      try {
        const response = await fetch(serverURL+'/api/tickets');
        if (response.ok) {
            const data = await response.json();
            setTickets(data);
        } else {
          console.error('Failed to fetch tickets:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setError('Failed to submit ticket. Please try again later.');
      }
    };

    fetchTickets();
  }, []);

  // Function to handle response change and update state
  const handleResponseChange = (id: number, newResponse: string) => {
    setTickets(prevTickets =>
      prevTickets.map(ticket =>
        ticket.id === id ? { ...ticket, response: newResponse } : ticket
      )
    );
  };

  // Function to update the response and status
  const handleUpdate = async (id: number, newResponse: string) => {
    try {
        // Make API call to update ticket with new response and status
        await fetch(serverURL+'/api/update-ticket', {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: id, response: newResponse, status: 'in-progress' }),
        });
    
        // Update tickets in state
        setTickets(prevTickets =>
          prevTickets.map(ticket =>
            ticket.id === id ? { ...ticket, response: newResponse, status: 'in-progress' } : ticket
          )
        );
      } catch (error) {
        console.error('Error updating ticket:', error);
        setError('Failed to submit ticket. Please try again later.');
      }
  };

  // Function to handle resolve button click and update status
  const handleResolve = async (id: number, newResponse: string) => {
    try {
        // Make API call to update ticket status to resolved
        await fetch(serverURL+'/api/update-ticket', {
          method: 'PUT',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: id, response: newResponse, status:  'resolved' }),
        });
    
        // Update tickets in state
        setTickets(prevTickets =>
          prevTickets.map(ticket =>
            ticket.id === id ? { ...ticket, status: 'resolved' } : ticket
          )
        );
      } catch (error) {
        console.error('Error resolving ticket:', error);
        setError('Failed to submit ticket. Please try again later.');
      }
  };
  return (
    <div style={{ width: '80%', margin: '0 auto' }}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table className="table">
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Description</th>
            <th>Response</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map(ticket => (
            <tr key={ticket.id}>
              <td>{ticket.username}</td>
              <td>{ticket.email}</td>
              <td>{ticket.description}</td>
              <td>
                <textarea
                  value={ticket.response}
                  onChange={e => handleResponseChange(ticket.id, e.target.value)}
                  onBlur={() => handleUpdate(ticket.id, ticket.response)}
                  disabled={ticket.status === 'resolved'}
                />
              </td>
              <td>{formatDate(ticket.createdat)}</td>
              <td>{formatDate(ticket.updatedat)}</td>
              <td>{ticket.status}</td>
              <td>
                {ticket.status !== 'resolved' && (

                  <button 
                  onClick={() => handleResolve(ticket.id, ticket.response)}
                  style={{
                    border: '1px solid green',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    backgroundColor: 'transparent',
                    color: 'green',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s, color 0.3s',
                  }}>
                    
                    Resolve
                    
                    </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default AdminPage;
