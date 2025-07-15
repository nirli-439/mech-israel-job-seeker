
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Code, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface JobSource {
  id: string;
  name: string;
  url: string;
}

interface SourceCodeUpdaterProps {
  sources: JobSource[];
}

const SourceCodeUpdater: React.FC<SourceCodeUpdaterProps> = ({ sources }) => {
  const { toast } = useToast();

  const generateSourceCode = () => {
    const sourcesCode = sources.map((source, index) =>
      `    {\n      id: '${source.id}',\n      name: '${source.name.replace(/'/g, "\\'")}',\n      url: '${source.url.replace(/'/g, "\\'")}'${index === sources.length - 1 ? '' : ','}\n    }`
    ).join('');
    
    return `const defaultSources = [\n${sourcesCode}\n  ];`;
  };

  const copyToClipboard = async () => {
    const code = generateSourceCode();
    try {
      await navigator.clipboard.writeText(code);
      toast({
        title: "קוד הועתק",
        description: "הקוד הועתק ללוח. עכשיו החלף את defaultSources בקובץ Index.tsx",
      });
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      toast({
        title: "שגיאה בהעתקה",
        description: "לא ניתן להעתיק ללוח. בדוק את הקונסול לקוד.",
        variant: "destructive",
      });
      console.log('Copy this code to replace defaultSources in Index.tsx:');
      console.log(code);
    }
  };

  return null;
};

export default SourceCodeUpdater;
