
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Plus, Edit, Trash2 } from 'lucide-react';

interface JobSource {
  id: number;
  name: string;
  url: string;
}

interface JobSourceManagerProps {
  sources: JobSource[];
  onSourcesChange: (sources: JobSource[]) => void;
}

const JobSourceManager: React.FC<JobSourceManagerProps> = ({ sources, onSourcesChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingSources, setEditingSources] = useState<JobSource[]>(sources);
  const [newSource, setNewSource] = useState({ name: '', url: '' });

  const handleAddSource = () => {
    if (newSource.name && newSource.url) {
      const newSourceWithId = {
        id: Date.now(),
        name: newSource.name,
        url: newSource.url
      };
      setEditingSources([...editingSources, newSourceWithId]);
      setNewSource({ name: '', url: '' });
    }
  };

  const handleDeleteSource = (id: number) => {
    setEditingSources(editingSources.filter(source => source.id !== id));
  };

  const handleUpdateSource = (id: number, field: 'name' | 'url', value: string) => {
    setEditingSources(editingSources.map(source => 
      source.id === id ? { ...source, [field]: value } : source
    ));
  };

  const handleSave = () => {
    onSourcesChange(editingSources);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditingSources(sources);
    setIsEditing(false);
    setNewSource({ name: '', url: '' });
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Job Sources</CardTitle>
        <Button 
          variant="outline" 
          onClick={() => setIsEditing(!isEditing)}
          className="flex items-center gap-2"
        >
          <Edit className="w-4 h-4" />
          {isEditing ? 'Cancel' : 'Manage Sources'}
        </Button>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            {/* Add new source */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <Input
                placeholder="Source name"
                value={newSource.name}
                onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
              />
              <Input
                placeholder="Source URL"
                value={newSource.url}
                onChange={(e) => setNewSource({ ...newSource, url: e.target.value })}
              />
              <Button onClick={handleAddSource} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Source
              </Button>
            </div>

            {/* Edit existing sources */}
            <div className="space-y-2">
              {editingSources.map((source) => (
                <div key={source.id} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                  <Input
                    value={source.name}
                    onChange={(e) => handleUpdateSource(source.id, 'name', e.target.value)}
                  />
                  <Input
                    value={source.url}
                    onChange={(e) => handleUpdateSource(source.id, 'url', e.target.value)}
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteSource(source.id)}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave}>Save Changes</Button>
              <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {sources.map((source) => (
              <a
                key={source.id}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center p-3 bg-white rounded-lg border hover:border-primary hover:shadow-md transition-all duration-200 text-sm font-medium text-tech-gray hover:text-primary group"
              >
                <span className="truncate">{source.name}</span>
                <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default JobSourceManager;
