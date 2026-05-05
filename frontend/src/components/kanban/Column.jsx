import React from 'react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';

const Column = ({ columnId, title, tasks, isAdmin, currentUser, onStatusChange, onTaskClick }) => {
  const { setNodeRef } = useDroppable({
    id: columnId,
    data: {
      type: 'Column',
      columnId,
    }
  });

  return (
    <div className="flex flex-col flex-1 w-full min-w-[320px] max-w-[400px] bg-slate-100/50 rounded-[32px] border border-slate-200/50 p-2 h-full">
      <div className={`flex items-center justify-between px-5 py-4 mb-2 rounded-[24px] ${
        columnId === 'todo' ? 'bg-indigo-50 text-indigo-700' :
        columnId === 'inprogress' ? 'bg-amber-50 text-amber-700' :
        'bg-emerald-50 text-emerald-700'
      }`}>
        <div className="flex items-center gap-2.5">
          <div className={`w-2 h-2 rounded-full ${
            columnId === 'todo' ? 'bg-indigo-500' :
            columnId === 'inprogress' ? 'bg-amber-500' :
            'bg-emerald-500'
          }`}></div>
          <h3 className="font-bold uppercase tracking-[0.15em] text-[11px]">{title}</h3>
        </div>
        <span className="flex items-center justify-center min-w-[24px] h-6 px-1.5 text-[11px] font-black bg-white/80 border border-current/10 rounded-lg shadow-sm">
          {tasks.length}
        </span>
      </div>

      <div
        ref={setNodeRef}
        className="flex-1 overflow-y-auto min-h-[200px] px-2 py-2 space-y-4 custom-scrollbar"
      >
        <SortableContext items={tasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard key={task._id} task={task} isAdmin={isAdmin} currentUser={currentUser} onStatusChange={onStatusChange} onTaskClick={onTaskClick} />
          ))}
        </SortableContext>
        {tasks.length === 0 && (
          <div className="flex items-center justify-center h-32 border-2 border-dashed border-slate-200 rounded-3xl">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Drop Here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Column;
