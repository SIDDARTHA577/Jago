import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { mockStore } from '../lib/mockStore';
import { Application } from '../types';

export const applicationService = {
  async getApplications(): Promise<Application[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          pilot:profiles!pilot_user_id(*),
          documents(*, document_type:document_types(*), versions:document_versions(*))
        `)
        .order('created_at', { ascending: false });

      if (error) throw new Error(error.message);
      return data as Application[];
    }
    return mockStore.getApplications();
  },

  async getApplicationById(id: string): Promise<Application | null> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          pilot:profiles!pilot_user_id(*),
          documents(*, document_type:document_types(*), current_version:document_versions(*), versions:document_versions(*))
        `)
        .eq('id', id)
        .single();

      if (error) return null;
      return data as Application;
    }
    return mockStore.getApplicationById(id) || null;
  },

  async getPilotApplication(pilotProfileId: string): Promise<Application> {
    if (isSupabaseConfigured()) {
      const { data } = await supabase
        .from('applications')
        .select(`
          *,
          pilot:profiles!pilot_user_id(*),
          documents(*, document_type:document_types(*), current_version:document_versions(*), versions:document_versions(*))
        `)
        .eq('pilot_user_id', pilotProfileId)
        .maybeSingle();

      if (data) return data as Application;
    }
    return mockStore.getApplicationByPilot(pilotProfileId);
  },

  async assignVerifier(applicationId: string, verifierId: string, assignedBy: string): Promise<Application> {
    if (isSupabaseConfigured()) {
      const { error } = await supabase
        .from('application_assignments')
        .insert({ application_id: applicationId, verifier_user_id: verifierId, assigned_by: assignedBy });

      if (error) throw new Error(error.message);
    }
    return mockStore.assignVerifier(applicationId, verifierId, assignedBy);
  }
};
