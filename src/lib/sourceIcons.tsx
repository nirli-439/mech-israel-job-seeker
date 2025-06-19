import {
  LucideIcon,
  ExternalLink,
  Linkedin,
  Search,
  Briefcase,
  BadgeCheck,
  Link2,
  Cpu,
  Shield,
  Plane,
  Rocket,
  MonitorUp,
  Factory,
  Stethoscope,
  Wrench,
  Building2,
  Users,
  Hammer,
} from 'lucide-react';

const normalizeName = (name: string) =>
  name.toLowerCase().replace(/[^a-z0-9\u0590-\u05ff]+/g, '');

const sourceIconMap: Record<string, LucideIcon> = {
  linkedin: Linkedin,
  glassdoor: Search,
  alljobs: Briefcase,
  jobmaster: BadgeCheck,
  drushim: Search,
  sqlink: Link2,
  intelisrael: Cpu,
  elbitsystems: Shield,
  iaiאלתא: Plane,
  רפאלrafael: Rocket,
  hpcareers: MonitorUp,
  appliedmaterials: Factory,
  artmedical: Stethoscope,
  aradtechnologies: Wrench,
  nesstechnologies: Building2,
  amarel: Users,
  tattechnologies: Hammer,
  tat: Hammer,
};

export const getSourceIcon = (name: string): LucideIcon => {
  const normalized = normalizeName(name);
  return sourceIconMap[normalized] || ExternalLink;
};
