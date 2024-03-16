// Admin.tsx
import React, { useState } from 'react';
import Table from '../components/Table';
import Transition from '../components/Transition';
import ThreejsPlane from '../components/ImagePlane';
import Button from '../components/Button';
import axios from 'axios';

interface ColumnType {
  accessorKey: string;
  header: string;
}

const Admin: React.FC = () => {
  const [sqlQuery, setSqlQuery] = useState('');
  const [tableData, setTableData] = useState([]);
  const [columns, setColumns] = useState<ColumnType[]>([]);

  const token = localStorage.getItem('token');

  const handleQuerySubmit = async () => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const response = await axios.post('http://localhost:3000/admin',
        { query: sqlQuery },
        { headers }
      );

      if (response.status >= 200 && response.status < 300) {
        const responseData = response.data;
        console.log('Response data:', responseData.data[0]);
        setTableData(responseData.data);
        const cols = Object.keys(responseData.data[0]).map((col) => ({
          accessorKey: col,
          header: col,
        }));
        setColumns(cols);
        console.log('Table data:', tableData);
        console.log('Columns:', columns);
      } else {
        console.error('Error fetching data. Status:', response.status);
      }
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error('Axios Error:', error.message);
      } else {
        console.error('Non-Axios Error:', error.message);
      }
    }

  };

  return (
    <>
      <Transition />
      <div className='min-h-screen w-full flex flex-col items-center'>
        <ThreejsPlane />
        <div className='w-full flex flex-col justify-center items-center text-left relative bg-transparent profile-header min-h-[50px] mt-80'>
          <label htmlFor="sql" className="block self-start ml-72 mb-2 text-sm font-medium text-gray-900 dark:text-white">SQL Query:</label>
          <input
            type="text"
            value={sqlQuery}
            onChange={e => setSqlQuery(e.target.value)}
            id="sql"
            className="input-container border border-solid border-white text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-3/5 p-2.5"
            placeholder="Select * from Users"
            required
          />
          <div className='self-start ml-72'>
            <Button height='h-[40px]' text='Submit Query' onClick={handleQuerySubmit} />
          </div>

          {
            tableData.length > 0 && columns.length > 0 &&
            <div className='w-4/5 mt-20 mb-20'>
              <Table data={tableData} columns={columns} />
            </div>
          }
        </div>
      </div>
    </>
  );
};

export default Admin;
