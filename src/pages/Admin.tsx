import { useState, useEffect } from 'react';
import { getJobSources, saveJobSources, JobSource } from '@/services/jobSourcesService';
import JobSourceManager from '@/components/JobSourceManager';

const ADMIN_PASSWORD = 'afeka';

const Admin = () => {
  const [jobSources, setJobSources] = useState<JobSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (loggedIn) {
      setLoading(true);
      getJobSources()
        .then(setJobSources)
        .catch(() => setError('Failed to load job sources'))
        .finally(() => setLoading(false));
    }
  }, [loggedIn]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setLoggedIn(true);
      setError('');
    } else {
      setError('סיסמה שגויה');
    }
  };

  const handleSourcesChange = (sources: JobSource[]) => {
    setJobSources(sources);
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    setSaveSuccess(false);
    try {
      await saveJobSources(jobSources, ADMIN_PASSWORD);
      setSaveSuccess(true);
    } catch (err) {
      setSaveError('שמירה נכשלה');
    } finally {
      setSaving(false);
    }
  };

  if (!loggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md flex flex-col gap-4">
          <h2 className="text-xl font-bold mb-2">כניסת מנהל</h2>
          <input
            type="password"
            placeholder="סיסמה"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="border p-2 rounded"
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button type="submit" className="bg-blue-500 text-white rounded p-2">התחבר</button>
        </form>
      </div>
    );
  }

  if (loading) return <div className="text-center mt-8">טוען...</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-4">ניהול מקורות עבודה</h2>
      <JobSourceManager sources={jobSources} onSourcesChange={handleSourcesChange} />
      <div className="mt-4 flex gap-2">
        <button
          onClick={handleSave}
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={saving}
        >
          {saving ? 'שומר...' : 'שמור שינויים'}
        </button>
        {saveSuccess && <span className="text-green-600">נשמר בהצלחה!</span>}
        {saveError && <span className="text-red-600">{saveError}</span>}
      </div>
    </div>
  );
};

export default Admin; 