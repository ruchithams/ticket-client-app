"use client"; // This is a client component 
import React, { useState } from 'react';
import SubmitTicketForm from './ticket';
import AdminPage from './admin-page'; // Import the AdminPage component

const Home: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'submit' | 'admin'>('submit');

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '10vh' }}>
          <div style={{ fontSize: '100px', fontWeight: 'bold' }}>Ticket System</div>
        </div>
      </div>

      <div className="flex justify-center space-x-8">
        {/* Tab for submitting a ticket */}
        <button
          className={`px-4 py-2 rounded-md ${selectedTab === 'submit' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
          onClick={() => setSelectedTab('submit')}
        >
          Submit Ticket
        </button>

        {/* Tab for accessing admin page */}
        <button
          className={`px-4 py-2 rounded-md ${selectedTab === 'admin' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-700'}`}
          onClick={() => setSelectedTab('admin')}
        >
          Admin
        </button>
      </div>

      {/* Render the appropriate content based on the selected tab */}
      {selectedTab === 'submit' && <SubmitTicketForm />}
      {selectedTab === 'admin' && <AdminPage />}
    </main>
  );
};

export default Home;

