
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Building, Clock, ExternalLink } from 'lucide-react';

interface JobCardProps {
  job: {
    id: number;
    title: string;
    company: string;
    location: string;
    type: string;
    posted: string;
    description: string;
    tags: string[];
    applyUrl?: string;
  };
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  const handleApply = () => {
    if (job.applyUrl) {
      window.open(job.applyUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Default search for the job on LinkedIn
      const searchQuery = encodeURIComponent(`${job.title} ${job.company} Israel`);
      const linkedinUrl = `https://il.linkedin.com/jobs/search?keywords=${searchQuery}&location=Israel`;
      window.open(linkedinUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 bg-white group hover:-translate-y-1">
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
            className={job.type === 'Internship' ? 'bg-orange-100 text-accent' : 'bg-blue-100 text-primary'}
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
          <Button 
            size="sm" 
            className="bg-israel-gradient text-white hover:opacity-90 flex items-center gap-2"
            onClick={handleApply}
          >
            Apply Now
            <ExternalLink className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
