
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users } from 'lucide-react';

const Groups = () => {
  const groups = [
    {
      id: 1,
      name: 'Class 11 - PCM',
      class: '11',
      subjects: ['Mathematics', 'Physics', 'Chemistry'],
      students: [
        { id: 1, name: 'Rahul Sharma' },
        { id: 2, name: 'Arjun Singh' },
        { id: 3, name: 'Vikram Patel' },
      ],
      color: 'bg-blue-100 text-blue-800',
    },
    {
      id: 2,
      name: 'Class 11 - PCB',
      class: '11',
      subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology'],
      students: [
        { id: 4, name: 'Priya Patel' },
        { id: 5, name: 'Anjali Gupta' },
        { id: 6, name: 'Deepika Sharma' },
        { id: 7, name: 'Neha Kumar' },
      ],
      color: 'bg-green-100 text-green-800',
    },
    {
      id: 3,
      name: 'Class 11 - CS',
      class: '11',
      subjects: ['Mathematics', 'Physics', 'Chemistry', 'Computer Science'],
      students: [
        { id: 8, name: 'Rohit Verma' },
        { id: 9, name: 'Kiran Joshi' },
      ],
      color: 'bg-purple-100 text-purple-800',
    },
    {
      id: 4,
      name: 'Class 12 - PCM',
      class: '12',
      subjects: ['Mathematics', 'Physics', 'Chemistry'],
      students: [
        { id: 10, name: 'Aditya Rao' },
        { id: 11, name: 'Suresh Nair' },
        { id: 12, name: 'Manish Tiwari' },
      ],
      color: 'bg-orange-100 text-orange-800',
    },
    {
      id: 5,
      name: 'Class 12 - PCB',
      class: '12',
      subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology'],
      students: [
        { id: 13, name: 'Sneha Gupta' },
        { id: 14, name: 'Ravi Kumar' },
        { id: 15, name: 'Pooja Singh' },
        { id: 16, name: 'Akash Pandey' },
      ],
      color: 'bg-red-100 text-red-800',
    },
    {
      id: 6,
      name: 'Class 12 - CS',
      class: '12',
      subjects: ['Mathematics', 'Physics', 'Chemistry', 'Computer Science'],
      students: [
        { id: 17, name: 'Amit Kumar' },
        { id: 18, name: 'Rajesh Agarwal' },
        { id: 19, name: 'Sanjay Mishra' },
      ],
      color: 'bg-indigo-100 text-indigo-800',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Subject Groups</h2>
        <p className="text-gray-600">Automatically grouped students by class and subject combinations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <Card key={group.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{group.name}</CardTitle>
                <Badge className={group.color}>
                  {group.students.length} students
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Subjects */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Subjects</h4>
                  <div className="flex flex-wrap gap-1">
                    {group.subjects.map((subject) => (
                      <Badge key={subject} variant="secondary" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Students */}
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    Students
                  </h4>
                  <div className="space-y-1">
                    {group.students.map((student) => (
                      <div
                        key={student.id}
                        className="text-sm text-gray-600 py-1 px-2 bg-gray-50 rounded"
                      >
                        {student.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Group Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Group Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{groups.length}</div>
              <div className="text-sm text-gray-600">Total Groups</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {groups.reduce((sum, group) => sum + group.students.length, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Students</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(groups.reduce((sum, group) => sum + group.students.length, 0) / groups.length)}
              </div>
              <div className="text-sm text-gray-600">Avg. Students per Group</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Groups;
