
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar as CalendarIcon, Users, CheckSquare, X } from 'lucide-react';

const Attendance = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedClass, setSelectedClass] = useState('11');
  
  const students = [
    { id: 1, name: 'Rahul Sharma', class: '11', group: 'PCM', status: 'present' },
    { id: 2, name: 'Priya Patel', class: '11', group: 'PCB', status: 'present' },
    { id: 3, name: 'Amit Kumar', class: '12', group: 'CS', status: 'absent' },
    { id: 4, name: 'Sneha Gupta', class: '12', group: 'PCB', status: 'present' },
    { id: 5, name: 'Arjun Singh', class: '11', group: 'PCM', status: 'present' },
    { id: 6, name: 'Anjali Gupta', class: '11', group: 'PCB', status: 'absent' },
    { id: 7, name: 'Vikram Patel', class: '11', group: 'PCM', status: 'present' },
    { id: 8, name: 'Deepika Sharma', class: '11', group: 'PCB', status: 'present' },
  ];

  const [attendanceData, setAttendanceData] = useState(
    students.reduce((acc, student) => {
      acc[student.id] = student.status === 'present';
      return acc;
    }, {})
  );

  const filteredStudents = students.filter(student => student.class === selectedClass);

  const handleAttendanceChange = (studentId, isPresent) => {
    setAttendanceData(prev => ({
      ...prev,
      [studentId]: isPresent
    }));
  };

  const markAllPresent = () => {
    const updatedData = {};
    filteredStudents.forEach(student => {
      updatedData[student.id] = true;
    });
    setAttendanceData(prev => ({ ...prev, ...updatedData }));
  };

  const markAllAbsent = () => {
    const updatedData = {};
    filteredStudents.forEach(student => {
      updatedData[student.id] = false;
    });
    setAttendanceData(prev => ({ ...prev, ...updatedData }));
  };

  const saveAttendance = () => {
    console.log('Saving attendance for date:', selectedDate);
    console.log('Attendance data:', attendanceData);
    // In a real app, this would save to the database
  };

  const getAttendanceStats = () => {
    const total = filteredStudents.length;
    const present = filteredStudents.filter(student => attendanceData[student.id]).length;
    const absent = total - present;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    return { total, present, absent, percentage };
  };

  const stats = getAttendanceStats();

  // Mock attendance history data
  const attendanceHistory = [
    { date: '2024-12-14', class: '11', present: 15, total: 18, percentage: 83 },
    { date: '2024-12-13', class: '11', present: 17, total: 18, percentage: 94 },
    { date: '2024-12-12', class: '11', present: 16, total: 18, percentage: 89 },
    { date: '2024-12-11', class: '11', present: 14, total: 18, percentage: 78 },
    { date: '2024-12-10', class: '11', present: 18, total: 18, percentage: 100 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Attendance</h2>
        <p className="text-gray-600">Mark and track daily attendance for students</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar and Controls */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2" />
                Select Date
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Select Class
                </label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="11">Class 11</SelectItem>
                    <SelectItem value="12">Class 12</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={markAllPresent} className="flex-1">
                  Mark All Present
                </Button>
                <Button size="sm" variant="outline" onClick={markAllAbsent} className="flex-1">
                  Mark All Absent
                </Button>
              </div>
              <Button onClick={saveAttendance} className="w-full">
                Save Attendance
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Marking */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Class {selectedClass} - {selectedDate.toDateString()}
                </span>
                <div className="flex space-x-2">
                  <Badge variant="secondary">{stats.total} Total</Badge>
                  <Badge className="bg-green-100 text-green-800">{stats.present} Present</Badge>
                  <Badge className="bg-red-100 text-red-800">{stats.absent} Absent</Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredStudents.map(student => (
                  <div key={student.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        id={`student-${student.id}`}
                        checked={attendanceData[student.id] || false}
                        onCheckedChange={(checked) => handleAttendanceChange(student.id, checked)}
                      />
                      <label htmlFor={`student-${student.id}`} className="font-medium text-gray-900 cursor-pointer">
                        {student.name}
                      </label>
                      <Badge variant="outline">{student.group}</Badge>
                    </div>
                    <div className="flex items-center">
                      {attendanceData[student.id] ? (
                        <CheckSquare className="h-5 w-5 text-green-600" />
                      ) : (
                        <X className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Attendance Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                  <div className="text-sm text-gray-600">Total Students</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{stats.present}</div>
                  <div className="text-sm text-gray-600">Present</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
                  <div className="text-sm text-gray-600">Absent</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{stats.percentage}%</div>
                  <div className="text-sm text-gray-600">Attendance Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Attendance History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Attendance History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Date</th>
                  <th className="text-left p-3">Class</th>
                  <th className="text-left p-3">Present</th>
                  <th className="text-left p-3">Total</th>
                  <th className="text-left p-3">Percentage</th>
                  <th className="text-left p-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceHistory.map((record, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3">{new Date(record.date).toLocaleDateString()}</td>
                    <td className="p-3">Class {record.class}</td>
                    <td className="p-3">{record.present}</td>
                    <td className="p-3">{record.total}</td>
                    <td className="p-3">{record.percentage}%</td>
                    <td className="p-3">
                      <Badge 
                        className={
                          record.percentage >= 90 
                            ? 'bg-green-100 text-green-800'
                            : record.percentage >= 75
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }
                      >
                        {record.percentage >= 90 ? 'Excellent' : record.percentage >= 75 ? 'Good' : 'Needs Attention'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Attendance;
