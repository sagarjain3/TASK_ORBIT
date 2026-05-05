import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProjects, createProjectThunk } from '../features/projects/projectSlice';
import CreateProjectModal from '../components/CreateProjectModal';
import { Plus, Folder, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Projects = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { projects, loading } = useSelector((state) => state.projects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleCreateProject = async (formData) => {
    setCreateLoading(true);
    try {
      const resultAction = await dispatch(createProjectThunk(formData));
      if (createProjectThunk.fulfilled.match(resultAction)) {
        setIsModalOpen(false);
      }
    } finally {
      setCreateLoading(false);
    }
  };

  if (loading && projects.length === 0) {
    return (
      <div className="p-6 lg:p-8 bg-gray-50 h-full">
        <div className="h-8 w-48 bg-gray-200 animate-pulse rounded mb-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-40 bg-gray-200 animate-pulse rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12 bg-transparent min-h-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 animate-fade-in">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-1 bg-indigo-500 rounded-full"></span>
            <span className="text-[11px] font-bold text-indigo-500 uppercase tracking-[0.2em]">Workspace</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Projects</h1>
          <p className="text-slate-500 mt-2 font-medium">Manage and organize your team's work</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-6 md:mt-0 flex items-center gap-2 px-6 py-3.5 font-bold text-white transition-all duration-300 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl shadow-[0_10px_20px_rgba(79,70,229,0.3)] hover:shadow-[0_15px_30px_rgba(79,70,229,0.4)] hover:-translate-y-1 active:scale-95 group"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
          Create Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 text-center glass-card rounded-[40px] animate-fade-in delay-200">
          <div className="flex items-center justify-center w-24 h-24 mb-8 bg-indigo-500/10 text-indigo-500 rounded-[32px] animate-float-orb">
            <Folder className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">No projects yet</h3>
          <p className="mt-3 text-slate-500 max-w-sm font-medium">Elevate your workflow by creating your first project space.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-8 px-8 py-4 font-bold text-indigo-600 bg-white border border-indigo-100 rounded-2xl hover:bg-indigo-50 transition-all shadow-sm hover:shadow-md"
          >
            Get Started
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={project._id}
              onClick={() => navigate(`/projects/${project._id}`)}
              className="p-8 bg-white rounded-[32px] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100/80 hover:border-indigo-200/50 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06)] transition-all duration-500 cursor-pointer group animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-8">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500"
                  style={{
                    backgroundColor: project.color || '#6366f1',
                    boxShadow: `0 10px 20px ${project.color}40`
                  }}
                >
                  <Folder className="w-7 h-7" />
                </div>
                <div className="flex -space-x-2">
                  {/* Team avatars could go here */}
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                    +3
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">{project.name}</h3>
              <p className="mt-3 text-sm text-slate-500 font-medium line-clamp-2 min-h-[40px] leading-relaxed">
                {project.description || 'Seamlessly manage your project tasks and milestones.'}
              </p>

              <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Last Activity</span>
                  <span className="text-xs font-semibold text-slate-600 mt-1">{new Date(project.updatedAt || project.createdAt).toLocaleDateString()}</span>
                </div>
                <span className="flex items-center gap-2 text-indigo-600 font-bold text-sm translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
                  Open <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateProject}
        loading={createLoading}
      />
    </div>
  );
};

export default Projects;
