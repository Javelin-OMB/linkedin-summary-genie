import React from 'react';
import Navigation from '@/components/Navigation';

const Settings = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation onLoginClick={() => console.log('Login clicked')} />
      <div className="max-w-6xl mx-auto p-4 pt-20">
        <h1 className="text-2xl font-bold text-linkedin-primary">Settings</h1>
        <p className="mt-4 text-gray-600">Settings page content coming soon...</p>
      </div>
    </div>
  );
};

export default Settings;