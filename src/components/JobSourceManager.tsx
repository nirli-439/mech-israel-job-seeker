import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Plus, Edit, Trash2, Lock } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import SourceCodeUpdater from './SourceCodeUpdater';
import GlassIcons, { GlassIconsItem } from './reactbits/GlassIcons';

interface JobSource {
  id: string;
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
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  // Sync editingSources with sources prop when it changes
  useEffect(() => {
    setEditingSources(sources);
  }, [sources]);


  const handlePasswordSubmit = () => {
    if (password === 'afeka') {
      setIsAuthenticated(true);
      setIsPasswordDialogOpen(false);
      setIsEditing(true);
      setPassword('');
      toast({
        title: "גישה אושרה",
        description: "כעת ניתן לנהל מקורות עבודה.",
      });
    } else {
      toast({
        title: "גישה נדחתה",
        description: "סיסמה שגויה.",
        variant: "destructive",
      });
      setPassword('');
    }
  };

  const handleManageClick = () => {
    if (isEditing && isAuthenticated) {
      setIsEditing(false);
      setNewSource({ name: '', url: '' });
    } else if (isAuthenticated) {
      setIsEditing(true);
    } else {
      setIsPasswordDialogOpen(true);
    }
  };

  const handleAddSource = () => {
    if (newSource.name && newSource.url) {
      const newSourceWithId = {
        id: Date.now().toString(),
        name: newSource.name,
        url: newSource.url
      };
      const updatedSources = [...editingSources, newSourceWithId];
      
      setEditingSources(updatedSources);
      onSourcesChange(updatedSources);
      setNewSource({ name: '', url: '' });
      setHasChanges(true);
      toast({
        title: "מקור נוסף",
        description: "המקור החדש נוסף בהצלחה. השתמש בעדכון הקוד למטה כדי לשמור לתמיד.",
      });
    }
  };

  const handleDeleteSource = (id: string) => {
    const updatedSources = editingSources.filter(source => source.id !== id);
    
    setEditingSources(updatedSources);
    onSourcesChange(updatedSources);
    setHasChanges(true);
    toast({
      title: "מקור נמחק",
      description: "המקור נמחק בהצלחה. השתמש בעדכון הקוד למטה כדי לשמור לתמיד.",
    });
  };

  const handleUpdateSource = (id: string, field: 'name' | 'url', value: string) => {
    const updatedSources = editingSources.map(source => 
      source.id === id ? { ...source, [field]: value } : source
    );
    
    setEditingSources(updatedSources);
    onSourcesChange(updatedSources);
    setHasChanges(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "שינויים נשמרו",
      description: "מקורות העבודה עודכנו בהצלחה.",
    });
  };

  const handleCancel = () => {
    setEditingSources(sources);
    setIsEditing(false);
    setNewSource({ name: '', url: '' });
  };

  const handleReorder = (items: GlassIconsItem[]) => {
    const newSources = items.map((item) => {
      return sources.find((s) => s.id === item.id)!;
    });
    setEditingSources(newSources);
    onSourcesChange(newSources);
    setHasChanges(true);
  };

  return (
    <div>
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>מקורות עבודה</CardTitle>
          <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                onClick={handleManageClick}
                className="flex items-center gap-2"
              >
                {isEditing && isAuthenticated ? <Edit className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                {isEditing && isAuthenticated ? 'סיום עריכה' : 'ניהול מקורות'}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>הכנס סיסמה</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  type="password"
                  placeholder="הכנס סיסמה לניהול מקורות"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                  className="text-right"
                />
                <div className="flex gap-2">
                  <Button onClick={handlePasswordSubmit} className="flex-1">
                    אישור
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsPasswordDialogOpen(false);
                      setPassword('');
                    }}
                    className="flex-1"
                  >
                    ביטול
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {isEditing && isAuthenticated ? (
            <div className="space-y-4">
              {/* Add new source */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Input
                  placeholder="שם המקור"
                  value={newSource.name}
                  onChange={(e) => setNewSource({ ...newSource, name: e.target.value })}
                  className="text-right"
                />
                <Input
                  placeholder="קישור למקור"
                  value={newSource.url}
                  onChange={(e) => setNewSource({ ...newSource, url: e.target.value })}
                  className="text-left"
                />
                <Button onClick={handleAddSource} className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  הוסף מקור
                </Button>
              </div>

              {/* Edit existing sources */}
              <div className="space-y-2">
                {editingSources.map((source) => (
                  <div key={source.id} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
                    <Input
                      value={source.name}
                      onChange={(e) => handleUpdateSource(source.id, 'name', e.target.value)}
                      className="text-right"
                    />
                    <Input
                      value={source.url}
                      onChange={(e) => handleUpdateSource(source.id, 'url', e.target.value)}
                      className="text-left"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteSource(source.id)}
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      מחק
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSave}>סיום עריכה</Button>
                <Button variant="outline" onClick={handleCancel}>ביטול</Button>
              </div>
            </div>
          ) : (
            <GlassIcons
              items={sources.map((source, idx) => ({
                id: source.id,
                icon: <ExternalLink className="w-4 h-4" />,
                color: ["blue", "purple", "red", "indigo", "orange", "green"][
                  idx % 6
                ],
                label: source.name,
                href: source.url,
              }))}
              reorderable
              onReorder={handleReorder}
            />
          )}
        </CardContent>
      </Card>
      
      {/* Show code updater when there are changes and user is authenticated */}
      {isAuthenticated && hasChanges && (
        <SourceCodeUpdater sources={editingSources} />
      )}
    </div>
  );
};

export default JobSourceManager;
