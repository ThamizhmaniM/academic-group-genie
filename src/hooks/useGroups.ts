
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Group {
  id: string;
  name: string;
  class: '11' | '12';
  color: string;
  subjects: Array<{
    id: string;
    name: string;
    code: string;
  }>;
  students: Array<{
    id: string;
    name: string;
  }>;
}

export const useGroups = () => {
  return useQuery({
    queryKey: ['groups'],
    queryFn: async () => {
      const { data: groups, error } = await supabase
        .from('subject_groups')
        .select(`
          id,
          name,
          class,
          color,
          group_subjects(
            subjects(id, name, code)
          ),
          group_students(
            students(id, name)
          )
        `)
        .order('name');

      if (error) throw error;

      return groups.map(group => ({
        ...group,
        subjects: group.group_subjects.map(gs => gs.subjects).filter(Boolean),
        students: group.group_students.map(gs => gs.students).filter(Boolean)
      }));
    }
  });
};
