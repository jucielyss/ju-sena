
import React, { useState, useEffect } from 'react';
import { UserRole, CandidateProfile, ExperienceEntry } from '../types';

interface ProfileProps {
  role: UserRole;
  stats: {
    applications: number;
    saved: number;
  };
  onRoleSwitch: (role: UserRole) => void;
  onLogout: () => void;
}

const DEFAULT_PROFILE: CandidateProfile = {
  name: 'João da Silva',
  email: 'joao.silva@email.com',
  photo: null,
  city: 'São Paulo, SP',
  phone: '(11) 98765-4321',
  visibility: 'public',
  hasWorkedBefore: true,
  lastRole: 'Repositor',
  lastCompany: 'Mercado Central',
  yearsOfExperience: '1-2 anos',
  experiences: [
    { id: '1', role: 'Repositor', company: 'Mercado Central', period: '2022 - 2023', description: 'Organização de gôndolas e conferência de validade.' }
  ],
  skills: ['Atendimento', 'Organização', 'Pacote Office'],
  areasOfInterest: ['Varejo', 'Logística'],
  shiftAvailability: ['morning', 'afternoon'],
  workTypePreference: ['presencial'],
  resumeFileName: 'curriculo_joao.pdf',
  resumeUploadDate: '15/05/2024'
};

