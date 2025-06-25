
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Check, X, Clock } from 'lucide-react';
import { getSourceIcon } from '@/lib/sourceIcons';
import { useToast } from '@/hooks/use-toast';
import SourceCodeUpdater from './SourceCodeUpdater';
import GlassIcons, { GlassIconsItem } from './reactbits/GlassIcons';

interface JobSource {
  id: string;
  name: string;
  url: string;
  lastUpdated?: string;
}

interface JobSourceManagerProps {
  sources: JobSource[];
  onSourcesChange: (sources: JobSource[]) => void;
}

const JobSourceManager: React.FC<JobSourceManagerProps> = ({ sources, onSourcesChange }) => {
  const [editingSources, setEditingSources] = useState<JobSource[]>(sources);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingUrl, setEditingUrl] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  // Sync editingSources with sources prop when it changes
  useEffect(() => {
    setEditingSources(sources);
  }, [sources]);

  const formatLastUpdated = (timestamp?: string) => {
    if (!timestamp) return 'לא עודכן';
    const date = new Date(timestamp);
    return date.toLocaleDateString('he-IL', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  const handleEditUrl = (id: string, currentUrl: string) => {
    setEditingId(id);
    setEditingUrl(currentUrl);
  };

  const handleSaveUrl = (id: string) => {
    const updatedSources = editingSources.map(source => 
      source.id === id ? { 
        ...source, 
        url: editingUrl,
        lastUpdated: new Date().toISOString()
      } : source
    );
    
    setEditingSources(updatedSources);
    onSourcesChange(updatedSources);
    setEditingId(null);
    setEditingUrl('');
    setHasChanges(true);
    
    toast({
      title: "קישור עודכן",
      description: "הקישור עודכן בהצלחה.",
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingUrl('');
  };

  const handleReorder = (items: GlassIconsItem[]) => {
    const newSources = items
      .filter(item => item.id !== 'add-source')
      .map((item) => {
        return sources.find((s) => s.id === item.id)!;
      });
    setEditingSources(newSources);
    onSourcesChange(newSources);
    setHasChanges(true);
  };

  return (
    <div>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>מקורות עבודה</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <GlassIcons
              items={[
                ...editingSources.map((source, idx) => {
                  const IconComponent = getSourceIcon(source.name);
                  const isEditing = editingId === source.id;
                  
                  return {
                    id: source.id,
                    icon: <IconComponent className="w-6 h-6 text-white" />,
                    color: ["blue", "purple", "red", "indigo", "orange", "green"][idx % 6],
                    label: source.name,
                    href: isEditing ? undefined : source.url,
                    subtitle: isEditing ? (
                      <div className="flex items-center gap-1 mt-2" onClick={(e) => e.stopPropagation()}>
                        <Input
                          value={editingUrl}
                          onChange={(e) => setEditingUrl(e.target.value)}
                          className="text-xs h-6 text-left"
                          dir="ltr"
                        />
                        <Button
                          size="sm"
                          onClick={() => handleSaveUrl(source.id)}
                          className="h-6 w-6 p-0"
                        >
                          <Check className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleCancelEdit}
                          className="h-6 w-6 p-0"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {formatLastUpdated(source.lastUpdated)}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleEditUrl(source.id, source.url);
                          }}
                          className="h-5 w-5 p-0 text-gray-400 hover:text-gray-600"
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                      </div>
                    ),
                  };
                }),
              ]}
              reorderable={true}
              onReorder={handleReorder}
              className="max-w-4xl mx-auto"
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Show code updater when there are changes */}
      {hasChanges && (
        <SourceCodeUpdater sources={editingSources} />
      )}
    </div>
  );
};

export default JobSourceManager;
