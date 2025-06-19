import { LucideIcon, ExternalLink, Linkedin, Search, Briefcase, BadgeCheck, Link2, Cpu, Shield, Plane, Rocket, MonitorUp, Factory, Stethoscope, Wrench, Building2, Users, Hammer } from 'lucide-react';

const sourceIconMap: Record<string, LucideIcon> = {
  Glassdoor: Search,
  JobMaster: BadgeCheck,
  Drushim: Search,
  SQLink: Link2,
  'Intel Israel': Cpu,
  'Elbit Systems': Shield,
  'IAI (אלתא)': Plane,
  'רפאל (Rafael)': Rocket,
  'HP Careers': MonitorUp,
  'Applied Materials': Factory,
  'Art Medical': Stethoscope,
  'Arad Technologies': Wrench,
  'Ness Technologies': Building2,
  Amarel: Users,
  'TAT Technologies': Hammer,
};

export const getSourceIcon = (name: string): LucideIcon => {
  return sourceIconMap[name] || ExternalLink;
};
