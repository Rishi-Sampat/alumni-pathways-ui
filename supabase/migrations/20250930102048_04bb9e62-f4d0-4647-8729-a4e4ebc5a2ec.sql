-- Create RLS policies for all tables

-- Helper function to check user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS user_role
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE user_id = user_uuid;
$$;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = user_uuid AND role = 'admin');
$$;

-- Helper function to check if user is alumni
CREATE OR REPLACE FUNCTION public.is_alumni(user_uuid UUID)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = user_uuid AND role = 'alumni');
$$;

-- Helper function to check if user is student
CREATE OR REPLACE FUNCTION public.is_student(user_uuid UUID)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = user_uuid AND role = 'student');
$$;

-- PROFILES TABLE POLICIES
CREATE POLICY "Users can view all profiles" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can update any profile" ON public.profiles
  FOR UPDATE USING (public.is_admin(auth.uid()));

-- ALUMNI PROFILES TABLE POLICIES
CREATE POLICY "Anyone can view alumni profiles" ON public.alumni_profiles
  FOR SELECT USING (true);

CREATE POLICY "Alumni can insert their own profile" ON public.alumni_profiles
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = profile_id AND user_id = auth.uid() AND role = 'alumni')
  );

CREATE POLICY "Alumni can update their own profile" ON public.alumni_profiles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = profile_id AND user_id = auth.uid() AND role = 'alumni')
  );

CREATE POLICY "Admins can update any alumni profile" ON public.alumni_profiles
  FOR UPDATE USING (public.is_admin(auth.uid()));

-- STUDENT PROFILES TABLE POLICIES
CREATE POLICY "Alumni and admins can view student profiles" ON public.student_profiles
  FOR SELECT USING (
    public.is_alumni(auth.uid()) OR public.is_admin(auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = profile_id AND user_id = auth.uid())
  );

CREATE POLICY "Students can insert their own profile" ON public.student_profiles
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = profile_id AND user_id = auth.uid() AND role = 'student')
  );

CREATE POLICY "Students can update their own profile" ON public.student_profiles
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = profile_id AND user_id = auth.uid() AND role = 'student')
  );

CREATE POLICY "Admins can update any student profile" ON public.student_profiles
  FOR UPDATE USING (public.is_admin(auth.uid()));

-- ALUMNI PHONE DATASET POLICIES (Admin only)
CREATE POLICY "Only admins can access alumni phone dataset" ON public.alumni_phone_dataset
  FOR ALL USING (public.is_admin(auth.uid()));

-- STUDENT ENROLLMENT DATASET POLICIES (Admin only)
CREATE POLICY "Only admins can access student enrollment dataset" ON public.student_enrollment_dataset
  FOR ALL USING (public.is_admin(auth.uid()));

-- OTP VERIFICATIONS POLICIES
CREATE POLICY "System can manage OTP verifications" ON public.otp_verifications
  FOR ALL USING (true);

-- DOUBTS TABLE POLICIES
CREATE POLICY "Students can view and create their own doubts" ON public.doubts
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = student_id AND user_id = auth.uid()) OR
    public.is_alumni(auth.uid()) OR public.is_admin(auth.uid())
  );

CREATE POLICY "Students can insert doubts" ON public.doubts
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = student_id AND user_id = auth.uid() AND role = 'student')
  );

CREATE POLICY "Alumni and admins can update doubts" ON public.doubts
  FOR UPDATE USING (
    public.is_alumni(auth.uid()) OR public.is_admin(auth.uid())
  );

CREATE POLICY "Students can update their own doubts" ON public.doubts
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = student_id AND user_id = auth.uid())
  );

-- OPPORTUNITIES TABLE POLICIES
CREATE POLICY "Anyone can view active opportunities" ON public.opportunities
  FOR SELECT USING (is_active = true);

CREATE POLICY "Alumni can create opportunities" ON public.opportunities
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = posted_by AND user_id = auth.uid() AND role = 'alumni')
  );

CREATE POLICY "Alumni can update their own opportunities" ON public.opportunities
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = posted_by AND user_id = auth.uid())
  );

CREATE POLICY "Admins can manage all opportunities" ON public.opportunities
  FOR ALL USING (public.is_admin(auth.uid()));

-- EVENTS TABLE POLICIES
CREATE POLICY "Anyone can view active events" ON public.events
  FOR SELECT USING (is_active = true);

CREATE POLICY "Alumni can create events" ON public.events
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = organizer_id AND user_id = auth.uid() AND role = 'alumni')
  );

CREATE POLICY "Alumni can update their own events" ON public.events
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = organizer_id AND user_id = auth.uid())
  );

CREATE POLICY "Admins can manage all events" ON public.events
  FOR ALL USING (public.is_admin(auth.uid()));

-- EVENT REGISTRATIONS POLICIES
CREATE POLICY "Users can view event registrations" ON public.event_registrations
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = user_id AND user_id = auth.uid()) OR
    public.is_admin(auth.uid())
  );

CREATE POLICY "Users can register for events" ON public.event_registrations
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = user_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can cancel their own registrations" ON public.event_registrations
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = user_id AND user_id = auth.uid())
  );

-- CHAT MESSAGES POLICIES
CREATE POLICY "Users can view messages they sent or received" ON public.chat_messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = sender_id AND user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = receiver_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can send messages" ON public.chat_messages
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = sender_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can update their own messages" ON public.chat_messages
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = sender_id AND user_id = auth.uid())
  );

-- LEADERBOARD POINTS POLICIES
CREATE POLICY "Anyone can view leaderboard points" ON public.leaderboard_points
  FOR SELECT USING (true);

CREATE POLICY "System can insert leaderboard points" ON public.leaderboard_points
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage leaderboard points" ON public.leaderboard_points
  FOR ALL USING (public.is_admin(auth.uid()));

-- NOTIFICATIONS POLICIES
CREATE POLICY "Users can view their own notifications" ON public.notifications
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = user_id AND user_id = auth.uid())
  );

CREATE POLICY "System can create notifications" ON public.notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own notifications" ON public.notifications
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = user_id AND user_id = auth.uid())
  );

-- FILE UPLOADS POLICIES
CREATE POLICY "Users can view their own file uploads" ON public.file_uploads
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = uploader_id AND user_id = auth.uid()) OR
    public.is_admin(auth.uid())
  );

CREATE POLICY "Users can upload files" ON public.file_uploads
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = uploader_id AND user_id = auth.uid())
  );

CREATE POLICY "Users can update their own file uploads" ON public.file_uploads
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = uploader_id AND user_id = auth.uid())
  );

-- Create functions for automatic profile creation and leaderboard points
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Profile will be created through the registration flow
  RETURN NEW;
END;
$$;

-- Trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to award points
CREATE OR REPLACE FUNCTION public.award_points(
  user_uuid UUID,
  action_name TEXT,
  points_amount INTEGER,
  domain_name TEXT DEFAULT NULL,
  related_doubt_id UUID DEFAULT NULL,
  related_opportunity_id UUID DEFAULT NULL,
  related_event_id UUID DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  profile_id_var UUID;
BEGIN
  -- Get profile ID
  SELECT id INTO profile_id_var FROM public.profiles WHERE user_id = user_uuid;
  
  IF profile_id_var IS NOT NULL THEN
    INSERT INTO public.leaderboard_points (
      user_id, action, points, domain, doubt_id, opportunity_id, event_id
    ) VALUES (
      profile_id_var, action_name, points_amount, domain_name, 
      related_doubt_id, related_opportunity_id, related_event_id
    );
  END IF;
END;
$$;

-- Enable realtime for critical tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.doubts;