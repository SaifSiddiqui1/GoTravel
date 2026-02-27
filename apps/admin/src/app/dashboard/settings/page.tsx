'use client';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Save, Settings2, ShieldCheck, Mail, Database } from 'lucide-react';

export default function SettingsPage() {
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        siteName: 'GoTravel',
        contactEmail: 'hello@gotravel.in',
        supportPhone: '+919876543210',
        gstRate: 5,
        enableGeminiAI: true,
        maintenanceMode: false,
    });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setTimeout(() => {
            setSaving(false);
            toast.success('Global settings updated successfully!');
        }, 1000);
    };

    return (
        <div className="max-w-4xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-night-900">Platform Settings</h1>
                <p className="text-gray-500 text-sm">Manage global configuration for GoTravel</p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                {/* General */}
                <div className="card p-6">
                    <h3 className="font-bold text-night-900 mb-5 pb-3 border-b border-gray-100 flex items-center gap-2">
                        <Settings2 className="w-5 h-5 text-brand-500" /> General Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-sm font-medium text-night-900 mb-1.5">Platform Name</label>
                            <input value={settings.siteName} onChange={e => setSettings(s => ({ ...s, siteName: e.target.value }))} className="input-field" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-night-900 mb-1.5">Tax Rate (GST %)</label>
                            <input type="number" value={settings.gstRate} onChange={e => setSettings(s => ({ ...s, gstRate: Number(e.target.value) }))} className="input-field" required min={0} max={100} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-night-900 mb-1.5">Public Contact Email</label>
                            <input type="email" value={settings.contactEmail} onChange={e => setSettings(s => ({ ...s, contactEmail: e.target.value }))} className="input-field" required />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-night-900 mb-1.5">Support Phone</label>
                            <input type="tel" value={settings.supportPhone} onChange={e => setSettings(s => ({ ...s, supportPhone: e.target.value }))} className="input-field" required />
                        </div>
                    </div>
                </div>

                {/* Features */}
                <div className="card p-6">
                    <h3 className="font-bold text-night-900 mb-5 pb-3 border-b border-gray-100 flex items-center gap-2">
                        <Database className="w-5 h-5 text-brand-500" /> Feature Flags
                    </h3>
                    <div className="space-y-4">
                        <label className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:border-brand-200 cursor-pointer transition-colors bg-gray-50">
                            <div>
                                <p className="font-medium text-night-900">Enable Gemini AI Features</p>
                                <p className="text-xs text-gray-500">Toggles AI itinerary generation and FIT suggestions.</p>
                            </div>
                            <input type="checkbox" checked={settings.enableGeminiAI} onChange={e => setSettings(s => ({ ...s, enableGeminiAI: e.target.checked }))} className="w-5 h-5 accent-brand-500 cursor-pointer" />
                        </label>
                        <label className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:border-red-200 cursor-pointer transition-colors bg-gray-50">
                            <div>
                                <p className="font-medium text-night-900 text-red-600 flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> Maintenance Mode</p>
                                <p className="text-xs text-gray-500">Disable frontend access for all users except admins.</p>
                            </div>
                            <input type="checkbox" checked={settings.maintenanceMode} onChange={e => setSettings(s => ({ ...s, maintenanceMode: e.target.checked }))} className="w-5 h-5 accent-red-500 cursor-pointer" />
                        </label>
                    </div>
                </div>

                <button type="submit" disabled={saving} className="btn-primary py-3 px-8">
                    <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Settings'}
                </button>
            </form>
        </div>
    );
}
