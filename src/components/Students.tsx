
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { useStudents, useSubjects, useCreateStudent, useUpdateStudent, useDeleteStudent } from '@/hooks/useStudents';
import { useToast } from '@/hooks/use-toast';

const Students = () => {
  const { data: students = [], isLoading: studentsLoading } = useStudents();
  const { data: subjects = [], isLoading: subjectsLoading } = useSubjects();
  const createStudent = useCreateStudent();
  const updateStudent = useUpdateStudent();
  const deleteStudent = useDeleteStudent();
  const { toast } = useToast();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    class: '',
    subjects: [],
  });

  const handleSubjectChange = (subjectId, checked) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        subjects: [...prev.subjects, subjectId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        subjects: prev.subjects.filter(s => s !== subjectId)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingStudent) {
        await updateStudent.mutateAsync({
          id: editingStudent.id,
          name: formData.name,
          studentClass: formData.class,
          subjectIds: formData.subjects,
        });
        toast({
          title: "Success",
          description: "Student updated successfully",
        });
      } else {
        await createStudent.mutateAsync({
          name: formData.name,
          studentClass: formData.class,
          subjectIds: formData.subjects,
        });
        toast({
          title: "Success",
          description: "Student created successfully",
        });
      }
      
      setFormData({ name: '', class: '', subjects: [] });
      setEditingStudent(null);
      setIsAddDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const getGroupName = (subjectCodes) => {
    const codeSet = new Set(subjectCodes);
    if (codeSet.has('MATH') && codeSet.has('PHY') && codeSet.has('CHEM')) {
      if (codeSet.has('BIO')) return 'PCB';
      if (codeSet.has('CS')) return 'CS';
      return 'PCM';
    }
    return 'Custom';
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      name: student.name,
      class: student.class,
      subjects: student.subjects.map(s => s.id),
    });
    setIsAddDialogOpen(true);
  };

  const handleDelete = async (studentId) => {
    try {
      await deleteStudent.mutateAsync(studentId);
      toast({
        title: "Success",
        description: "Student deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (studentsLoading || subjectsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

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
                  {subjects.map(subject => (
                    <div key={subject.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={subject.id}
                        checked={formData.subjects.includes(subject.id)}
                        onCheckedChange={(checked) => handleSubjectChange(subject.id, checked)}
                      />
                      <Label htmlFor={subject.id} className="text-sm">{subject.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createStudent.isPending || updateStudent.isPending}>
                  {(createStudent.isPending || updateStudent.isPending) && (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  )}
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
                            key={subject.id}
                            className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                          >
                            {subject.name}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                        {getGroupName(student.subjects.map(s => s.code))}
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
                          disabled={deleteStudent.isPending}
                        >
                          {deleteStudent.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
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
