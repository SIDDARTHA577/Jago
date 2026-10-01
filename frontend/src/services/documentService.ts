import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { mockStore } from '../lib/mockStore';
import { DocumentItem, DocumentType } from '../types';
import { jsPDF } from 'jspdf';

export const documentService = {
  async getDocumentTypes(): Promise<DocumentType[]> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase
        .from('document_types')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw new Error(error.message);
      return data as DocumentType[];
    }
    return mockStore.getDocumentTypes();
  },

  async uploadDocument(params: {
    applicationId: string;
    documentTypeId: string;
    file: File;
    uploadedBy: string;
  }): Promise<DocumentItem> {
    if (isSupabaseConfigured()) {
      const ext = params.file.name.split('.').pop() || '';
      const path = `jago/applications/${params.applicationId}/documents/${params.documentTypeId}/${Date.now()}.${ext}`;

      const { error: uploadErr } = await supabase.storage
        .from('jago-documents')
        .upload(path, params.file);

      if (uploadErr) throw new Error(uploadErr.message);

      const { data: verData, error: verErr } = await supabase
        .from('document_versions')
        .insert({
          document_id: params.documentTypeId,
          storage_bucket: 'jago-documents',
          storage_path: path,
          original_file_name: params.file.name,
          mime_type: params.file.type,
          extension: ext,
          size_bytes: params.file.size,
          uploaded_by: params.uploadedBy
        })
        .select()
        .single();

      if (verErr) throw new Error(verErr.message);
      return verData as any;
    }

    let fileDataUrl = '';
    try {
      fileDataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string) || '');
        reader.onerror = () => resolve('');
        reader.readAsDataURL(params.file);
      });
    } catch (e) {
      console.warn('Could not read file as Data URL', e);
    }

    return mockStore.uploadDocument({ ...params, fileDataUrl });
  },

  async getDocumentPreviewUrl(documentVersionId: string): Promise<string> {
    if (isSupabaseConfigured()) {
      const { data, error } = await supabase.functions.invoke('document-preview', {
        body: { documentVersionId }
      });
      if (error || !data?.signedUrl) throw new Error('Failed to generate preview URL');
      return data.signedUrl;
    }

    const ver = mockStore.getDocumentVersionById(documentVersionId);
    if (ver && ver.file_data_url) {
      return ver.file_data_url;
    }

    // Generate valid, official PDF Data URL using jsPDF
    const doc = new jsPDF();
    doc.setFillColor(248, 250, 252);
    doc.rect(0, 0, 210, 297, 'F');
    doc.setFillColor(14, 165, 233);
    doc.rect(0, 0, 210, 24, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.text("JAGO PILOT PLATFORM - DOCUMENT PREVIEW", 14, 16);

    doc.setTextColor(30, 41, 59);
    doc.setFontSize(12);
    doc.text(`Document Version ID: ${documentVersionId}`, 14, 38);
    doc.text(`File Name: ${ver?.original_file_name || 'Pilot_Document.pdf'}`, 14, 48);
    doc.text(`Verification Status: ${ver?.verification_status || 'Pending Verification'}`, 14, 58);
    doc.text(`Uploaded At: ${ver?.uploaded_at ? new Date(ver.uploaded_at).toLocaleString() : new Date().toLocaleString()}`, 14, 68);

    doc.setFontSize(10);
    doc.setTextColor(71, 85, 105);
    doc.text("Official Verification & Permission System Document Record", 14, 85);
    doc.setDrawColor(203, 213, 225);
    doc.rect(14, 92, 182, 160);
    doc.text("This document has been loaded and verified within the Jago system.", 20, 110);
    doc.text("All regulatory requirements and Andhra Pradesh pilot access standards apply.", 20, 120);

    return doc.output('datauristring');
  }
};

