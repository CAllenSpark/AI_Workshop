import { useState, useCallback, useRef } from 'react';
import type { Project } from '../types';
import {
  listProjects,
  createProject,
  deleteProject,
  importProject,
  DEFAULT_PROJECT_ID,
} from '../data/project-manager';
import './ProjectSelector.css';

interface Props {
  activeProject: Project;
  onProjectChange: (projectId: string) => void;
}

type View = 'list' | 'create' | 'import';

export default function ProjectSelector({ activeProject, onProjectChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<View>('list');
  const [projects, setProjects] = useState<Project[]>(listProjects);

  // Create form state
  const [newName, setNewName] = useState('');
  const [newSetting, setNewSetting] = useState('');
  const [newGenre, setNewGenre] = useState('');
  const [newDesc, setNewDesc] = useState('');

  // Import state
  const [importName, setImportName] = useState('');
  const [importSetting, setImportSetting] = useState('');
  const [importGenre, setImportGenre] = useState('');
  const [importError, setImportError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const refreshProjects = useCallback(() => setProjects(listProjects()), []);

  const handleSelect = useCallback((id: string) => {
    onProjectChange(id);
    setIsOpen(false);
    setView('list');
  }, [onProjectChange]);

  const handleCreate = useCallback(() => {
    if (!newName.trim()) return;
    const project = createProject(
      newName.trim(),
      newDesc.trim() || `Creative project set in ${newSetting.trim() || 'an unnamed world'}`,
      newSetting.trim() || 'Unknown',
      newGenre.trim() || undefined,
    );
    refreshProjects();
    setNewName('');
    setNewSetting('');
    setNewGenre('');
    setNewDesc('');
    setView('list');
    onProjectChange(project.id);
    setIsOpen(false);
  }, [newName, newSetting, newGenre, newDesc, onProjectChange, refreshProjects]);

  const handleDelete = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (id === DEFAULT_PROJECT_ID) return;
    deleteProject(id);
    refreshProjects();
    if (activeProject.id === id) {
      onProjectChange(DEFAULT_PROJECT_ID);
    }
  }, [activeProject.id, onProjectChange, refreshProjects]);

  const handleImportFile = useCallback(() => {
    const file = fileRef.current?.files?.[0];
    if (!file) return;
    setImportError('');

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        const project = importProject(json, {
          name: importName.trim() || file.name.replace(/\.json$/, ''),
          setting: importSetting.trim() || undefined,
          genre: importGenre.trim() || undefined,
        });
        refreshProjects();
        setView('list');
        onProjectChange(project.id);
        setIsOpen(false);
        setImportName('');
        setImportSetting('');
        setImportGenre('');
      } catch (err) {
        setImportError(`Import failed: ${err instanceof Error ? err.message : 'Invalid JSON'}`);
      }
    };
    reader.readAsText(file);
  }, [importName, importSetting, importGenre, onProjectChange, refreshProjects]);

  return (
    <div className="project-selector">
      <button
        className="project-selector-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="project-selector-name">{activeProject.name}</span>
        <span className="project-selector-setting">{activeProject.setting}</span>
        <span className="project-selector-chevron">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="project-dropdown" role="dialog" aria-label="Project selector">
          {view === 'list' && (
            <>
              <div className="project-dropdown-header">
                <span className="project-dropdown-title">Projects</span>
                <div className="project-dropdown-actions">
                  <button className="project-action-btn" onClick={() => setView('create')}>+ New</button>
                  <button className="project-action-btn" onClick={() => setView('import')}>Import</button>
                </div>
              </div>
              <div className="project-list">
                {projects.map((p) => (
                  <button
                    key={p.id}
                    className={`project-item ${p.id === activeProject.id ? 'active' : ''}`}
                    onClick={() => handleSelect(p.id)}
                  >
                    <div className="project-item-info">
                      <span className="project-item-name">{p.name}</span>
                      <span className="project-item-setting">{p.setting}</span>
                      {p.genre && <span className="project-item-genre">{p.genre}</span>}
                    </div>
                    {p.id !== DEFAULT_PROJECT_ID && (
                      <button
                        className="project-delete-btn"
                        onClick={(e) => handleDelete(p.id, e)}
                        aria-label={`Delete ${p.name}`}
                        title="Delete project"
                      >
                        ✕
                      </button>
                    )}
                  </button>
                ))}
              </div>
            </>
          )}

          {view === 'create' && (
            <div className="project-form">
              <div className="project-dropdown-header">
                <span className="project-dropdown-title">New Project</span>
                <button className="project-action-btn" onClick={() => setView('list')}>← Back</button>
              </div>
              <div className="project-form-fields">
                <label className="project-field">
                  <span className="project-field-label">Project Name *</span>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g., Room 33"
                    autoFocus
                  />
                </label>
                <label className="project-field">
                  <span className="project-field-label">Setting</span>
                  <input
                    type="text"
                    value={newSetting}
                    onChange={(e) => setNewSetting(e.target.value)}
                    placeholder="e.g., Vashon Island, WA"
                  />
                </label>
                <label className="project-field">
                  <span className="project-field-label">Genre</span>
                  <input
                    type="text"
                    value={newGenre}
                    onChange={(e) => setNewGenre(e.target.value)}
                    placeholder="e.g., mystery, dark fantasy"
                  />
                </label>
                <label className="project-field">
                  <span className="project-field-label">Description</span>
                  <textarea
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="Brief description of the project..."
                    rows={2}
                  />
                </label>
                <button
                  className="project-submit-btn"
                  onClick={handleCreate}
                  disabled={!newName.trim()}
                >
                  Create Project
                </button>
              </div>
            </div>
          )}

          {view === 'import' && (
            <div className="project-form">
              <div className="project-dropdown-header">
                <span className="project-dropdown-title">Import Project</span>
                <button className="project-action-btn" onClick={() => setView('list')}>← Back</button>
              </div>
              <div className="project-form-fields">
                <label className="project-field">
                  <span className="project-field-label">JSON File *</span>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".json"
                    className="project-file-input"
                  />
                </label>
                <label className="project-field">
                  <span className="project-field-label">Project Name (optional)</span>
                  <input
                    type="text"
                    value={importName}
                    onChange={(e) => setImportName(e.target.value)}
                    placeholder="Override name from file"
                  />
                </label>
                <label className="project-field">
                  <span className="project-field-label">Setting (optional)</span>
                  <input
                    type="text"
                    value={importSetting}
                    onChange={(e) => setImportSetting(e.target.value)}
                    placeholder="e.g., Medieval England"
                  />
                </label>
                <label className="project-field">
                  <span className="project-field-label">Genre (optional)</span>
                  <input
                    type="text"
                    value={importGenre}
                    onChange={(e) => setImportGenre(e.target.value)}
                    placeholder="e.g., Arthurian fantasy"
                  />
                </label>
                {importError && <div className="project-import-error">{importError}</div>}
                <button
                  className="project-submit-btn"
                  onClick={handleImportFile}
                >
                  Import JSON
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {isOpen && <div className="project-overlay" onClick={() => { setIsOpen(false); setView('list'); }} />}
    </div>
  );
}
