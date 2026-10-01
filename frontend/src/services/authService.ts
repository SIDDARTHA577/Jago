import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { mockStore } from '../lib/mockStore';
import { Profile, UserRole } from '../types';

export const authService = {
  async login(email: string, password?: string, roleOverride?: UserRole): Promise<Profile> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password: password || '' });
      if (error) throw new Error(error.message);

      const { data: profile, error: profErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_user_id', data.user.id)
        .single();

      if (profErr || !profile) throw new Error('User profile missing');
      return profile as Profile;
    }

    let profile: Profile | undefined;

    if (roleOverride) {
      profile = mockStore.getProfileByRole(roleOverride);
    } else if (email) {
      profile = mockStore.getProfiles().find(p => p.email.toLowerCase() === email.toLowerCase());
    }

    if (!profile) {
      profile = mockStore.getProfileByRole('pilot');
    }

    if (!profile) throw new Error('Invalid authentication credentials');

    localStorage.setItem('jago_active_user_id', profile.id);
    return profile;
  },

  async register(params: {
    name: string;
    email: string;
    phone: string;
    password?: string;
    address: string;
    state: string;
    pincode: string;
    role_key?: UserRole;
  }): Promise<Profile> {
    if (isSupabaseConfigured()) {
      const { data: authData, error: authErr } = await supabase.auth.signUp({
        email: params.email,
        password: params.password || 'password123',
        options: {
          data: {
            name: params.name,
            phone: params.phone,
            role_key: params.role_key || 'pilot'
          }
        }
      });
      if (authErr) throw new Error(authErr.message);

      if (authData.user) {
        const newProfile: Profile = {
          id: `p-${authData.user.id}`,
          auth_user_id: authData.user.id,
          role_key: params.role_key || 'pilot',
          name: params.name,
          email: params.email,
          phone: params.phone,
          address: `${params.address}, ${params.state} - ${params.pincode}`,
          state: params.state,
          pincode: params.pincode,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        await supabase.from('profiles').insert(newProfile);
        localStorage.setItem('jago_active_user_id', newProfile.id);
        return newProfile;
      }
    }

    const profile = mockStore.registerUser(params);
    localStorage.setItem('jago_active_user_id', profile.id);
    return profile;
  },

  async getCurrentUser(): Promise<Profile | null> {
    const storedId = localStorage.getItem('jago_active_user_id');
    if (storedId) {
      const p = mockStore.getProfiles().find(prof => prof.id === storedId);
      if (p) return p;
    }

    if (isSupabaseConfigured()) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_user_id', user.id)
        .single();
      return (profile as Profile) || null;
    }

    const defaultPilot = mockStore.getProfileByRole('pilot')!;
    localStorage.setItem('jago_active_user_id', defaultPilot.id);
    return defaultPilot;
  },

  async switchRole(role: UserRole): Promise<Profile> {
    const target = mockStore.getProfileByRole(role);
    if (!target) throw new Error(`Role ${role} profile missing`);
    localStorage.setItem('jago_active_user_id', target.id);
    return target;
  },

  async logout(): Promise<void> {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem('jago_active_user_id');
  }
};
