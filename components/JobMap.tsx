
import React, { useState, useMemo } from 'react';
import { Job } from '../types';

interface JobMapProps {
  jobs: Job[];
  onSelectJob: (job: Job) => void;
}

interface Cluster {
  id: string;
  count: number;
  avgTop: number;
  avgLeft: number;
  jobs: Job[];
}

const JobMap: React.FC<JobMapProps> = ({ jobs, onSelectJob }) => {
  const [zoom, setZoom] = useState(1); // 1: Clusters, 2: Mid-range, 3: Individual
  
  // Simulated clustering logic based on mock positions
  // In a real map, we would use geohashing or grid-based clustering
  const clusters = useMemo(() => {
    if (zoom >= 3) return []; // No clustering at max zoom

    const clusterSize = zoom === 1 ? 25 : 12; // Grid cell size in percentage
    const grid: Record<string, Job[]> = {};

    jobs.forEach((job, idx) => {
      // Re-use the deterministic positioning logic from the previous version
      const top = 20 + (idx * 20) % 60;
      const left = 15 + (idx * 25) % 70;
      
      const gridX = Math.floor(left / clusterSize);
      const gridY = Math.floor(top / clusterSize);
      const key = `${gridX}-${gridY}`;

      if (!grid[key]) grid[key] = [];
      grid[key].push(job);
    });

    const result: Cluster[] = [];
    Object.entries(grid).forEach(([key, clusterJobs]) => {
      if (clusterJobs.length > 1) {
        let sumTop = 0;
        let sumLeft = 0;
        clusterJobs.forEach((job) => {
          const idx = jobs.indexOf(job);
          sumTop += 20 + (idx * 20) % 60;
          sumLeft += 15 + (idx * 25) % 70;
        });

        result.push({
          id: key,
          count: clusterJobs.length,
          avgTop: sumTop / clusterJobs.length,
          avgLeft: sumLeft / clusterJobs.length,
          jobs: clusterJobs
        });
      }
    });
    return result;
  }, [jobs, zoom]);

  const individualPins = useMemo(() => {
    if (zoom < 3) {
      // Only show pins that aren't in a cluster
      const clusteredJobIds = new Set(clusters.flatMap(c => c.jobs.map(j => j.id)));
      return jobs.filter(j => !clusteredJobIds.has(j.id));
    }
    return jobs;
  }, [jobs, clusters, zoom]);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 1, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 1, 1));

  const handleClusterClick = (c: Cluster) => {
    setZoom(prev => Math.min(prev + 1, 3));
  };

  return (
    <div className="h-full w-full bg-[#020617] relative overflow-hidden transition-all duration-700 ease-in-out">
      {/* Dynamic Animated Map Background */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none transition-transform duration-700 ease-out"
        style={{ transform: `scale(${1 + (zoom - 1) * 0.2})` }}
      >
        <div className="absolute top-1/4 left-0 w-full h-1 bg-slate-800 rotate-12 blur-[1px]"></div>
        <div className="absolute top-1/2 left-0 w-full h-2 bg-slate-800 -rotate-6 blur-[1px]"></div>
        <div className="absolute top-0 left-1/3 w-1 h-full bg-slate-800 rotate-2 blur-[1px]"></div>
        <div className="absolute top-0 left-2/3 w-3 h-full bg-slate-800 -rotate-12 blur-[1px]"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'radial-gradient(circle, #1e293b 1px, transparent 1px)', 
          backgroundSize: '40px 40px' 
        }}></div>
      </div>

      {/* Floating Center Marker (User Location) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-sky-500/20 scale-150"></div>
          <div className="h-5 w-5 bg-sky-500 rounded-full border-[3px] border-slate-950 shadow-[0_0_15px_rgba(14,165,233,0.5)]"></div>
        </div>
      </div>

      {/* Map Content Layer with Scale Animation */}
      <div 
        className="absolute inset-0 transition-transform duration-700 ease-in-out origin-center"
        style={{ transform: `scale(${0.8 + zoom * 0.2})` }}
      >
        {/* Render Clusters */}
        {clusters.map((cluster) => (
          <button
            key={cluster.id}
            onClick={() => handleClusterClick(cluster)}
            className="absolute -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-500 hover:scale-110 active:scale-95 animate-in fade-in zoom-in duration-300"
            style={{ top: `${cluster.avgTop}%`, left: `${cluster.avgLeft}%` }}
          >
            <div className="relative group">
              <div className="absolute -inset-2 bg-sky-600/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="h-10 w-10 bg-sky-600 rounded-full flex items-center justify-center text-white border-2 border-slate-950 shadow-[0_4px_10px_rgba(0,0,0,0.5)] font-black text-sm">
                {cluster.count}
              </div>
            </div>
          </button>
        ))}

        {/* Render Individual Job Pins */}
        {individualPins.map((job, idx) => {
          // Find original index for deterministic positioning
          const originalIdx = jobs.findIndex(j => j.id === job.id);
          const top = 20 + (originalIdx * 20) % 60;
          const left = 15 + (originalIdx * 25) % 70;
          
          return (
            <button
              key={job.id}
              onClick={() => onSelectJob(job)}
              className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500 hover:scale-110 active:scale-95 z-20 animate-in fade-in zoom-in duration-500"
              style={{ top: `${top}%`, left: `${left}%` }}
            >
              <div className="flex flex-col items-center">
                <div className="bg-slate-900 px-3 py-1.5 rounded-xl shadow-[0_4px_15px_rgba(0,0,0,0.5)] border border-slate-800 mb-1 backdrop-blur-sm bg-opacity-90">
                  <p className="text-[11px] font-bold text-slate-100 whitespace-nowrap">{job.company}</p>
                  <p className="text-[10px] text-emerald-400 font-black">{job.salary}</p>
                </div>
                <div className="relative">
                   <div className="absolute inset-0 bg-sky-600/20 blur-sm rounded-full"></div>
                   <div className="h-9 w-9 bg-sky-600 rounded-full flex items-center justify-center text-white border-2 border-slate-950 shadow-lg relative">
                    {job.companyType === 'market' && <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>}
                    {job.companyType === 'restaurant' && <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 002-2V2M7 2v20M21 15V2v0a5 5 0 00-5 5v6c0 1.1.9 2 2 2h3z" /></svg>}
                    {job.companyType === 'bakery' && <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 18V6a2 2 0 00-2-2H4a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2zM14 18h7a2 2 0 002-2v-4a2 2 0 00-2-2h-7" /></svg>}
                    {job.companyType === 'pharmacy' && <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20M2 12h20" /></svg>}
                    {job.companyType === 'shop' && <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Premium Map Controls */}
      <div className="absolute right-4 bottom-24 flex flex-col gap-3 z-40">
        <button 
          onClick={handleZoomIn}
          disabled={zoom >= 3}
          className="h-12 w-12 bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-2xl flex items-center justify-center text-slate-100 active:scale-90 disabled:opacity-30 disabled:active:scale-100 transition-all border border-slate-800"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14" /></svg>
        </button>
        <button 
          onClick={handleZoomOut}
          disabled={zoom <= 1}
          className="h-12 w-12 bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-2xl flex items-center justify-center text-slate-100 active:scale-90 disabled:opacity-30 disabled:active:scale-100 transition-all border border-slate-800"
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14" /></svg>
        </button>
        <button className="h-12 w-12 bg-sky-600 rounded-2xl shadow-[0_4px_15px_rgba(14,165,233,0.4)] flex items-center justify-center text-white active:scale-90 transition-all border border-sky-500">
           <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="3" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2" /></svg>
        </button>
      </div>

      {/* Zoom Indicator */}
      <div className="absolute left-1/2 -translate-x-1/2 bottom-24 z-40">
        <div className="bg-slate-900/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-slate-800 flex gap-1.5 items-center shadow-xl">
          <div className={`h-1.5 w-6 rounded-full transition-all duration-300 ${zoom >= 1 ? 'bg-sky-500' : 'bg-slate-800'}`}></div>
          <div className={`h-1.5 w-6 rounded-full transition-all duration-300 ${zoom >= 2 ? 'bg-sky-500' : 'bg-slate-800'}`}></div>
          <div className={`h-1.5 w-6 rounded-full transition-all duration-300 ${zoom >= 3 ? 'bg-sky-500' : 'bg-slate-800'}`}></div>
        </div>
      </div>
    </div>
  );
};

export default JobMap;
