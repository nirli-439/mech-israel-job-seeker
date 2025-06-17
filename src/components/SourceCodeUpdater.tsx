
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

  return (
    <Card className="mt-4 border-orange-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-700">
          <Code className="w-5 h-5" />
          עדכון קבוע של המקורות
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            כדי לשמור את השינויים לתמיד עבור כל המשתמשים, העתק את הקוד הזה והחלף את defaultSources בקובץ Index.tsx:
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg border font-mono text-sm overflow-x-auto">
            <pre>{generateSourceCode()}</pre>
          </div>
          
          <Button onClick={copyToClipboard} className="flex items-center gap-2">
            <Copy className="w-4 h-4" />
            העתק קוד
          </Button>
          
          <div className="text-xs text-gray-500 bg-blue-50 p-3 rounded">
            <strong>הוראות:</strong>
            <ol className="mt-2 space-y-1 pr-4">
              <li>1. לחץ על "העתק קוד"</li>
              <li>2. פתח את הקובץ src/pages/Index.tsx</li>
              <li>3. מצא את השורה "const defaultSources = ["</li>
              <li>4. החלף את כל מערך defaultSources בקוד שהעתקת</li>
              <li>5. שמור את הקובץ</li>
            </ol>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SourceCodeUpdater;
