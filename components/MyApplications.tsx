
import React, { useState } from 'react';
import { Application, Job } from '../types';

interface MyApplicationsProps {
  applications: Application[];
  savedJobIds: string[];
  jobs: Job[];
  onSelectJob: (job: Job) => void;
}

const MyApplications: React.FC<MyApplicationsProps> = ({ applications, savedJobIds, jobs, onSelectJob }) => {
  const [activeTab, setActiveTab] = useState<'applied' | 'saved'>('applied');

  const appliedJobs = applications.map(app => jobs.find(j => j.id === app.jobId)).filter(Boolean) as Job[];
  const savedJobs = jobs.filter(j => savedJobIds.includes(j.id));

  const displayJobs = activeTab === 'applied' ? appliedJobs : savedJobs;

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 p-6 pb-24 no-scrollbar">
      <h1 className="text-2xl font-bold text-white mb-6">Minhas Vagas</h1>
      
      <div className="flex bg-slate-900 rounded-2xl p-1 mb-6 border border-slate-800">
        <button 
          onClick={() => setActiveTab('applied')}
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'applied' ? 'bg-sky-600 text-white' : 'text-slate-500'}`}
        >
          Inscritas ({appliedJobs.length})
        </button>
        <button 
          onClick={() => setActiveTab('saved')}
          className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${activeTab === 'saved' ? 'bg-sky-600 text-white' : 'text-slate-500'}`}
        >
          Salvas ({savedJobs.length})
        </button>
      </div>

      <div className="space-y-4">
        {displayJobs.map(job => (
          <button
            key={job.id}
            onClick={() => onSelectJob(job)}
            className="w-full text-left bg-slate-900 p-4 rounded-2xl border border-slate-800 flex gap-4 active:bg-slate-800 transition-all"
          >
            <div className="h-12 w-12 bg-sky-900/20 rounded-xl flex items-center justify-center text-sky-500 shrink-0">
               {/* Icon logic similar to JobList */}
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white truncate">{job.title}</h3>
              <p className="text-sm text-slate-500 truncate">{job.company}</p>
              {activeTab === 'applied' && (
                <div className="mt-2 inline-flex items-center gap-1.5 bg-sky-950/40 text-sky-400 text-[10px] font-bold px-2 py-0.5 rounded">
                  <div className="h-1.5 w-1.5 rounded-full bg-sky-500 animate-pulse"></div>
                  Em análise
                </div>
              )}
            </div>
          </button>
        ))}

        {displayJobs.length === 0 && (
          <div className="text-center py-20 px-10">
            <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-800">
               <svg className="w-10 h-10 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
            </div>
            <p className="text-slate-500 font-medium">Nenhuma vaga por aqui...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyApplications;
