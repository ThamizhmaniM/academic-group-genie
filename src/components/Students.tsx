
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2 } from 'lucide-react';

const Students = () => {
  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'Rahul Sharma',
      class: '11',
      subjects: ['Mathematics', 'Physics', 'Chemistry'],
      group: 'PCM',
    },
    {
      id: 2,
      name: 'Priya Patel',
      class: '11',
      subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology'],
      group: 'PCB',
    },
    {
      id: 3,
      name: 'Amit Kumar',
      class: '12',
      subjects: ['Mathematics', 'Physics', 'Chemistry', 'Computer Science'],
      group: 'CS',
    },
    {
      id: 4,
      name: 'Sneha Gupta',
      class: '12',
      subjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology'],
      group: 'PCB',
    },
  ]);

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    class: '',
    subjects: [],
  });

  const availableSubjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'English',
    'Hindi',
  ];

  const handleSubjectChange = (subject, checked) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        subjects: [...prev.subjects, subject]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        subjects: prev.subjects.filter(s => s !== subject)
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingStudent) {
      setStudents(prev => prev.map(student => 
        student.id === editingStudent.id 
          ? { ...student, ...formData, group: getGroupName(formData.subjects) }
          : student
      ));
      setEditingStudent(null);
    } else {
      const newStudent = {
        id: Date.now(),
        ...formData,
        group: getGroupName(formData.subjects),
      };
      setStudents(prev => [...prev, newStudent]);
    }
    setFormData({ name: '', class: '', subjects: [] });
    setIsAddDialogOpen(false);
  };

  const getGroupName = (subjects) => {
    const subjectSet = new Set(subjects);
    if (subjectSet.has('Mathematics') && subjectSet.has('Physics') && subjectSet.has('Chemistry')) {
      if (subjectSet.has('Biology')) return 'PCB';
      if (subjectSet.has('Computer Science')) return 'CS';
      return 'PCM';
    }
    return 'Custom';
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      class: student.class,
      subjects: student.subjects,
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = (studentId) => {
    setStudents(prev => prev.filter(student => student.id !== studentId));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Students</h2>
          <p className="text-gray-600">Manage student enrollment and subject selection</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingStudent(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Student
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingStudent ? 'Edit Student' : 'Add New Student'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>
              <div>
                <Label htmlFor="class">Class</Label>
                <Select 
                  value={formData.class} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, class: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="11">Class 11</SelectItem>
                    <SelectItem value="12">Class 12</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Subjects</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {availableSubjects.map(subject => (
                    <div key={subject} className="flex items-center space-x-2">
                      <Checkbox
                        id={subject}
                        checked={formData.subjects.includes(subject)}
                        onCheckedChange={(checked) => handleSubjectChange(subject, checked)}
                      />
                      <Label htmlFor={subject} className="text-sm">{subject}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingStudent ? 'Update' : 'Add'} Student
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Class</th>
                  <th className="text-left p-2">Subjects</th>
                  <th className="text-left p-2">Group</th>
                  <th className="text-left p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 font-medium">{student.name}</td>
                    <td className="p-2">{student.class}</td>
                    <td className="p-2">
                      <div className="flex flex-wrap gap-1">
                        {student.subjects.map(subject => (
                          <span
                            key={subject}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                          >
                            {subject}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                        {student.group}
                      </span>
                    </td>
                    <td className="p-2">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(student)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDelete(student.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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

export default Students;
