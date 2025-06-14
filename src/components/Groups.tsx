
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Loader2 } from 'lucide-react';
import { useGroups } from '@/hooks/useGroups';

const Groups = () => {
  const { data: groups = [], isLoading } = useGroups();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const groupColors = [
    'bg-blue-100 text-blue-800',
    'bg-green-100 text-green-800',
    'bg-purple-100 text-purple-800',
    'bg-orange-100 text-orange-800',
    'bg-red-100 text-red-800',
    'bg-indigo-100 text-indigo-800',
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Subject Groups</h2>
        <p className="text-gray-600">Automatically grouped students by class and subject combinations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group, index) => (
          <Card key={group.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{group.name}</CardTitle>
                <Badge className={groupColors[index % groupColors.length]}>
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
                      <Badge key={subject.id} variant="secondary" className="text-xs">
                        {subject.name}
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
                {groups.length > 0 ? Math.round(groups.reduce((sum, group) => sum + group.students.length, 0) / groups.length) : 0}
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
