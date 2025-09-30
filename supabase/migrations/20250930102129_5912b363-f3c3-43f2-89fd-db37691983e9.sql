-- Fix search path issues in functions

-- Update helper functions with proper search path
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS user_role
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.profiles WHERE user_id = user_uuid;
$$;

CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = user_uuid AND role = 'admin');
$$;

CREATE OR REPLACE FUNCTION public.is_alumni(user_uuid UUID)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = user_uuid AND role = 'alumni');
$$;

CREATE OR REPLACE FUNCTION public.is_student(user_uuid UUID)
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = user_uuid AND role = 'student');
$$;

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
SET search_path = public
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