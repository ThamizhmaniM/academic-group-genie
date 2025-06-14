
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import Dashboard from '@/components/Dashboard';
import Students from '@/components/Students';
import Groups from '@/components/Groups';
import Timetable from '@/components/Timetable';
import TestSchedule from '@/components/TestSchedule';
import Attendance from '@/components/Attendance';

const Index = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/groups" element={<Groups />} />
        <Route path="/timetable" element={<Timetable />} />
        <Route path="/tests" element={<TestSchedule />} />
        <Route path="/attendance" element={<Attendance />} />
      </Routes>
    </Layout>
  );
};

export default Index;
