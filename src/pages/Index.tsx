
import { useState } from 'react';
import { Search, MapPin, Briefcase, Users, Building, ChevronDown, Star, Clock, Filter } from 'lucide-react';
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
      experience: 'Entry Level',
      salary: '₪8,000-12,000',
      posted: '2 days ago',
      description: 'Join our R&D team working on cutting-edge defense technologies. Perfect for mechanical engineering students.',
      tags: ['CAD', 'SolidWorks', 'R&D', 'Defense'],
      rating: 4.8,
      employees: '5,000+'
    },
    {
      id: 2,
      title: 'Product Development Engineer',
      company: 'Teva Pharmaceuticals',
      location: 'Petah Tikva',
      type: 'Full-time',
      experience: 'Entry Level',
      salary: '₪15,000-20,000',
      posted: '1 week ago',
      description: 'Design and develop medical devices and pharmaceutical manufacturing equipment.',
      tags: ['Medical Devices', 'Manufacturing', 'FDA', 'Quality'],
      rating: 4.6,
      employees: '10,000+'
    },
    {
      id: 3,
      title: 'Automotive Engineer Intern',
      company: 'Mobileye',
      location: 'Jerusalem',
      type: 'Internship',
      experience: 'Student',
      salary: '₪9,000-13,000',
      posted: '3 days ago',
      description: 'Work on autonomous vehicle technologies and automotive systems integration.',
      tags: ['Automotive', 'AI', 'Sensors', 'Testing'],
      rating: 4.9,
      employees: '1,000+'
    }
  ];

  const israeliCities = [
    'Tel Aviv', 'Jerusalem', 'Haifa', 'Be\'er Sheva', 'Petah Tikva', 
    'Netanya', 'Ashdod', 'Rishon LeZion', 'Ramat Gan', 'Herzliya'
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
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-tech-gray hover:text-primary transition-colors">Jobs</a>
            <a href="#" className="text-tech-gray hover:text-primary transition-colors">Companies</a>
            <a href="#" className="text-tech-gray hover:text-primary transition-colors">Resources</a>
          </nav>
          <div className="flex space-x-2">
            <Button variant="ghost">Sign In</Button>
            <Button className="bg-israel-gradient text-white hover:opacity-90">Join Now</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6 animate-fade-in">
            Launch Your{' '}
            <span className="bg-israel-gradient bg-clip-text text-transparent">
              Mechanical Engineering
            </span>{' '}
            Career in Israel
          </h2>
          <p className="text-xl text-tech-gray mb-12 max-w-2xl mx-auto animate-slide-up">
            Connect with top Israeli companies seeking talented mechanical engineering students and fresh graduates. 
            From defense tech to automotive innovation.
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
                      <SelectValue placeholder="Experience" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="intern">Internship</SelectItem>
                    <SelectItem value="graduate">New Graduate</SelectItem>
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

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div className="animate-fade-in">
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-tech-gray">Active Jobs</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-3xl font-bold text-accent mb-2">150+</div>
              <div className="text-tech-gray">Partner Companies</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-3xl font-bold text-primary mb-2">2,500+</div>
              <div className="text-tech-gray">Students Hired</div>
            </div>
            <div className="animate-fade-in">
              <div className="text-3xl font-bold text-accent mb-2">95%</div>
              <div className="text-tech-gray">Success Rate</div>
            </div>
          </div>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {jobListings.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-all duration-300 border-0 bg-white group hover:-translate-y-1">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg mb-2 group-hover:text-primary transition-colors">
                        {job.title}
                      </CardTitle>
                      <div className="flex items-center space-x-2 text-tech-gray mb-2">
                        <Building className="w-4 h-4" />
                        <span className="font-medium">{job.company}</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{job.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-tech-gray">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>{job.employees}</span>
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant={job.type === 'Internship' ? 'secondary' : 'default'}
                      className={job.type === 'Internship' ? 'bg-orange-100 text-accent' : ''}
                    >
                      {job.type}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-tech-gray text-sm mb-4 line-clamp-2">
                    {job.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-primary">{job.salary}</div>
                      <div className="text-xs text-tech-gray flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{job.posted}</span>
                      </div>
                    </div>
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

      {/* CTA Section */}
      <section className="py-20 bg-israel-gradient text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-4xl font-bold mb-6">Ready to Start Your Career?</h3>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of mechanical engineering students who found their dream jobs through MechJobs IL
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
              Create Your Profile
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
              Browse Companies
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-israel-gradient rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <h4 className="text-xl font-bold">MechJobs IL</h4>
              </div>
              <p className="text-gray-400">
                The leading job platform for mechanical engineering students in Israel.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">For Students</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Find Jobs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Career Resources</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Resume Builder</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">For Companies</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Post Jobs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Find Talent</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 MechJobs IL. Made with ❤️ for Israeli engineering students.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
