
// Basic helpers for managing job sources locally. The original version of this
// file included Supabase integration which has been removed.

export interface JobSource {
  id: string;
  name: string;
  url: string;
}

// For static apps - Development workflow
export const updateSourcesInCode = (sources: JobSource[]) => {
  const sourcesCode = sources.map((source, index) => 
    `    {\n      id: ${source.id},\n      name: '${source.name.replace(/'/g, "\\'")}',\n      url: '${source.url.replace(/'/g, "\\'")}'${index === sources.length - 1 ? '' : ','}\n    }`
  ).join('');
  
  const fullCode = `const defaultSources = [\n${sourcesCode}\n  ];`;
  
  console.log('%c🔧 TO MAKE CHANGES PERMANENT:', 'color: #ff6b35; font-weight: bold; font-size: 14px;');
  console.log('%cReplace the defaultSources array in src/pages/Index.tsx with:', 'color: #666;');
  console.log('%c' + fullCode, 'background: #f5f5f5; padding: 10px; border-radius: 4px; font-family: monospace;');
  
  return fullCode;
};

// Previously these functions saved and loaded sources using Supabase. They are
// now simple wrappers around browser `localStorage` so the data persists only
// for the current user.
export const saveSourcesGlobally = async (sources: JobSource[]) => {
  localStorage.setItem('jobSources', JSON.stringify(sources));
};

export const loadSourcesGlobally = async (): Promise<JobSource[]> => {
  const stored = localStorage.getItem('jobSources');
  return stored ? JSON.parse(stored) : [];
};

export default {
  updateSourcesInCode,
  saveSourcesGlobally,
  loadSourcesGlobally,
};
