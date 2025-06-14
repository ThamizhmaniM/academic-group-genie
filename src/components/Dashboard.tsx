
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, Calendar, CheckSquare, Loader2 } from 'lucide-react';
import { useStudents } from '@/hooks/useStudents';
import { useGroups } from '@/hooks/useGroups';

const Dashboard = () => {
  const { data: students = [], isLoading: studentsLoading } = useStudents();
  const { data: groups = [], isLoading: groupsLoading } = useGroups();

  if (studentsLoading || groupsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Students',
      value: students.length.toString(),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Subject Groups',
      value: groups.length.toString(),
      icon: BookOpen,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Weekly Classes',
      value: '60',
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Attendance Rate',
      value: '89.5%',
      icon: CheckSquare,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  const recentActivity = [
    {
      action: 'Student Management',
      student: `${students.length} students enrolled`,
      time: 'Active',
    },
    {
      action: 'Subject Groups',
      student: `${groups.length} groups created`,
      time: 'Auto-generated',
    },
    {
      action: 'Database Integration',
      student: 'All modules connected',
      time: 'Just now',
    },
    {
      action: 'System Ready',
      student: 'Ready for timetable generation',
      time: 'Now',
    },
  ];

  const upcomingTests = [
    {
      subject: 'Mathematics',
      group: 'Class 11 - PCM',
      date: 'Sat, Dec 16',
      time: '10:00 AM',
    },
    {
      subject: 'Physics',
      group: 'Class 12 - PCB',
      date: 'Sun, Dec 17',
      time: '2:00 PM',
    },
    {
      subject: 'Chemistry',
      group: 'Class 11 - PCB',
      date: 'Sat, Dec 23',
      time: '10:00 AM',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">Overview of your school management system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.student}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Tests */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTests.map((test, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{test.subject}</p>
                    <p className="text-sm text-gray-600">{test.group}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{test.date}</p>
                    <p className="text-sm text-gray-600">{test.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
