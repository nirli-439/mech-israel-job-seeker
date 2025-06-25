import { useState, useEffect } from 'react';
import useVisitCount from '@/hooks/useVisitCount';
import LanyardHeader from '@/components/LanyardHeader';
import JobSourceManager from '@/components/JobSourceManager';
import { getJobSources, type JobSource } from '@/services/jobSourcesService';
import { isUsingDatabase } from '@/services/supabaseClient';

const Index = () => {
  const [jobSources, setJobSources] = useState<JobSource[]>([]);
  const visits = useVisitCount();

  useEffect(() => {
    getJobSources()
      .then(setJobSources)
      .catch(() => setJobSources([]));
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden" dir="rtl">
      {/* Centered Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12 flex flex-col items-center gap-6">
          <LanyardHeader />
        </div>

        {/* Job Sources - Centralized */}
        <div className="max-w-6xl mx-auto">
          <JobSourceManager sources={jobSources} readOnly />
        </div>

        {/* Simple Footer */}
        <div className="relative text-center mt-16 pt-8 border-t border-gray-200">
          <span className="absolute left-4 text-xs text-gray-500">
            {isUsingDatabase ? 'DB' : 'Local'}
          </span>
          <span className="absolute right-4 text-xs text-gray-500">
            {visits} visits
          </span>
          <p className="text-tech-gray">© 2025 MechJobs IL מאת ליאור כהן עבור ליאור כהן - מחבר סטודנטים להנדסת מכונות עם הזדמנויות</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
