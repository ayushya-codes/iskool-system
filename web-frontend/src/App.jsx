import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ParentMyChild from './pages/ParentMyChild';
import Students from './pages/Students';
import StudentProfile from './pages/StudentProfile';
import Faculty from './pages/Faculty';
import Attendance from './pages/Attendance';
import Coursework from './pages/Coursework';
import TimetableBuilder from './pages/TimetableBuilder';
import Exams from './pages/Exams';
import Finance from './pages/Finance';
import Inventory from './pages/Inventory';
import Safety from './pages/Safety';
import Helpdesk from './pages/Helpdesk';
import Almanac from './pages/Almanac';
import Communication from './pages/Communication';
import Events from './pages/Events';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="my-child" element={<ProtectedRoute><ParentMyChild /></ProtectedRoute>} />
        <Route path="students" element={<ProtectedRoute><Students /></ProtectedRoute>} />
        <Route path="students/:id" element={<ProtectedRoute><StudentProfile /></ProtectedRoute>} />
        <Route path="faculty" element={<ProtectedRoute><Faculty /></ProtectedRoute>} />
        <Route path="attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
        <Route path="coursework" element={<ProtectedRoute><Coursework /></ProtectedRoute>} />
        <Route path="timetable-builder" element={<ProtectedRoute><TimetableBuilder /></ProtectedRoute>} />
        <Route path="exams" element={<ProtectedRoute><Exams /></ProtectedRoute>} />
        <Route path="finance" element={<ProtectedRoute><Finance /></ProtectedRoute>} />
        <Route path="inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
        <Route path="safety" element={<ProtectedRoute><Safety /></ProtectedRoute>} />
        <Route path="helpdesk" element={<ProtectedRoute><Helpdesk /></ProtectedRoute>} />
        <Route path="almanac" element={<ProtectedRoute><Almanac /></ProtectedRoute>} />
        <Route path="communication" element={<ProtectedRoute><Communication /></ProtectedRoute>} />
        <Route path="events" element={<ProtectedRoute><Events /></ProtectedRoute>} />
        <Route path="notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      </Route>
    </Routes>
  );
}

export default App;
