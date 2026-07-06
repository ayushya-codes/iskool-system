import { useEffect, useState } from 'react';
import api from '../api/client';
import ModulePage from '../components/ModulePage';

export default function Faculty() {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/faculty')
      .then((res) => setFaculty(res.data))
      .catch(() => setFaculty([]))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: 'fullName', label: 'Name' },
    { key: 'employeeCode', label: 'Employee Code' },
    { key: 'email', label: 'Email' },
    { key: 'designation', label: 'Designation' },
  ];

  return (
    <ModulePage
      title="Faculty"
      subtitle="Manage faculty members and assignments"
      columns={columns}
      data={faculty}
      loading={loading}
      addLabel="Add Faculty"
    />
  );
}
