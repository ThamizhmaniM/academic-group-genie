
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Student {
  id: string;
  name: string;
  class: '11' | '12';
  subjects: Subject[];
  group?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
}

export const useStudents = () => {
  return useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data: students, error } = await supabase
        .from('students')
        .select(`
          id,
          name,
          class,
          student_subjects(
            subjects(id, name, code)
          )
        `);

      if (error) throw error;

      return students.map(student => ({
        ...student,
        subjects: student.student_subjects.map(ss => ss.subjects).filter(Boolean),
        group: 'Auto-assigned' // Will be updated with actual group data
      }));
    }
  });
};

export const useSubjects = () => {
  return useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('name');

      if (error) throw error;
      return data;
    }
  });
};

export const useCreateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, studentClass, subjectIds }: {
      name: string;
      studentClass: '11' | '12';
      subjectIds: string[];
    }) => {
      // Create student
      const { data: student, error: studentError } = await supabase
        .from('students')
        .insert({ name, class: studentClass })
        .select()
        .single();

      if (studentError) throw studentError;

      // Add student subjects
      if (subjectIds.length > 0) {
        const { error: subjectsError } = await supabase
          .from('student_subjects')
          .insert(
            subjectIds.map(subjectId => ({
              student_id: student.id,
              subject_id: subjectId
            }))
          );

        if (subjectsError) throw subjectsError;
      }

      return student;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    }
  });
};

export const useUpdateStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name, studentClass, subjectIds }: {
      id: string;
      name: string;
      studentClass: '11' | '12';
      subjectIds: string[];
    }) => {
      // Update student
      const { error: studentError } = await supabase
        .from('students')
        .update({ name, class: studentClass })
        .eq('id', id);

      if (studentError) throw studentError;

      // Remove existing subjects
      const { error: deleteError } = await supabase
        .from('student_subjects')
        .delete()
        .eq('student_id', id);

      if (deleteError) throw deleteError;

      // Add new subjects
      if (subjectIds.length > 0) {
        const { error: subjectsError } = await supabase
          .from('student_subjects')
          .insert(
            subjectIds.map(subjectId => ({
              student_id: id,
              subject_id: subjectId
            }))
          );

        if (subjectsError) throw subjectsError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    }
  });
};

export const useDeleteStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    }
  });
};
