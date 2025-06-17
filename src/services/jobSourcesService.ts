
// This service shows how to implement global source management with a backend
// Currently commented out since this is a static app without Supabase integration

interface JobSource {
  id: number;
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

// For backend-enabled apps (when Supabase is connected)
/*
export const saveSourcesGlobally = async (sources: JobSource[]) => {
  try {
    // This would save to Supabase database
    const { data, error } = await supabase
      .from('job_sources')
      .upsert(sources.map(source => ({
        id: source.id,
        name: source.name,
        url: source.url,
        updated_at: new Date().toISOString()
      })));
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving sources globally:', error);
    throw error;
  }
};

export const loadSourcesGlobally = async (): Promise<JobSource[]> => {
  try {
    // This would load from Supabase database
    const { data, error } = await supabase
      .from('job_sources')
      .select('*')
      .order('id');
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error loading sources globally:', error);
    throw error;
  }
};
*/

export default {
  updateSourcesInCode
};
