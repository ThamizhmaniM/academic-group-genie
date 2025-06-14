
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, Plus, AlertTriangle } from 'lucide-react';

const TestSchedule = () => {
  const [tests, setTests] = useState([
    {
      id: 1,
      subject: 'Mathematics',
      group: 'Class 11 - PCM',
      date: '2024-12-16',
      time: '10:00 AM',
      duration: '2 hours',
      status: 'scheduled',
    },
    {
      id: 2,
      subject: 'Physics',
      group: 'Class 12 - PCB',
      date: '2024-12-17',
      time: '2:00 PM',
      duration: '2 hours',
      status: 'scheduled',
    },
    {
      id: 3,
      subject: 'Chemistry',
      group: 'Class 11 - PCB',
      date: '2024-12-16',
      time: '2:00 PM',
      duration: '2 hours',
      status: 'conflict',
    },
    {
      id: 4,
      subject: 'Biology',
      group: 'Class 12 - PCB',
      date: '2024-12-23',
      time: '10:00 AM',
      duration: '2 hours',
      status: 'scheduled',
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    group: '',
    date: '',
    time: '',
    duration: '2 hours',
  });

  const groups = [
    'Class 11 - PCM',
    'Class 11 - PCB',
    'Class 11 - CS',
    'Class 12 - PCM',
    'Class 12 - PCB',
    'Class 12 - CS',
  ];

  const subjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
  ];

  const timeSlots = [
    '9:00 AM',
    '10:00 AM',
    '11:00 AM',
    '2:00 PM',
    '3:00 PM',
    '4:00 PM',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTest = {
      id: Date.now(),
      ...formData,
      status: 'scheduled',
    };
    setTests(prev => [...prev, newTest]);
    setFormData({
      subject: '',
      group: '',
      date: '',
      time: '',
      duration: '2 hours',
    });
    setIsAddDialogOpen(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-green-100 text-green-800';
      case 'conflict':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getUpcomingTests = () => {
    const today = new Date();
    return tests.filter(test => new Date(test.date) >= today);
  };

  const getConflicts = () => {
    return tests.filter(test => test.status === 'conflict');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Test Schedule</h2>
          <p className="text-gray-600">Weekend test scheduling for all subject groups</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Test
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Schedule New Test</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Select 
                  value={formData.subject} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map(subject => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="group">Group</Label>
                <Select 
                  value={formData.group} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, group: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select group" />
                  </SelectTrigger>
                  <SelectContent>
                    {groups.map(group => (
                      <SelectItem key={group} value={group}>
                        {group}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Select 
                  value={formData.time} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, time: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(time => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Schedule Test</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Conflict Alerts */}
      {getConflicts().length > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-800 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Schedule Conflicts Detected
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {getConflicts().map(test => (
                <div key={test.id} className="flex items-center justify-between p-3 bg-white rounded-lg">
                  <div>
                    <span className="font-medium">{test.subject}</span> - {test.group}
                    <div className="text-sm text-gray-600">
                      {new Date(test.date).toLocaleDateString()} at {test.time}
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    Resolve
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Calendar View */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Calendar className="h-5 w-5 mr-2" />
            Upcoming Tests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getUpcomingTests().map(test => (
              <div key={test.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">{test.subject}</h3>
                  <Badge className={getStatusColor(test.status)}>
                    {test.status}
                  </Badge>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(test.date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {test.time} ({test.duration})
                  </div>
                  <div className="font-medium text-gray-900">
                    {test.group}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Test Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Test Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{tests.length}</div>
              <div className="text-sm text-gray-600">Total Tests</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {tests.filter(t => t.status === 'scheduled').length}
              </div>
              <div className="text-sm text-gray-600">Scheduled</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {getConflicts().length}
              </div>
              <div className="text-sm text-gray-600">Conflicts</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">
                {getUpcomingTests().length}
              </div>
              <div className="text-sm text-gray-600">Upcoming</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TestSchedule;
