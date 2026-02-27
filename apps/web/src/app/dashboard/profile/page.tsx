'use client';
import { useEffect, useState } from 'react';
import { usersApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { User, Mail, Phone, Lock, Save } from 'lucide-react';

export default function UserProfile() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [passSaving, setPassSaving] = useState(false);

    const [form, setForm] = useState({ name: '', phone: '', email: '' });
    const [passForm, setPassForm] = useState({ currentPassword: '', newPassword: '' });

    useEffect(() => {
        usersApi.profile()
            .then(res => {
                const u = res.data.data;
                setForm({ name: u.name || '', phone: u.phone || '', email: u.email || '' });
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await usersApi.updateProfile({ name: form.name, phone: form.phone });
            localStorage.setItem('gt_user', JSON.stringify(res.data.data));
            toast.success('Profile updated successfully!');
            // Force reload UI just to update initials in sidebar
            window.location.reload();
        } catch {
            toast.error('Failed to update profile.');
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passForm.newPassword.length < 8) {
            return toast.error('New password must be at least 8 characters.');
        }
        setPassSaving(true);
        try {
            await usersApi.changePassword(passForm);
            toast.success('Password changed successfully!');
            setPassForm({ currentPassword: '', newPassword: '' });
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to change password.');
        } finally {
            setPassSaving(false);
        }
    };

    if (loading) return <div className="animate-pulse space-y-4"><div className="h-64 bg-gray-200 rounded-2xl" /><div className="h-64 bg-gray-200 rounded-2xl" /></div>;

    return (
        <div className="space-y-6 max-w-2xl">
            <h2 className="font-display text-xl font-bold text-night-900 mb-6">My Profile</h2>

            <div className="card p-6">
                <h3 className="font-bold text-night-900 mb-5 border-b border-gray-100 pb-4">Personal Information</h3>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-night-900 mb-1.5">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required className="input-field pl-12" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-night-900 mb-1.5">Email Address (Read-only)</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input value={form.email} disabled className="input-field pl-12 bg-gray-50 text-gray-500 cursor-not-allowed" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-night-900 mb-1.5">Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="input-field pl-12" />
                        </div>
                    </div>
                    <button type="submit" disabled={saving} className="btn-primary py-3">
                        <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>

            <div className="card p-6">
                <h3 className="font-bold text-night-900 mb-5 border-b border-gray-100 pb-4">Security</h3>
                <form onSubmit={handleChangePassword} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-night-900 mb-1.5">Current Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="password" value={passForm.currentPassword} onChange={e => setPassForm(p => ({ ...p, currentPassword: e.target.value }))} required className="input-field pl-12" placeholder="••••••••" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-night-900 mb-1.5">New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input type="password" value={passForm.newPassword} onChange={e => setPassForm(p => ({ ...p, newPassword: e.target.value }))} required className="input-field pl-12" placeholder="••••••••" />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">Minimum 8 characters</p>
                    </div>
                    <button type="submit" disabled={passSaving} className="btn-primary py-3">
                        <Lock className="w-4 h-4" /> {passSaving ? 'Updating...' : 'Update Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}