const Profile: React.FC<ProfileProps> = ({ role, stats, onRoleSwitch, onLogout }) => {
  const [profile, setProfile] = useState<CandidateProfile>(DEFAULT_PROFILE);
  const [toast, setToast] = useState<string | null>(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('candidate_profile');
    if (saved) {
      try {
        setProfile(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing saved profile", e);
      }
    }
  }, []);

  const saveProfile = (newProfile: CandidateProfile) => {
    setProfile(newProfile);
    localStorage.setItem('candidate_profile', JSON.stringify(newProfile));
    showToast("Perfil atualizado com sucesso");
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfile({ ...profile, photo: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  const toggleVisibility = () => {
    const newStatus = profile.visibility === 'public' ? 'anonymous' : 'public';
    const newProfile = { ...profile, visibility: newStatus as any };
    setProfile(newProfile);
    showToast(newStatus === 'public' ? "Perfil agora está público" : "Perfil agora está anônimo");
  };

  if (role === 'employer') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-slate-950">
        <div className="w-20 h-20 bg-emerald-900/20 rounded-full flex items-center justify-center mb-4 text-emerald-500">
           <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Painel da Empresa</h2>
        <p className="text-slate-400 mb-6 text-sm leading-relaxed">Você está visualizando o perfil como contratante. Para editar seu currículo, mude para o modo Candidato.</p>
        <button 
           onClick={() => onRoleSwitch('candidate')}
           className="px-6 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-white font-bold active:scale-95 transition-all mb-4 w-full"
        >
          Mudar para Candidato
        </button>
        <button onClick={onLogout} className="text-red-500 font-bold text-sm">Sair da Conta</button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto bg-slate-950 pb-32 no-scrollbar">
      {/* Toast Feedback */}
      {toast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-sky-600 text-white px-6 py-3 rounded-2xl shadow-2xl font-bold animate-in fade-in slide-in-from-top-4 duration-300">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="p-6 border-b border-slate-900 sticky top-0 bg-slate-950/80 backdrop-blur-md z-40">
        <h1 className="text-2xl font-bold text-white">Meu Perfil</h1>
        <div className="flex items-center gap-2 mt-1">
          <div className={`h-2 w-2 rounded-full ${profile.visibility === 'public' ? 'bg-emerald-500' : 'bg-slate-600'}`}></div>
          <p className="text-sm text-slate-500">
            {profile.visibility === 'public' ? 'Seu perfil está visível para empresas' : 'Seu perfil está oculto para empresas'}
          </p>
        </div>
      </div>

      <div className="p-6 space-y-8">
        {/* Quick Stats Card */}
        <div className="flex gap-4">
            <div className="flex-1 bg-slate-900 rounded-2xl py-4 text-center border border-slate-800 shadow-sm">
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider mb-1">Inscritas</p>
                <p className="text-2xl font-black text-sky-500">{stats.applications}</p>
            </div>
            <div className="flex-1 bg-slate-900 rounded-2xl py-4 text-center border border-slate-800 shadow-sm">
                <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider mb-1">Salvas</p>
                <p className="text-2xl font-black text-amber-500">{stats.saved}</p>
            </div>
        </div>

        {/* Visibility Toggle */}
        <section>
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Status de busca</p>
                <h3 className="text-white font-bold">{profile.visibility === 'public' ? 'Estou buscando emprego' : 'Não estou buscando agora'}</h3>
              </div>
              <button 
                onClick={toggleVisibility}
                className={`relative w-14 h-8 rounded-full transition-colors ${profile.visibility === 'public' ? 'bg-emerald-600' : 'bg-slate-700'}`}
              >
                <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${profile.visibility === 'public' ? 'translate-x-6' : ''}`}></div>
              </button>
            </div>
            <p className="mt-4 text-xs text-slate-500 leading-relaxed italic">
               {profile.visibility === 'public' 
                ? "✨ Quando ativado, empresas podem ver seu perfil e entrar em contato." 
                : "🔒 Seu perfil não aparecerá nas buscas das empresas enquanto estiver anônimo."}
            </p>
          </div>
        </section>

        {/* Profile Photo */}
        <section className="flex flex-col items-center">
          <div className="relative group">
            <div className="w-32 h-32 rounded-full border-4 border-slate-900 overflow-hidden bg-slate-900 shadow-xl">
              {profile.photo ? (
                <img src={profile.photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-700">
                   <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
              )}
            </div>
            <label className="absolute bottom-1 right-1 bg-sky-600 text-white p-2 rounded-full border-4 border-slate-950 cursor-pointer shadow-lg active:scale-90 transition-all">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <input type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
            </label>
          </div>
          <div className="flex gap-4 mt-4">
            <button onClick={() => setProfile({...profile, photo: null})} className="text-xs font-bold text-red-500/80 uppercase">Remover foto</button>
          </div>
        </section>

        {/* Basic Info */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            Informações Básicas
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Nome Completo</label>
              <input 
                value={profile.name} 
                onChange={e => setProfile({...profile, name: e.target.value})}
                className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3 px-4 text-white focus:ring-2 focus:ring-sky-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">E-mail (Apenas Leitura)</label>
              <input 
                readOnly
                value={profile.email} 
                className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-3 px-4 text-slate-600 outline-none cursor-not-allowed"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Cidade</label>
                <input 
                  value={profile.city} 
                  onChange={e => setProfile({...profile, city: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3 px-4 text-white focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Telefone / WhatsApp</label>
                <input 
                  value={profile.phone} 
                  onChange={e => setProfile({...profile, phone: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-800 rounded-2xl py-3 px-4 text-white focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Professional Situation */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            Situação Profissional
          </h2>
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-6">
            <div>
              <p className="text-sm text-slate-400 mb-3">Já trabalhou antes?</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setProfile({...profile, hasWorkedBefore: true})}
                  className={`flex-1 py-3 rounded-2xl font-bold transition-all border ${profile.hasWorkedBefore ? 'bg-sky-600 text-white border-sky-500 shadow-lg' : 'bg-slate-950 text-slate-500 border-slate-800'}`}
                >
                  Sim
                </button>
                <button 
                  onClick={() => setProfile({...profile, hasWorkedBefore: false})}
                  className={`flex-1 py-3 rounded-2xl font-bold transition-all border ${!profile.hasWorkedBefore ? 'bg-sky-600 text-white border-sky-500 shadow-lg' : 'bg-slate-950 text-slate-500 border-slate-800'}`}
                >
                  Não
                </button>
              </div>
            </div>

            {profile.hasWorkedBefore ? (
              <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Última Função</label>
                    <input 
                      value={profile.lastRole} 
                      onChange={e => setProfile({...profile, lastRole: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Tempo Total</label>
                    <select 
                      value={profile.yearsOfExperience} 
                      onChange={e => setProfile({...profile, yearsOfExperience: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white outline-none"
                    >
                      <option>Menos de 1 ano</option>
                      <option>1-2 anos</option>
                      <option>3-5 anos</option>
                      <option>+5 anos</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-sky-900/10 border border-sky-900/20 rounded-2xl text-center">
                 <p className="text-sky-400 text-sm font-medium">Sem problemas! Muitas empresas buscam pessoas para o primeiro emprego.</p>
              </div>
            )}
          </div>
        </section>

        {/* Experience List */}
        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Experiência Profissional
            </h2>
            <button className="text-xs font-bold text-sky-500 uppercase">+ Adicionar</button>
          </div>
          <div className="space-y-3">
            {profile.experiences.map(exp => (
              <div key={exp.id} className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex justify-between items-start">
                <div>
                  <h4 className="font-bold text-white">{exp.role}</h4>
                  <p className="text-sm text-slate-400">{exp.company} • {exp.period}</p>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2">{exp.description}</p>
                </div>
                <button className="text-slate-700 hover:text-red-500 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Skills & Availability */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            Habilidades e Preferências
          </h2>
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-6">
            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">Habilidades (Tags)</label>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map(skill => (
                  <span key={skill} className="bg-slate-800 text-slate-200 px-3 py-1.5 rounded-full text-xs font-medium border border-slate-700 flex items-center gap-2">
                    {skill}
                    <button className="text-slate-500">×</button>
                  </span>
                ))}
                <button className="bg-slate-950 text-slate-500 px-3 py-1.5 rounded-full text-xs font-bold border border-slate-800 border-dashed hover:border-sky-500 transition-colors">
                  + Nova
                </button>
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase mb-3 block">Disponibilidade de Horário</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'morning', label: 'Manhã' },
                  { id: 'afternoon', label: 'Tarde' },
                  { id: 'night', label: 'Noite' },
                  { id: 'full', label: 'Integral' }
                ].map(shift => (
                  <button 
                    key={shift.id}
                    onClick={() => {
                      const current = profile.shiftAvailability;
                      const next = current.includes(shift.id) ? current.filter(x => x !== shift.id) : [...current, shift.id];
                      setProfile({...profile, shiftAvailability: next});
                    }}
                    className={`p-3 rounded-xl text-xs font-bold transition-all border ${profile.shiftAvailability.includes(shift.id) ? 'bg-sky-600/20 text-sky-400 border-sky-500' : 'bg-slate-950 text-slate-600 border-slate-800'}`}
                  >
                    {shift.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Resume */}
        <section className="space-y-4">
          <h2 className="text-sm font-bold text-slate-600 uppercase tracking-widest flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            Currículo (PDF)
          </h2>
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5">
            {profile.resumeFileName ? (
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 bg-red-900/20 text-red-500 rounded-xl flex items-center justify-center shrink-0">
                   <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white truncate">{profile.resumeFileName}</p>
                  <p className="text-[10px] text-slate-500">Enviado em {profile.resumeUploadDate}</p>
                </div>
                <button className="text-slate-500 hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            ) : (
              <button className="w-full border-2 border-dashed border-slate-800 rounded-2xl p-8 flex flex-col items-center gap-3 text-slate-600 hover:border-sky-500 hover:text-sky-500 transition-all active:scale-[0.98]">
                 <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                 <span className="font-bold">Enviar currículo em PDF</span>
              </button>
            )}
          </div>
        </section>

        {/* Profile Preview */}
        <section className="space-y-4 pt-4 border-t border-slate-900">
           <h2 className="text-sm font-bold text-slate-600 uppercase tracking-widest">Como as empresas te veem</h2>
           <div className={`bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden ${profile.visibility === 'anonymous' ? 'opacity-50 grayscale' : ''}`}>
             <div className="flex gap-4 items-center mb-6">
                <div className="h-16 w-16 rounded-full bg-slate-800 border-2 border-slate-700 overflow-hidden">
                  {profile.visibility === 'public' && profile.photo ? <img src={profile.photo} className="w-full h-full object-cover" /> : null}
                </div>
                <div>
                   <h3 className="text-lg font-bold text-white">{profile.visibility === 'public' ? profile.name : 'Candidato Anônimo'}</h3>
                   <p className="text-xs text-slate-500">{profile.visibility === 'public' ? profile.lastRole : '---'} • {profile.city}</p>
                </div>
             </div>
             <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                   {profile.skills.slice(0, 3).map(s => <span key={s} className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700">{s}</span>)}
                </div>
                <div className="h-2 bg-slate-800 rounded-full w-full"></div>
                <div className="h-2 bg-slate-800 rounded-full w-2/3"></div>
             </div>

             {profile.visibility === 'anonymous' && (
               <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[1px] z-10">
                  <div className="text-center px-4">
                     <svg className="w-8 h-8 text-slate-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.882 9.882L5.146 5.147m13.71 13.71l-4.736-4.736M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                     <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Este perfil está anônimo</p>
                  </div>
               </div>
             )}
           </div>
        </section>

        {/* Roles & Logout */}
        <section className="pt-10 space-y-4">
          <div className="p-4 bg-emerald-950/10 border border-emerald-900/20 rounded-2xl flex justify-between items-center">
            <div>
              <span className="font-bold text-emerald-500 text-sm">Modo Empresa</span>
              <p className="text-[10px] text-slate-600 mt-1">Mude para postar vagas no Fácil Zipe.</p>
            </div>
            <button 
              onClick={() => onRoleSwitch('employer')}
              className="px-4 py-2 bg-emerald-600/20 text-emerald-400 text-xs font-bold rounded-lg border border-emerald-600/30 active:scale-95 transition-all"
            >
              Ativar
            </button>
          </div>

          <button onClick={onLogout} className="w-full py-4 text-red-500 font-bold text-sm bg-red-950/10 rounded-2xl border border-red-900/20 active:scale-95 transition-all">Sair da Conta</button>
        </section>
      </div>

      {/* Save Button Float */}
      <div className="fixed bottom-24 left-0 right-0 p-6 z-40 pointer-events-none">
        <div className="max-w-md mx-auto flex gap-4">
          <button 
            onClick={() => saveProfile(profile)}
            className="flex-1 bg-sky-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-sky-950 pointer-events-auto active:scale-[0.98] transition-all"
          >
            Salvar Alterações
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
