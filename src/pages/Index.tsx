
import { useState } from 'react';
import { Search, MapPin, Briefcase, Users, Building, ChevronDown, Clock, Filter, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');

  const jobListings = [
    {
      id: 1,
      title: 'Mechanical Engineering Intern',
      company: 'Rafael Advanced Defense Systems',
      location: 'Haifa',
      type: 'Internship',
      experience: 'Student',
      posted: '2 days ago',
      description: 'Join our R&D team working on cutting-edge defense technologies. Perfect for mechanical engineering students seeking hands-on experience.',
      tags: ['CAD', 'SolidWorks', 'R&D', 'Defense Technology']
    },
    {
      id: 2,
      title: 'Product Development Student Position',
      company: 'Elbit Systems',
      location: 'Haifa',
      type: 'Student Job',
      experience: 'Student',
      posted: '1 week ago',
      description: 'Work on advanced defense and aerospace systems. Gain experience in mechanical design and testing.',
      tags: ['Aerospace', 'Defense', 'Mechanical Design', 'Testing']
    },
    {
      id: 3,
      title: 'Engineering Intern - Manufacturing',
      company: 'Intel Israel',
      location: 'Jerusalem',
      type: 'Internship',
      experience: 'Student',
      posted: '3 days ago',
      description: 'Support manufacturing processes and equipment optimization in our semiconductor facility.',
      tags: ['Manufacturing', 'Process Engineering', 'Semiconductors']
    },
    {
      id: 4,
      title: 'Mechanical Engineer Student',
      company: 'Israel Aerospace Industries (IAI)',
      location: 'Ben Gurion Airport',
      type: 'Student Job',
      experience: 'Student',
      posted: '5 days ago',
      description: 'Join our aerospace engineering team working on aircraft and space systems development.',
      tags: ['Aerospace', 'Aircraft Design', 'Space Systems']
    },
    {
      id: 5,
      title: 'R&D Engineering Intern',
      company: 'Applied Materials',
      location: 'Rehovot',
      type: 'Internship',
      experience: 'Student',
      posted: '1 week ago',
      description: 'Work on semiconductor manufacturing equipment and process development.',
      tags: ['R&D', 'Semiconductor Equipment', 'Process Development']
    },
    {
      id: 6,
      title: 'Medical Device Engineering Student',
      company: 'Art Medical',
      location: 'Tel Aviv',
      type: 'Student Job',
      experience: 'Student',
      posted: '4 days ago',
      description: 'Support the development of innovative medical devices and surgical instruments.',
      tags: ['Medical Devices', 'Product Development', 'Healthcare']
    }
  ];

  const jobSources = [
    { name: 'LinkedIn', url: 'https://il.linkedin.com/jobs/mechanical-engineering-student-jobs?keywords=mechanical%20engineer%20student&location=Israel&f_JT=I' },
    { name: 'Glassdoor', url: 'https://www.glassdoor.com/Job/israel-mechanical-engineering-student-jobs-SRCH_IL.0,6_IN119_KO7,37.htm' },
    { name: 'AllJobs', url: 'https://www.alljobs.co.il/SearchResultsGuest.aspx?page=1&position=1047&type=&source=&duration=0&exc=&region=' },
    { name: 'JobMaster', url: 'https://www.jobmaster.co.il/jobs/?q=מהנדס%20מכונות%20סטודנט&l=' },
    { name: 'Drushim', url: 'https://www.drushim.co.il/jobs/?searchterm=מהנדס%20מכונות%20סטודנט' },
    { name: 'SQLink', url: 'https://www.sqlink.com/career?search=engineering%20intern&type=internship' },
    { name: 'Intel Israel', url: 'https://jobs.intel.com/en_US/search?keywords=engineering%20intern&location=Israel' },
    { name: 'Elbit Systems', url: 'https://elbitsystemscareer.com/go/סטודנטים/9275855/' },
    { name: 'IAI (אלתא)', url: 'https://jobs.iai.co.il/jobs/?tp=משרת%20סטודנט' },
    { name: 'רפאל (Rafael)', url: 'https://career.rafael.co.il/students/' },
    { name: 'HP Careers', url: 'https://jobs.hp.com/us/students-graduates/' },
    { name: 'Applied Materials', url: 'https://jobs.appliedmaterials.com/location/israel-jobs/95/294640?q=student' },
    { name: 'Art Medical', url: 'https://artmedical.com/careers/?search=intern' },
    { name: 'Arad Technologies', url: 'https://aradtec.com/careers/?search=student' },
    { name: 'Orbit Technologies', url: 'https://orbit-cs.com/careers/?search=intern' },
    { name: 'Ness Technologies', url: 'https://www.ness.com/careers/?search=intern' },
    { name: 'Amarel', url: 'https://www.amarel.net/careers-tags/students/' }
  ];

  const israeliCities = [
    'Tel Aviv', 'Jerusalem', 'Haifa', 'Be\'er Sheva', 'Petah Tikva', 
    'Netanya', 'Ashdod', 'Rishon LeZion', 'Ramat Gan', 'Herzliya', 'Rehovot'
  ];

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
          <div className="flex space-x-2">
            <Button variant="ghost">Sign In</Button>
            <Button className="bg-israel-gradient text-white hover:opacity-90">Join Now</Button>
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
                <Button className="h-12 bg-israel-gradient text-white hover:opacity-90">
                  Search Jobs
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Job Sources Navigation */}
      <section className="py-12 px-4 bg-white">
        <div className="container mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">Search Across Top Job Sites</h3>
          <nav className="w-full bg-gray-50 rounded-lg p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {jobSources.map((source) => (
                <a
                  key={source.name}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center p-3 bg-white rounded-lg border hover:border-primary hover:shadow-md transition-all duration-200 text-sm font-medium text-tech-gray hover:text-primary group"
                >
                  <span className="truncate">{source.name}</span>
                  <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </nav>
        </div>
      </section>

      {/* Job Listings Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-3xl font-bold">Latest Opportunities</h3>
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {jobListings.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-all duration-300 border-0 bg-white group hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                        {job.title}
                      </CardTitle>
                      <div className="flex items-center space-x-2 text-tech-gray mb-2">
                        <Building className="w-4 h-4" />
                        <span className="font-medium">{job.company}</span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-tech-gray">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{job.posted}</span>
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant={job.type === 'Internship' ? 'secondary' : 'default'}
                      className={job.type === 'Internship' ? 'bg-orange-100 text-accent' : job.type === 'Student Job' ? 'bg-blue-100 text-primary' : ''}
                    >
                      {job.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-tech-gray text-sm mb-4">
                    {job.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <Button size="sm" className="bg-israel-gradient text-white hover:opacity-90">
                      Apply Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              View All Jobs
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="animate-fade-in">
              <div className="text-3xl font-bold text-primary mb-2">200+</div>
              <div className="text-tech-gray">Active Positions</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-3xl font-bold text-accent mb-2">50+</div>
              <div className="text-tech-gray">Israeli Companies</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-3xl font-bold text-primary mb-2">1,000+</div>
              <div className="text-tech-gray">Students Placed</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-israel-gradient text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-6">Start Your Engineering Career Today</h3>
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
            Join mechanical engineering students finding opportunities at Israel's leading technology companies
          </p>
          <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
            Browse All Jobs
          </Button>
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
