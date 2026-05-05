import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Clock, User } from 'lucide-react';

const priorityColors = {
  high: 'bg-red-100 text-red-800 border-red-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  low: 'bg-green-100 text-green-800 border-green-200'
};

const TaskCard = ({ task, isAdmin, currentUser, onStatusChange, onTaskClick }) => {
  const isAssignedToMe = task.assignedTo?._id === currentUser?._id;
  const isAuthorized = isAssignedToMe;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: task._id,
    data: {
      type: 'Task',
      task
    },
    disabled: !isAuthorized
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const handleCardClick = (e) => {
    // Don't open modal when interacting with status dropdown
    if (e.target.closest('select')) return;
    if (onTaskClick) {
      onTaskClick(task);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={handleCardClick}
      className={`p-5 bg-white rounded-3xl shadow-[0_4px_15px_rgba(0,0,0,0.03)] border border-slate-100 hover:border-indigo-200/50 hover:shadow-[0_15px_30px_rgba(0,0,0,0.06)] transition-all cursor-grab active:cursor-grabbing task-card task-card-${task.priority} ${isDragging ? 'opacity-0' : ''}`}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <h4 className="font-bold text-slate-900 break-words leading-snug group-hover:text-indigo-600 transition-colors">{task.title}</h4>
          <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider border rounded-lg shrink-0 ${
            task.priority === 'high' ? 'priority-high' : 
            task.priority === 'medium' ? 'priority-medium' : 
            'priority-low'
          }`}>
            {task.priority || 'Low'}
          </span>
        </div>

        {isAuthorized && (
          <div className="relative group/select">
            <select 
              className="appearance-none w-full bg-slate-50 border border-slate-100 text-[11px] font-bold text-slate-500 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all cursor-pointer hover:bg-slate-100/50"
              value={task.status}
              onChange={(e) => onStatusChange && onStatusChange(task._id, e.target.value)}
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              <option value="todo">To Do</option>
              <option value="inprogress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
               <div className="w-1.5 h-1.5 border-r-2 border-b-2 border-current rotate-45 mb-1"></div>
            </div>
          </div>
        )}
        
        {task.description && (
          <p className="text-[13px] text-slate-500 font-medium line-clamp-2 leading-relaxed">{task.description}</p>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-slate-50">
          <div className="flex items-center gap-2 text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[11px] font-bold">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</span>
          </div>
          
          <div className="relative group/avatar">
            {task.assignedTo?.avatar ? (
              <img src={task.assignedTo.avatar} alt={task.assignedTo.name} className="w-7 h-7 rounded-lg shadow-sm border border-white object-cover" />
            ) : (
              <div className="flex items-center justify-center w-7 h-7 bg-slate-100 rounded-lg border border-white text-[10px] font-bold text-slate-400" title={task.assignedTo?.name || 'Unassigned'}>
                {task.assignedTo?.name?.charAt(0).toUpperCase() || '?'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
