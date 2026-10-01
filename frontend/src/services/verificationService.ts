import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { mockStore } from '../lib/mockStore';

export const verificationService = {
  async verifyDocument(documentVersionId: string, verifierId: string, remarks?: string) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('document_versions')
        .update({
          verification_status: 'Verified',
          verified_by: verifierId,
          verified_at: new Date().toISOString()
        })
        .eq('id', documentVersionId)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    }
    return mockStore.verifyDocument(documentVersionId, verifierId, remarks);
  },

  async rejectDocument(params: {
    documentVersionId: string;
    verifierId: string;
    reason: string;
    remarks: string;
    rejectionScope: 'DOCUMENT' | 'APPLICATION';
  }) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('document_versions')
        .update({
          verification_status: 'Rejected',
          rejection_reason: params.reason,
          rejection_remarks: params.remarks,
          rejected_by: params.verifierId,
          rejected_at: new Date().toISOString()
        })
        .eq('id', params.documentVersionId)
        .select()
        .single();

      if (error) throw new Error(error.message);
      return data;
    }
    return mockStore.rejectDocument(params);
  }
};

export const approvalService = {
  async grantPermission(applicationId: string, actorId: string, remarks?: string) {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.functions.invoke('grant-permission', {
        body: { applicationId, remarks }
      });
      if (error) throw new Error(error.message || 'Permission grant failed');
      return data;
    }
    return mockStore.grantPermission(applicationId, actorId, remarks);
  }
};
