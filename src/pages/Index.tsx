
import { useState } from 'react';
import { Search, MapPin, Briefcase, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import JobSourceManager from '@/components/JobSourceManager';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');

  const [jobSources, setJobSources] = useState([
    { id: 1, name: 'LinkedIn', url: 'https://il.linkedin.com/jobs/mechanical-engineering-student-jobs?keywords=mechanical%20engineer%20student&location=Israel&f_JT=I' },
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

  const israeliCities = [
    'Tel Aviv', 'Jerusalem', 'Haifa', 'Be\'er Sheva', 'Petah Tikva', 
    'Netanya', 'Ashdod', 'Rishon LeZion', 'Ramat Gan', 'Herzliya', 'Rehovot'
  ];

  const handleSearch = () => {
    console.log('Searching for:', { searchTerm, location, experienceLevel });
    // Here you can implement actual search logic
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-israel-gradient rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-israel-gradient bg-clip-text text-transparent">
              MechJobs IL
            </h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 animate-fade-in">
            Find{' '}
            <span className="bg-israel-gradient bg-clip-text text-transparent">
              Mechanical Engineering
            </span>{' '}
            Jobs in Israel
          </h2>
          <p className="text-lg text-tech-gray mb-12 max-w-2xl mx-auto animate-slide-up">
            Connect with top Israeli companies seeking mechanical engineering students and interns.
          </p>

          {/* Search Section */}
          <Card className="max-w-4xl mx-auto shadow-xl border-0 bg-white/90 backdrop-blur-sm animate-slide-up">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-tech-gray" />
                  <Input
                    placeholder="Job title or keyword"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-12"
                  />
                </div>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="h-12">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-tech-gray" />
                      <SelectValue placeholder="Location" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    {israeliCities.map((city) => (
                      <SelectItem key={city} value={city.toLowerCase()}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                  <SelectTrigger className="h-12">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-tech-gray" />
                      <SelectValue placeholder="Type" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student Job</SelectItem>
                    <SelectItem value="intern">Internship</SelectItem>
                    <SelectItem value="entry">Entry Level</SelectItem>
                  </SelectContent>
                </Select>
                <Button className="h-12 bg-israel-gradient text-white hover:opacity-90" onClick={handleSearch}>
                  Search Jobs
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Job Sources Section */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">Search Across Top Job Sites</h3>
          <JobSourceManager 
            sources={jobSources} 
            onSourcesChange={setJobSources} 
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-israel-gradient rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <h4 className="text-xl font-bold">MechJobs IL</h4>
            </div>
            <p className="text-gray-400 text-center">
              &copy; 2024 MechJobs IL. Connecting Israeli engineering students with opportunities.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
