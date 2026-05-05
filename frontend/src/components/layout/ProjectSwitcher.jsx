import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, setSelectedProjectId } from '../../features/projects/projectSlice';
import { ChevronDown, FolderKanban, Check } from 'lucide-react';

const ProjectSwitcher = () => {
  const dispatch = useDispatch();
  const { projects, selectedProjectId, loading } = useSelector((state) => state.projects);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Fetch projects on mount if not already loaded
  useEffect(() => {
    if (projects.length === 0) {
      dispatch(fetchProjects());
    }
  }, [dispatch, projects.length]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedProject = projects.find((p) => p._id === selectedProjectId);

  const handleSelect = (projectId) => {
    dispatch(setSelectedProjectId(projectId));
    setIsOpen(false);
  };

  if (loading && projects.length === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100">
        <div className="w-5 h-5 skeleton rounded" />
        <div className="w-24 h-4 skeleton rounded" />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-sm text-slate-400 rounded-xl border border-dashed border-slate-200">
        <FolderKanban className="w-4 h-4" />
        <span>No projects available</span>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 px-3.5 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 min-w-0 max-w-[220px]"
        id="project-switcher-btn"
      >
        {selectedProject?.color && (
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0 ring-2 ring-offset-1"
            style={{ backgroundColor: selectedProject.color, ringColor: selectedProject.color + '30' }}
          />
        )}
        <span className="truncate">{selectedProject?.name || 'Select Project'}</span>
        <ChevronDown className={`w-4 h-4 shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute left-0 z-50 w-64 mt-2 origin-top-left bg-white rounded-xl shadow-xl border border-slate-100 animate-fade-in-scale">
          <div className="px-3.5 py-2.5 border-b border-slate-100">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Switch Project</p>
          </div>
          <div className="py-1 max-h-64 overflow-y-auto custom-scrollbar">
            {projects.map((project) => {
              const isSelected = project._id === selectedProjectId;
              return (
                <button
                  key={project._id}
                  onClick={() => handleSelect(project._id)}
                  className={`flex items-center w-full gap-3 px-3.5 py-2.5 text-sm transition-all duration-150 ${
                    isSelected
                      ? 'bg-indigo-50 text-indigo-700 font-medium'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: project.color || '#6366f1' }}
                  />
                  <span className="flex-1 text-left truncate">{project.name}</span>
                  {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectSwitcher;
