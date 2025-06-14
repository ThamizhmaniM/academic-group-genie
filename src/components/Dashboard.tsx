
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, Calendar, CheckSquare } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Students',
      value: '248',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Subject Groups',
      value: '12',
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
      action: 'New student enrolled',
      student: 'Rahul Sharma - Class 11',
      time: '2 hours ago',
    },
    {
      action: 'Timetable updated',
      student: 'Group A - PCM',
      time: '4 hours ago',
    },
    {
      action: 'Test scheduled',
      student: 'Mathematics - Class 12',
      time: '1 day ago',
    },
    {
      action: 'Attendance marked',
      student: 'Class 11 - All students',
      time: '1 day ago',
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
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
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
