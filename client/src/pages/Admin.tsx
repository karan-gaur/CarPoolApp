// Admin.tsx
import React, { useState } from 'react';
import Table from '../components/Table';

const Admin: React.FC = () => {
  const [sqlQuery, setSqlQuery] = useState('');
  const [tableData, setTableData] = useState([]);

  const handleQuerySubmit = async () => {
    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: sqlQuery }),
      });

      if (response.ok) {
        const responseData = await response.json();
        setTableData(responseData);
      } else {
        console.error('Error fetching data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <label>
        SQL Query:
        <input type="text" value={sqlQuery} onChange={(e) => setSqlQuery(e.target.value)} />
      </label>
      <button onClick={handleQuerySubmit}>Submit Query</button>

      <Table data={tableData} columns={} />
    </div>
  );
};

export default Admin;
