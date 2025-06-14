
import { useState } from 'react';
import { Briefcase } from 'lucide-react';
import JobSourceManager from '@/components/JobSourceManager';

const Index = () => {
  const [jobSources, setJobSources] = useState([
    { id: 1, name: 'LinkedIn', url: 'https://www.linkedin.com/jobs/search/?currentJobId=4235127935&f_JT=I&geoId=101620260&keywords=mechanical%20engineer%20student&origin=JOB_SEARCH_PAGE_LOCATION_AUTOCOMPLETE&originalSubdomain=il&refresh=true' },
    { id: 2, name: 'Glassdoor', url: 'https://www.glassdoor.com/Job/israel-mechanical-engineering-student-jobs-SRCH_IL.0,6_IN119_KO7,37.htm' },
    { id: 3, name: 'AllJobs', url: 'https://www.alljobs.co.il/SearchResultsGuest.aspx?page=1&position=1047&type=&source=&duration=0&exc=&region=' },
    { id: 4, name: 'JobMaster', url: 'https://www.jobmaster.co.il/jobs/?q=מהנדס%20מכונות%20סטודנט&l=' },
    { id: 5, name: 'Drushim', url: 'https://www.drushim.co.il/jobs/?searchterm=מהנדס%20מכונות%20סטודנט' },
    { id: 6, name: 'SQLink', url: 'https://www.sqlink.com/career?search=engineering%20intern&type=internship' },
    { id: 7, name: 'Intel Israel', url: 'https://jobs.intel.com/en_US/search?keywords=engineering%20intern&location=Israel' },
    { id: 8, name: 'Elbit Systems', url: 'https://elbitsystemscareer.com/go/סטודנטים/9275855/' },
    { id: 9, name: 'IAI (אלתא)', url: 'https://jobs.iai.co.il/jobs/?tp=משרת%20סטודנט' },
    { id: 10, name: 'רפאל (Rafael)', url: 'https://career.rafael.co.il/students/' },
    { id: 11, name: 'HP Careers', url: 'https://jobs.hp.com/us/students-graduates/' },
    { id: 12, name: 'Applied Materials', url: 'https://jobs.appliedmaterials.com/location/israel-jobs/95/294640?q=student' },
    { id: 13, name: 'Art Medical', url: 'https://artmedical.com/careers/?search=intern' },
    { id: 14, name: 'Arad Technologies', url: 'https://aradtec.com/careers/?search=student' },
    { id: 15, name: 'Orbit Technologies', url: 'https://orbit-cs.com/careers/?search=intern' },
    { id: 16, name: 'Ness Technologies', url: 'https://www.ness.com/careers/?search=intern' },
    { id: 17, name: 'Amarel', url: 'https://www.amarel.net/careers-tags/students/' }
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Centered Main Content */}
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-israel-gradient rounded-xl flex items-center justify-center">
              <Briefcase className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-israel-gradient bg-clip-text text-transparent">
              MechJobs IL
            </h1>
          </div>
          
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Find Jobs for Mechanical Engineering Students in Israel
          </h2>
          
          <p className="text-lg text-tech-gray max-w-2xl mx-auto">
            Your one-stop destination to discover opportunities at top Israeli companies
          </p>
        </div>

        {/* Job Sources - Centralized */}
        <div className="max-w-6xl mx-auto">
          <JobSourceManager 
            sources={jobSources} 
            onSourcesChange={setJobSources} 
          />
        </div>

        {/* Simple Footer */}
        <div className="text-center mt-16 pt-8 border-t border-gray-200">
          <p className="text-tech-gray">
            &copy; 2024 MechJobs IL - Connecting Mechanical Engineering Students with Opportunities
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
