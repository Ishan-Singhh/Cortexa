import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import Background from '../components/BackGround';

const StatusBadge = ({ status }) => {
  const statusStyles = {
    completed: 'bg-green-500/20 text-green-400',
    processing: 'bg-blue-500/20 text-blue-400',
    pending: 'bg-yellow-500/20 text-yellow-400',
    error: 'bg-red-500/20 text-red-400',
  };
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusStyles[status] || 'bg-gray-500/20 text-gray-400'}`}>
      {status}
    </span>
  );
};

export default function History() {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/history');
        setHistoryData(response.data);
      } catch (err) {
        setError('Failed to load scan history. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []); 

  const handleRowClick = (caseId) => {
    navigate(`/results/${caseId}`);
  };

  const renderContent = () => {
    if (loading) {
      return <p className="text-center text-gray-400">Loading history...</p>;
    }

    if (error) {
      return <p className="text-center text-red-500">{error}</p>;
    }

    if (historyData.length === 0) {
      return <p className="text-center text-gray-400">No scan history found.</p>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0">Case ID</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">Scan Date</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">Status</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-white">Finding</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {historyData.map((job) => (
              <tr 
                key={job.case_id} 
                onClick={() => handleRowClick(job.case_id)}
                className="hover:bg-gray-800/50 cursor-pointer transition-colors"
              >
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-0">
                  {job.case_id}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                  {new Date(job.created_at).toLocaleString()}
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                  <StatusBadge status={job.status} />
                </td>
                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                  {job.results?.finding || 'Processing...'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="relative isolate bg-gray-900 min-h-screen px-6 text-white">
      <Background />
      <div className="mx-auto max-w-5xl py-48 sm:py-40 lg:py-48">
        <div className="text-left mb-10">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Analysis History</h1>
          <p className="mt-4 text-lg leading-8 text-gray-400">
            A log of all previously submitted scans and their results.
          </p>
        </div>
        {renderContent()}
      </div>
    </div>
  );
}