import { mockStore } from '../lib/mockStore';
import { DocumentType, Profile, SystemSetting } from '../types';

export const adminService = {
  async getUsers(): Promise<Profile[]> {
    return mockStore.getProfiles();
  },

  async updateUserProfile(id: string, updates: Partial<Profile>): Promise<Profile | null> {
    return mockStore.updateProfile(id, updates);
  },

  async saveDocumentType(dt: Partial<DocumentType>): Promise<void> {
    mockStore.saveDocumentType(dt);
  },

  async getSystemSettings(): Promise<SystemSetting[]> {
    return mockStore.getSystemSettings();
  },

  async updateSystemSetting(id: string, value: any, actorId: string): Promise<void> {
    mockStore.updateSystemSetting(id, value, actorId);
  }
};
