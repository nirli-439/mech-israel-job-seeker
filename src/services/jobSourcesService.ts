// This service shows how to implement global source management with a backend
// Currently commented out since this is a static app without Supabase integration

import { supabase } from './supabaseClient';

export interface JobSource {
  id: string;
  name: string;
  url: string;
  lastUpdated?: string; // ISO timestamp string
}

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const getJobSources = async (): Promise<JobSource[]> => {
  const res = await fetch(`${API_URL}/job-sources`);
  if (!res.ok) throw new Error('Failed to fetch job sources');
  return res.json();
};

export const saveJobSources = async (sources: JobSource[], password: string): Promise<void> => {
  const res = await fetch(`${API_URL}/job-sources`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password, sources })
  });
  if (!res.ok) throw new Error('Failed to save job sources');
};

// For static apps - Development workflow
export const updateSourcesInCode = (sources: JobSource[]) => {
  const sourcesCode = sources.map((source, index) => 
    `    {\n      id: ${source.id},\n      name: '${source.name.replace(/'/g, "\\'")}',\n      url: '${source.url.replace(/'/g, "\\'")}',\n      lastUpdated: '${source.lastUpdated || new Date().toISOString()}'${index === sources.length - 1 ? '' : ','}\n    }`
  ).join('');
  
  const fullCode = `const defaultSources = [\n${sourcesCode}\n  ];`;
  
  console.log('%c🔧 TO MAKE CHANGES PERMANENT:', 'color: #ff6b35; font-weight: bold; font-size: 14px;');
  console.log('%cReplace the defaultSources array in src/pages/Index.tsx with:', 'color: #666;');
  console.log('%c' + fullCode, 'background: #f5f5f5; padding: 10px; border-radius: 4px; font-family: monospace;');
  
  return fullCode;
};

// Backend helpers using Supabase
export const saveSourcesGlobally = async (sources: JobSource[]) => {
  if (!supabase) {
    console.warn('Supabase credentials not provided. Skipping global save.');
    return;
  }
  try {
    const { error } = await supabase
      .from('job_sources')
      .upsert(
        sources.map((source) => ({
          id: source.id,
          name: source.name,
          url: source.url,
          last_updated: source.lastUpdated || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }))
      );
    if (error) throw error;
  } catch (error) {
    console.error('Error saving sources globally:', error);
    throw error;
  }
};

export const loadSourcesGlobally = async (): Promise<JobSource[]> => {
  if (!supabase) {
    console.warn('Supabase credentials not provided. Skipping global load.');
    return [];
  }
  try {
    const { data, error } = await supabase
      .from('job_sources')
      .select('*')
      .order('id');
    if (error) throw error;
    return (data?.map(item => ({
      id: item.id,
      name: item.name,
      url: item.url,
      lastUpdated: item.last_updated
    })) as JobSource[]) || [];
  } catch (error) {
    console.error('Error loading sources globally:', error);
    throw error;
  }
};

export default {
  updateSourcesInCode,
  saveSourcesGlobally,
  loadSourcesGlobally,
};
