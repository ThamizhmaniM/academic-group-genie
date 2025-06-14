
-- Create enum for student classes
CREATE TYPE public.student_class AS ENUM ('11', '12');

-- Create enum for attendance status
CREATE TYPE public.attendance_status AS ENUM ('present', 'absent');

-- Create subjects table
CREATE TABLE public.subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default subjects
INSERT INTO public.subjects (name, code) VALUES
  ('Mathematics', 'MATH'),
  ('Physics', 'PHY'),
  ('Chemistry', 'CHEM'),
  ('Biology', 'BIO'),
  ('Computer Science', 'CS'),
  ('English', 'ENG'),
  ('Hindi', 'HIN');

-- Create students table
CREATE TABLE public.students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  class student_class NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create student_subjects junction table
CREATE TABLE public.student_subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, subject_id)
);

-- Create subject groups table
CREATE TABLE public.subject_groups (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  class student_class NOT NULL,
  color TEXT DEFAULT 'bg-blue-100 text-blue-800',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create group_subjects junction table
CREATE TABLE public.group_subjects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES public.subject_groups(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  UNIQUE(group_id, subject_id)
);

-- Create group_students junction table
CREATE TABLE public.group_students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES public.subject_groups(id) ON DELETE CASCADE,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(group_id, student_id)
);

-- Create timetable table
CREATE TABLE public.timetables (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES public.subject_groups(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 1 AND day_of_week <= 5), -- 1=Monday, 5=Friday
  time_slot INTEGER NOT NULL CHECK (time_slot IN (1, 2)), -- 1=6:00-7:30, 2=7:30-9:00
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  teacher_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(group_id, day_of_week, time_slot)
);

-- Create test_schedules table
CREATE TABLE public.test_schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id UUID REFERENCES public.subject_groups(id) ON DELETE CASCADE,
  subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  test_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  test_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create attendance table
CREATE TABLE public.attendance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status attendance_status NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(student_id, date)
);

-- Enable RLS on all tables
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subject_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is an admin system)
-- You may want to add authentication later
CREATE POLICY "Allow all operations on subjects" ON public.subjects FOR ALL USING (true);
CREATE POLICY "Allow all operations on students" ON public.students FOR ALL USING (true);
CREATE POLICY "Allow all operations on student_subjects" ON public.student_subjects FOR ALL USING (true);
CREATE POLICY "Allow all operations on subject_groups" ON public.subject_groups FOR ALL USING (true);
CREATE POLICY "Allow all operations on group_subjects" ON public.group_subjects FOR ALL USING (true);
CREATE POLICY "Allow all operations on group_students" ON public.group_students FOR ALL USING (true);
CREATE POLICY "Allow all operations on timetables" ON public.timetables FOR ALL USING (true);
CREATE POLICY "Allow all operations on test_schedules" ON public.test_schedules FOR ALL USING (true);
CREATE POLICY "Allow all operations on attendance" ON public.attendance FOR ALL USING (true);

-- Create function to automatically assign students to groups based on subjects
CREATE OR REPLACE FUNCTION assign_student_to_group(student_uuid UUID)
RETURNS VOID AS $$
DECLARE
  student_class student_class;
  student_subjects UUID[];
  matching_group_id UUID;
  group_name TEXT;
BEGIN
  -- Get student's class
  SELECT class INTO student_class FROM public.students WHERE id = student_uuid;
  
  -- Get student's subjects
  SELECT ARRAY_AGG(subject_id) INTO student_subjects 
  FROM public.student_subjects 
  WHERE student_id = student_uuid;
  
  -- Try to find existing group with same class and subjects
  SELECT sg.id INTO matching_group_id
  FROM public.subject_groups sg
  WHERE sg.class = student_class
  AND (
    SELECT ARRAY_AGG(gs.subject_id ORDER BY gs.subject_id)
    FROM public.group_subjects gs
    WHERE gs.group_id = sg.id
  ) = (
    SELECT ARRAY(SELECT unnest(student_subjects) ORDER BY 1)
  );
  
  -- If no matching group found, create one
  IF matching_group_id IS NULL THEN
    -- Generate group name based on subjects
    SELECT string_agg(s.code, '') INTO group_name
    FROM public.subjects s
    WHERE s.id = ANY(student_subjects)
    ORDER BY s.code;
    
    INSERT INTO public.subject_groups (name, class)
    VALUES ('Class ' || student_class || ' - ' || group_name, student_class)
    RETURNING id INTO matching_group_id;
    
    -- Add subjects to the new group
    INSERT INTO public.group_subjects (group_id, subject_id)
    SELECT matching_group_id, unnest(student_subjects);
  END IF;
  
  -- Add student to group (ignore if already exists)
  INSERT INTO public.group_students (group_id, student_id)
  VALUES (matching_group_id, student_uuid)
  ON CONFLICT (group_id, student_id) DO NOTHING;
  
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-assign students to groups when subjects are updated
CREATE OR REPLACE FUNCTION trigger_assign_student_to_group()
RETURNS TRIGGER AS $$
BEGIN
  -- Remove student from all groups first
  DELETE FROM public.group_students WHERE student_id = NEW.student_id;
  
  -- Reassign to appropriate group
  PERFORM assign_student_to_group(NEW.student_id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_student_subjects_change
  AFTER INSERT OR UPDATE OR DELETE ON public.student_subjects
  FOR EACH ROW
  EXECUTE FUNCTION trigger_assign_student_to_group();
