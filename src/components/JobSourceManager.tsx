import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getSourceIcon } from '@/lib/sourceIcons';
import { ExternalLink } from 'lucide-react';

interface JobSource {
  id: string;
  name: string;
  url: string;
  lastUpdated?: string;
}

interface JobSourceManagerProps {
  sources: JobSource[];
  onSourcesChange?: (sources: JobSource[]) => void;
  readOnly?: boolean;
}

const JobSourceManager: React.FC<JobSourceManagerProps> = ({ sources, onSourcesChange, readOnly }) => {
  const [rows, setRows] = useState<JobSource[]>(sources);

  useEffect(() => {
    setRows(sources);
  }, [sources]);

  // Card-based display for readOnly (frontend)
  if (readOnly) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {sources.map((source) => {
          const IconComponent = getSourceIcon(source.name);
          const urlDomain = (() => {
            try {
              return new URL(source.url).hostname.replace('www.', '');
            } catch {
              return source.url;
            }
          })();
          return (
            <Card key={source.id} className="flex flex-col h-full p-2">
              <CardHeader className="flex flex-row items-center gap-2 pb-2 pt-2 px-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-600">
                  <IconComponent className="w-5 h-5 text-white" />
                </span>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <CardTitle
                    className="text-base font-semibold flex-1 min-w-0 break-words leading-snug line-clamp-2 mb-1"
                    style={{ wordBreak: 'break-word', whiteSpace: 'normal', maxHeight: '2.7em', overflow: 'hidden' }}
                    title={source.name}
                  >
                    {source.name}
                  </CardTitle>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-1 rounded bg-blue-100 text-blue-700 text-xs font-medium hover:bg-blue-200 transition whitespace-nowrap"
                    title={source.url}
                  >
                    {urlDomain}
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-end px-2 pb-2 pt-0">
                <div className="text-xs text-gray-500 mt-1">עודכן: {source.lastUpdated ? new Date(source.lastUpdated).toLocaleDateString('he-IL') : '—'}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }

  // Excel-like table for admin (editable)
  const handleChange = (idx: number, field: keyof JobSource, value: string) => {
    const updated = rows.map((row, i) =>
      i === idx ? { ...row, [field]: value, lastUpdated: new Date().toISOString() } : row
    );
    setRows(updated);
    onSourcesChange?.(updated);
  };

  const handleAdd = () => {
    setRows([
      { id: Date.now().toString(), name: '', url: '', lastUpdated: new Date().toISOString() },
      ...rows,
    ]);
  };

  const handleDelete = (idx: number) => {
    const updated = rows.filter((_, i) => i !== idx);
    setRows(updated);
    onSourcesChange?.(updated);
  };

  return (
    <div>
      <Button onClick={handleAdd} className="mb-2">הוסף שורה</Button>
      <table className="w-full border mt-2">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">שם</th>
            <th className="p-2 border">קישור</th>
            <th className="p-2 border">עדכון אחרון</th>
            <th className="p-2 border">מחק</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, idx) => (
            <tr key={row.id}>
              <td className="p-2 border">
                <Input
                  value={row.name}
                  onChange={e => handleChange(idx, 'name', e.target.value)}
                  placeholder="שם מקור"
                />
              </td>
              <td className="p-2 border">
                <Input
                  value={row.url}
                  onChange={e => handleChange(idx, 'url', e.target.value)}
                  placeholder="קישור"
                  dir="ltr"
                />
              </td>
              <td className="p-2 border text-xs text-gray-500">{row.lastUpdated ? new Date(row.lastUpdated).toLocaleString('he-IL') : ''}</td>
              <td className="p-2 border text-center">
                <Button variant="destructive" size="sm" onClick={() => handleDelete(idx)}>מחק</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default JobSourceManager;
