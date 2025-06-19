import { useState, useEffect } from 'react';
import RotatingText from '@/components/reactbits/RotatingText';
import LanyardHeader from '@/components/LanyardHeader';
import JobSourceManager from '@/components/JobSourceManager';
import { loadSourcesGlobally, saveSourcesGlobally, type JobSource } from '@/services/jobSourcesService';
import { isUsingDatabase } from '@/services/supabaseClient';

const Index = () => {
  const defaultSources = [
    {
      id: '1',
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/jobs/search/?currentJobId=4235127935&f_JT=I&geoId=101620260&keywords=mechanical%20engineer%20student&origin=JOB_SEARCH_PAGE_LOCATION_AUTOCOMPLETE&originalSubdomain=il&refresh=true',
    },
    {
      id: '2',
      name: 'Glassdoor',
      url: 'https://www.glassdoor.com/Job/israel-mechanical-engineering-student-jobs-SRCH_IL.0,6_IN119_KO7,37.htm',
    },
    {
      id: '3',
      name: 'AllJobs',
      url: 'https://www.alljobs.co.il/SearchResultsGuest.aspx?page=1&position=1047&type=&source=&duration=0&exc=&region=',
    },
    {
      id: '4',
      name: 'JobMaster',
      url: 'https://www.jobmaster.co.il/jobs/?q=מהנדס%20מכונות%20סטודנט&l=',
    },
    {
      id: '5',
      name: 'Drushim',
      url: 'https://www.drushim.co.il/jobs/?searchterm=מהנדס%20מכונות%20סטודנט',
    },
    {
      id: '7',
      name: 'SQLink',
      url: 'https://www.sqlink.com/career?search=engineering%20intern&type=internship',
    },
    {
      id: '8',
      name: 'Intel Israel',
      url: 'https://jobs.intel.com/en_US/search?keywords=engineering%20intern&location=Israel',
    },
    {
      id: '9',
      name: 'Elbit Systems',
      url: 'https://elbitsystemscareer.com/go/סטודנטים/9275855/',
    },
    {
      id: '10',
      name: 'IAI (אלתא)',
      url: 'https://jobs.iai.co.il/jobs/?tp=משרת%20סטודנט',
    },
    {
      id: '11',
      name: 'רפאל (Rafael)',
      url: 'https://career.rafael.co.il/students/',
    },
    {
      id: '12',
      name: 'HP Careers',
      url: 'https://jobs.hp.com/us/students-graduates/',
    },
    {
      id: '13',
      name: 'Applied Materials',
      url: 'https://jobs.appliedmaterials.com/location/israel-jobs/95/294640?q=student',
    },
    {
      id: '14',
      name: 'Art Medical',
      url: 'https://artmedical.com/careers/?search=intern',
    },
    {
      id: '15',
      name: 'Arad Technologies',
      url: 'https://aradtec.com/careers/?search=student',
    },
    {
      id: '16',
      name: 'Ness Technologies',
      url: 'https://www.ness.com/careers/?search=intern',
    },
    {
      id: '17',
      name: 'Amarel',
      url: 'https://www.amarel.net/careers-tags/students/',
    },
    {
      id: '18',
      name: 'TAT Technologies',
      url: 'https://apply.workable.com/tat-technologies-ltd/',
    },
  ];


  const handleSourcesChange = (sources: JobSource[]) => {
    setJobSources(sources);
    localStorage.setItem('jobSources', JSON.stringify(sources));
    saveSourcesGlobally(sources).catch(console.error);
  };


  const [jobSources, setJobSources] = useState(defaultSources);

  useEffect(() => {
    loadSourcesGlobally()
      .then((data) => {
        if (data && data.length) {
          setJobSources(data);
        } else {
          const storedSources = localStorage.getItem('jobSources');
          if (storedSources) setJobSources(JSON.parse(storedSources));
        }
      })
      .catch(() => {
        const storedSources = localStorage.getItem('jobSources');
        if (storedSources) setJobSources(JSON.parse(storedSources));
      });
  }, []);


  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 overflow-hidden" dir="rtl">
      {/* Centered Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12 flex flex-col items-center gap-6">
          <LanyardHeader />
          <RotatingText
            texts={["שלחת קורות חיים היום ?"]}
            className="text-xl font-semibold text-gray-800"
          />
        </div>

        {/* Job Sources - Centralized */}
        <div className="max-w-6xl mx-auto">
          <JobSourceManager sources={jobSources} onSourcesChange={handleSourcesChange} />
        </div>

        {/* Sources are managed above */}

        {/* Simple Footer */}
        <div className="relative text-center mt-16 pt-8 border-t border-gray-200">
          <span className="absolute left-4 text-xs text-gray-500">
            {isUsingDatabase ? 'DB' : 'Local'}
          </span>
          <p className="text-tech-gray">© 2025 MechJobs IL מאת ליאור כהן עבור ליאור כהן - מחבר סטודנטים להנדסת מכונות עם הזדמנויות</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
