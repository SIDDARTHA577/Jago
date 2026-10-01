import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { mockStore } from '../lib/mockStore';
import { Profile, UserRole } from '../types';

const SESSION_KEY = 'jago_auth_session';
export const SESSION_DURATION_MS = 15 * 60 * 1000; // 15 minutes session limit

export interface UserSession {
  token: string;
  userId: string;
  role: UserRole;
  issuedAt: number;
  expiresAt: number;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = 'JAGO_SECURE_SALT_2026_V1';
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const buffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(buffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export const authService = {
  async login(email: string, password?: string): Promise<Profile> {
    const cleanEmail = (email || '').trim();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail) {
      throw new Error('Please enter your email address.');
    }
    if (!cleanPassword) {
      throw new Error('Please enter your password.');
    }

    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.auth.signInWithPassword({ email: cleanEmail, password: cleanPassword });
      if (error) throw new Error(error.message);

      const { data: profile, error: profErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('auth_user_id', data.user.id)
        .single();

      if (profErr || !profile) throw new Error('User profile missing');
      this.createSession(profile as Profile);
      return profile as Profile;
    }

    const profiles = mockStore.getProfiles();
    const profile = profiles.find(p => p.email.toLowerCase() === cleanEmail.toLowerCase());

    if (!profile) {
      throw new Error('Invalid email address or password.');
    }

    const inputHash = await hashPassword(cleanPassword);
    if (profile.password_hash) {
      const validHashes = profile.password_hash.split(',');
      if (!validHashes.includes(inputHash)) {
        throw new Error('Invalid email address or password.');
      }
    }

    this.createSession(profile);
    return profile;
  },

  createSession(profile: Profile): UserSession {
    const now = Date.now();
    const session: UserSession = {
      token: `sess_${now}_${Math.random().toString(36).substring(2, 9)}`,
      userId: profile.id,
      role: profile.role_key,
      issuedAt: now,
      expiresAt: now + SESSION_DURATION_MS
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    localStorage.setItem('jago_active_user_id', profile.id);
    return session;
  },

  getSession(): UserSession | null {
    const sessionStr = localStorage.getItem(SESSION_KEY);
    if (!sessionStr) return null;

    try {
      const session: UserSession = JSON.parse(sessionStr);
      if (!session || !session.expiresAt || Date.now() >= session.expiresAt) {
        this.logout();
        return null;
      }
      return session;
    } catch {
      this.logout();
      return null;
    }
  },

  isSessionValid(): boolean {
    return this.getSession() !== null;
  },

  async getCurrentUser(): Promise<Profile | null> {
    const session = this.getSession();
    if (!session) {
      return null;
    }

    const p = mockStore.getProfiles().find(prof => prof.id === session.userId);
    if (p) return p;

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

    return null;
  },

  async register(params: {
    name: string;
    email: string;
    phone: string;
    password: string;
    address: string;
    state: string;
    pincode: string;
    license_number: string;
    vehicle_number: string;
    vehicle_type?: string;
    role_key?: UserRole;
  }): Promise<Profile> {
    const passwordHash = await hashPassword(params.password);

    if (isSupabaseConfigured()) {
      const { data: authData, error: authErr } = await supabase.auth.signUp({
        email: params.email,
        password: params.password,
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
          license_number: params.license_number,
          vehicle_number: params.vehicle_number,
          vehicle_type: params.vehicle_type || 'Auto Rickshaw (Passenger Vehicle)',
          address: `${params.address}, ${params.state} - ${params.pincode}`,
          state: params.state,
          pincode: params.pincode,
          password_hash: passwordHash,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        await supabase.from('profiles').insert(newProfile);
        this.createSession(newProfile);
        return newProfile;
      }
    }

    const profile = mockStore.registerUser({
      ...params,
      password_hash: passwordHash
    });
    this.createSession(profile);
    return profile;
  },

  async switchRole(role: UserRole): Promise<Profile> {
    const session = this.getSession();
    if (!session) throw new Error('Session expired or invalid.');
    const currentUser = mockStore.getProfiles().find(p => p.id === session.userId);
    if (!currentUser || currentUser.role_key !== 'admin') {
      throw new Error('Unauthorized role switch attempt.');
    }
    const target = mockStore.getProfileByRole(role);
    if (!target) throw new Error(`Role ${role} profile missing`);
    this.createSession(target);
    return target;
  },

  async logout(): Promise<void> {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('jago_active_user_id');
  }
};
