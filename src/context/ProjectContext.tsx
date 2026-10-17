import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UTILITY_OVERLAYS } from '../core/clearance/clearanceEngine';
import type { UtilityOverlay } from '../types/clearance';

export interface ProjectItem {
  id: string;
  name: string;
  code?: string;
  facilityType?: 'Distribution' | 'Transmission' | 'Joint-Use';
  operatingVoltageKv?: number;
  province?: string;
  ownerOverlayId?: string;
  customBufferM?: number;
  pinnedSnapshot?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export interface ProjectContextValue {
  projects: ProjectItem[];
  activeProject: ProjectItem;
  createProject: (projectData: Partial<ProjectItem>) => ProjectItem;
  updateActiveProject: (updates: Partial<ProjectItem>) => void;
  switchProject: (projectId: string) => void;
  deleteProject: (projectId: string) => void;
  isProjectWizardOpen: boolean;
  setIsProjectWizardOpen: (open: boolean) => void;
  provinces: string[];
  overlays: UtilityOverlay[];
}

export const CANADIAN_PROVINCES: string[] = [
  'Alberta',
  'British Columbia',
  'Manitoba',
  'New Brunswick',
  'Newfoundland and Labrador',
  'Northwest Territories',
  'Nova Scotia',
  'Nunavut',
  'Ontario',
  'Prince Edward Island',
  'Quebec',
  'Saskatchewan',
  'Yukon'
].sort((a, b) => a.localeCompare(b));

const DEFAULT_PROJECT: ProjectItem = {
  id: 'prj-default-01',
  name: 'Ontario 44kV Feeder Standard',
  code: 'LND-2026-001',
  facilityType: 'Distribution',
  operatingVoltageKv: 44.0,
  province: 'Ontario',
  ownerOverlayId: 'hydro_one',
  customBufferM: 0.3,
  pinnedSnapshot: 'C22.3-1:2020 / 60826-10 (Verified Snapshot)',
  createdAt: new Date().toISOString()
};

const ProjectContext = createContext<ProjectContextValue | null>(null);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<ProjectItem[]>(() => {
    try {
      const saved = localStorage.getItem('linedesk_ca_projects');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to load projects from localStorage:', e);
    }
    return [DEFAULT_PROJECT];
  });

  const [activeProjectId, setActiveProjectId] = useState<string>(() => {
    try {
      const savedId = localStorage.getItem('linedesk_ca_active_project_id');
      if (savedId) return savedId;
    } catch (e) {}
    return DEFAULT_PROJECT.id;
  });

  const [isProjectWizardOpen, setIsProjectWizardOpen] = useState<boolean>(false);

  // Sync projects to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('linedesk_ca_projects', JSON.stringify(projects));
    } catch (e) {}
  }, [projects]);

  // Sync active project id to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('linedesk_ca_active_project_id', activeProjectId);
    } catch (e) {}
  }, [activeProjectId]);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0] || DEFAULT_PROJECT;

  const createProject = (projectData: Partial<ProjectItem>): ProjectItem => {
    const newProject: ProjectItem = {
      id: `prj-${Date.now()}`,
      name: projectData.name || 'Untitled Project',
      createdAt: new Date().toISOString(),
      pinnedSnapshot: 'C22.3-1:2020 / 60826-10 (Verified Snapshot)',
      ...projectData
    };
    setProjects((prev) => [...prev, newProject]);
    setActiveProjectId(newProject.id);
    return newProject;
  };

  const updateActiveProject = (updates: Partial<ProjectItem>) => {
    setProjects((prev) =>
      prev.map((p) => (p.id === activeProjectId ? { ...p, ...updates } : p))
    );
  };

  const switchProject = (projectId: string) => {
    if (projects.some((p) => p.id === projectId)) {
      setActiveProjectId(projectId);
    }
  };

  const deleteProject = (projectId: string) => {
    if (projects.length <= 1) return; // Keep at least one project
    const remaining = projects.filter((p) => p.id !== projectId);
    setProjects(remaining);
    if (activeProjectId === projectId) {
      setActiveProjectId(remaining[0].id);
    }
  };

  // Sort projects alphabetically by name for dropdowns
  const sortedProjects = [...projects].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <ProjectContext.Provider
      value={{
        projects: sortedProjects,
        activeProject,
        createProject,
        updateActiveProject,
        switchProject,
        deleteProject,
        isProjectWizardOpen,
        setIsProjectWizardOpen,
        provinces: CANADIAN_PROVINCES,
        overlays: UTILITY_OVERLAYS
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject(): ProjectContextValue {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProject must be used within a ProjectProvider');
  return ctx;
}
