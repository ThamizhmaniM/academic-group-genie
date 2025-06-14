
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, RefreshCw } from 'lucide-react';

const Timetable = () => {
  const [selectedGroup, setSelectedGroup] = useState('class-11-pcm');

  const groups = [
    { id: 'class-11-pcm', name: 'Class 11 - PCM' },
    { id: 'class-11-pcb', name: 'Class 11 - PCB' },
    { id: 'class-11-cs', name: 'Class 11 - CS' },
    { id: 'class-12-pcm', name: 'Class 12 - PCM' },
    { id: 'class-12-pcb', name: 'Class 12 - PCB' },
    { id: 'class-12-cs', name: 'Class 12 - CS' },
  ];

  const timeSlots = [
    { id: 1, time: '6:00 PM - 7:30 PM' },
    { id: 2, time: '7:30 PM - 9:00 PM' },
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  const timetableData = {
    'class-11-pcm': {
      Monday: [
        { subject: 'Mathematics', teacher: 'Mr. Sharma', color: 'bg-blue-100 text-blue-800' },
        { subject: 'Physics', teacher: 'Dr. Patel', color: 'bg-green-100 text-green-800' },
      ],
      Tuesday: [
        { subject: 'Chemistry', teacher: 'Ms. Gupta', color: 'bg-purple-100 text-purple-800' },
        { subject: 'Mathematics', teacher: 'Mr. Sharma', color: 'bg-blue-100 text-blue-800' },
      ],
      Wednesday: [
        { subject: 'Physics', teacher: 'Dr. Patel', color: 'bg-green-100 text-green-800' },
        { subject: 'Chemistry', teacher: 'Ms. Gupta', color: 'bg-purple-100 text-purple-800' },
      ],
      Thursday: [
        { subject: 'Mathematics', teacher: 'Mr. Sharma', color: 'bg-blue-100 text-blue-800' },
        { subject: 'Physics', teacher: 'Dr. Patel', color: 'bg-green-100 text-green-800' },
      ],
      Friday: [
        { subject: 'Chemistry', teacher: 'Ms. Gupta', color: 'bg-purple-100 text-purple-800' },
        { subject: 'Mathematics', teacher: 'Mr. Sharma', color: 'bg-blue-100 text-blue-800' },
      ],
    },
    'class-11-pcb': {
      Monday: [
        { subject: 'Mathematics', teacher: 'Mr. Sharma', color: 'bg-blue-100 text-blue-800' },
        { subject: 'Biology', teacher: 'Dr. Singh', color: 'bg-red-100 text-red-800' },
      ],
      Tuesday: [
        { subject: 'Physics', teacher: 'Dr. Patel', color: 'bg-green-100 text-green-800' },
        { subject: 'Chemistry', teacher: 'Ms. Gupta', color: 'bg-purple-100 text-purple-800' },
      ],
      Wednesday: [
        { subject: 'Biology', teacher: 'Dr. Singh', color: 'bg-red-100 text-red-800' },
        { subject: 'Mathematics', teacher: 'Mr. Sharma', color: 'bg-blue-100 text-blue-800' },
      ],
      Thursday: [
        { subject: 'Chemistry', teacher: 'Ms. Gupta', color: 'bg-purple-100 text-purple-800' },
        { subject: 'Physics', teacher: 'Dr. Patel', color: 'bg-green-100 text-green-800' },
      ],
      Friday: [
        { subject: 'Mathematics', teacher: 'Mr. Sharma', color: 'bg-blue-100 text-blue-800' },
        { subject: 'Biology', teacher: 'Dr. Singh', color: 'bg-red-100 text-red-800' },
      ],
    },
  };

  const getCurrentTimetable = () => {
    return timetableData[selectedGroup] || timetableData['class-11-pcm'];
  };

  const generateTimetable = () => {
    console.log('Generating new timetable for:', selectedGroup);
    // In a real app, this would call an API to generate a new timetable
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Timetable</h2>
          <p className="text-gray-600">Weekly schedule for subject groups (6:00 PM - 9:00 PM)</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedGroup} onValueChange={setSelectedGroup}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select group" />
            </SelectTrigger>
            <SelectContent>
              {groups.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={generateTimetable} className="flex items-center">
            <RefreshCw className="h-4 w-4 mr-2" />
            Generate New
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            {groups.find(g => g.id === selectedGroup)?.name} - Weekly Timetable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border p-3 bg-gray-50 text-left font-medium">Time</th>
                  {days.map((day) => (
                    <th key={day} className="border p-3 bg-gray-50 text-center font-medium">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((slot, slotIndex) => (
                  <tr key={slot.id}>
                    <td className="border p-3 bg-gray-50 font-medium">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        {slot.time}
                      </div>
                    </td>
                    {days.map((day) => {
                      const currentTimetable = getCurrentTimetable();
                      const daySchedule = currentTimetable[day] || [];
                      const classInfo = daySchedule[slotIndex];
                      
                      return (
                        <td key={day} className="border p-3 text-center">
                          {classInfo ? (
                            <div className="space-y-2">
                              <Badge className={`${classInfo.color} font-medium`}>
                                {classInfo.subject}
                              </Badge>
                              <div className="text-xs text-gray-600">
                                {classInfo.teacher}
                              </div>
                            </div>
                          ) : (
                            <div className="text-gray-400 text-sm">-</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Timetable Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Timetable Generation Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Time Constraints</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Time Window: 6:00 PM - 9:00 PM</li>
                <li>• 2 subjects per day, 1.5 hours each</li>
                <li>• Monday to Friday schedule</li>
                <li>• No weekend regular classes</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Scheduling Rules</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• No subject repetition on consecutive days</li>
                <li>• Balanced distribution across the week</li>
                <li>• Automatic conflict resolution</li>
                <li>• Teacher availability considered</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Timetable;
