'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';

export default function DriveManager() {
  const { data: session, status } = useSession();
  const [driveData, setDriveData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/drive');
      const data = await res.json();
      setDriveData(data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveData = async (data: any) => {
    setLoading(true);
    try {
      await fetch('/api/drive', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      await fetchData(); // Refresh data after save
    } catch (error) {
      console.error('Failed to save data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      fetchData();
    }
  }, [status]);

  if (status === 'loading') return <div>Loading...</div>;
  
  if (!session) {
    return (
      <div className="flex justify-center items-center h-screen">
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            // NextAuth.js will handle the credential
          }}
          onError={() => {
            console.log('Login Failed');
          }}
        />
      </div>
    );
  }

  return (
    <div className="p-4">
      {loading && <p className="text-blue-500">Loading data...</p>}
      
      {driveData && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="text-xl font-bold mb-2">Your Data:</h2>
          <pre className="bg-gray-100 p-2 rounded overflow-auto">
            {JSON.stringify(driveData, null, 2)}
          </pre>
        </div>
      )}
      
      <button 
        onClick={() => saveData({ timestamp: new Date().toISOString(), data: 'your-data-here' })}
        disabled={loading}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
      >
        {loading ? 'Saving...' : 'Save Sample Data'}
      </button>
    </div>
  );
}