import React, { useState } from 'react';
import { Profile } from '../../types';
import { authService } from '../../services/authService';
import { Card, CardHeader, CardContent, CardFooter } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { User, CheckCircle2, Save } from 'lucide-react';

import { mockStore } from '../../lib/mockStore';

export interface PilotProfileProps {
  user: Profile;
  onProfileUpdated: (updated: Profile) => void;
}

export const PilotProfile: React.FC<PilotProfileProps> = ({ user, onProfileUpdated }) => {
  const [name, setName] = useState(user.name);
  const [email] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || '');
  const [licenseNumber, setLicenseNumber] = useState(user.license_number || '');
  const [vehicleNumber, setVehicleNumber] = useState(user.vehicle_number || '');
  const [vehicleType, setVehicleType] = useState(user.vehicle_type || '');
  const [address, setAddress] = useState(user.address || '');

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const updated = mockStore.updateProfile(user.id, {
        name,
        phone,
        license_number: licenseNumber,
        vehicle_number: vehicleNumber,
        vehicle_type: vehicleType,
        address
      });
      if (updated) {
        onProfileUpdated(updated);
        setSuccess(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <User className="w-6 h-6 text-indigo-600" />
          <span>My Driver / Pilot Profile</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Keep your personal details, driving license, and vehicle registration info up to date for document verification.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader title="Driver & Vehicle Details" description="Official contact, driving license, and vehicle registration numbers" />
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Full Name" value={name} onChange={e => setName(e.target.value)} required />
              <Input label="Email Address" value={email} disabled helperText="Email address registered to account" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Mobile / Phone Number" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 94401 23456" />
              <Input label="Driving License (DL) Number" value={licenseNumber} onChange={e => setLicenseNumber(e.target.value)} placeholder="AP39 20240012345" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Vehicle Registration Number (Plate No.)" value={vehicleNumber} onChange={e => setVehicleNumber(e.target.value)} placeholder="AP 39 TV 4589" />
              <Input label="Vehicle Category / Type" value={vehicleType} onChange={e => setVehicleType(e.target.value)} placeholder="Auto Rickshaw / Passenger Car / Bike" />
            </div>

            <div>
              <Input label="Residential Address (Andhra Pradesh)" value={address} onChange={e => setAddress(e.target.value)} placeholder="Door No. 12-4-15, MG Road, Vijayawada, AP 520010" />
            </div>

            {success && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Your profile information has been saved successfully.</span>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-end border-t border-slate-100">
            <Button type="submit" variant="primary" loading={saving} icon={<Save className="w-4 h-4" />}>
              Save Profile
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};
