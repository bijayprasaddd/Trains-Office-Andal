import React, { useState, useEffect } from 'react';
import {
  AppDatabase, UserSession, FileAttachment, MixLoadEntry,
  CYMUnloadingEntry, TranshipmentEntry, PCMLDiversionEntry, SickRepairEntry
} from './types/railway';
import {
  getAppDatabase, saveAppDatabase, getCurrentSession, saveSession, clearSession
} from './services/storage';
import { Navbar } from './components/Navbar';
import { LoginPage } from './components/LoginPage';
import { MainSelectionDashboard } from './components/MainSelectionDashboard';
import { FileViewerModal } from './components/FileViewerModal';
import { LoginModal } from './components/LoginModal';
import { UniversalWagonSearch } from './components/UniversalWagonSearch';
import { DataBackupModal } from './components/DataBackupModal';
import { PrintReportView } from './components/PrintReportView';
import { IRLogo } from './components/IRLogo';

import { MixLoadManagement } from './components/categories/MixLoadManagement';
import { CYMUnloading } from './components/categories/CYMUnloading';
import { Transhipment } from './components/categories/Transhipment';
import { PCMLDiversion } from './components/categories/PCMLDiversion';
import { SickRepair } from './components/categories/SickRepair';

import {
  Train, Truck, ArrowRightLeft, GitBranch, Wrench, Search,
  Printer, Database, ShieldCheck, ArrowRight, ArrowLeft
} from 'lucide-react';

export default function App() {
  const [database, setDatabase] = useState<AppDatabase>(() => getAppDatabase());
  const [session, setSession] = useState<UserSession>(() => getCurrentSession());

  // Screen View Mode:
  // 'selection' = 5 Options Menu Dashboard
  // 'mix_load' | 'cym_unloading' | 'transhipment' | 'pcml_diversion' | 'sick_repair' = Category Workspace
  const [currentView, setCurrentView] = useState<string>('selection');

  // Modals
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // File Viewer
  const [viewingFile, setViewingFile] = useState<{
    isOpen: boolean;
    attachment: FileAttachment | null;
    title: string;
  }>({
    isOpen: false,
    attachment: null,
    title: ''
  });

  // Highlighted record from universal search trace
  const [highlightedRecordId, setHighlightedRecordId] = useState<string | null>(null);

  // Persist on database changes
  useEffect(() => {
    saveAppDatabase(database);
  }, [database]);

  // Handle Save / Delete across modules
  const handleSaveMixLoad = (entry: MixLoadEntry) => {
    setDatabase((prev) => {
      const idx = prev.mixLoads.findIndex((m) => m.id === entry.id);
      const updated = [...prev.mixLoads];
      if (idx >= 0) {
        updated[idx] = entry;
      } else {
        updated.unshift(entry);
      }
      return { ...prev, mixLoads: updated };
    });
  };

  const handleDeleteMixLoad = (id: string) => {
    setDatabase((prev) => ({
      ...prev,
      mixLoads: prev.mixLoads.filter((m) => m.id !== id)
    }));
  };

  const handleSaveCYM = (entry: CYMUnloadingEntry) => {
    setDatabase((prev) => {
      const idx = prev.cymUnloadings.findIndex((c) => c.id === entry.id);
      const updated = [...prev.cymUnloadings];
      if (idx >= 0) {
        updated[idx] = entry;
      } else {
        updated.unshift(entry);
      }
      return { ...prev, cymUnloadings: updated };
    });
  };

  const handleDeleteCYM = (id: string) => {
    setDatabase((prev) => ({
      ...prev,
      cymUnloadings: prev.cymUnloadings.filter((c) => c.id !== id)
    }));
  };

  const handleSaveTranshipment = (entry: TranshipmentEntry) => {
    setDatabase((prev) => {
      const idx = prev.transhipments.findIndex((t) => t.id === entry.id);
      const updated = [...prev.transhipments];
      if (idx >= 0) {
        updated[idx] = entry;
      } else {
        updated.unshift(entry);
      }
      return { ...prev, transhipments: updated };
    });
  };

  const handleDeleteTranshipment = (id: string) => {
    setDatabase((prev) => ({
      ...prev,
      transhipments: prev.transhipments.filter((t) => t.id !== id)
    }));
  };

  const handleSavePCML = (entry: PCMLDiversionEntry) => {
    setDatabase((prev) => {
      const idx = prev.pcmlDiversions.findIndex((p) => p.id === entry.id);
      const updated = [...prev.pcmlDiversions];
      if (idx >= 0) {
        updated[idx] = entry;
      } else {
        updated.unshift(entry);
      }
      return { ...prev, pcmlDiversions: updated };
    });
  };

  const handleDeletePCML = (id: string) => {
    setDatabase((prev) => ({
      ...prev,
      pcmlDiversions: prev.pcmlDiversions.filter((p) => p.id !== id)
    }));
  };

  const handleSaveSickRepair = (entry: SickRepairEntry) => {
    setDatabase((prev) => {
      const idx = prev.sickRepairs.findIndex((s) => s.id === entry.id);
      const updated = [...prev.sickRepairs];
      if (idx >= 0) {
        updated[idx] = entry;
      } else {
        updated.unshift(entry);
      }
      return { ...prev, sickRepairs: updated };
    });
  };

  const handleDeleteSickRepair = (id: string) => {
    setDatabase((prev) => ({
      ...prev,
      sickRepairs: prev.sickRepairs.filter((s) => s.id !== id)
    }));
  };

  // Login handlers
  const handleLoginSuccess = (newSession: UserSession) => {
    setSession(newSession);
    saveSession(newSession);
    setCurrentView('selection'); // Immediately land on the 5-options selection dashboard!
  };

  const handleLogout = () => {
    clearSession();
    const loggedOut: UserSession = {
      isLoggedIn: false,
      username: '',
      displayName: 'Guest Operator',
      role: 'VIEWER',
      roleTitle: 'Yard Staff',
      designation: 'Unauthenticated User',
      stationCode: 'UDL (Andal Marshalling Yard)'
    };
    setSession(loggedOut);
    setCurrentView('selection');
  };

  // Jump from search
  const handleSelectSearchResult = (categoryId: string, recordId: string) => {
    setCurrentView(categoryId);
    setHighlightedRecordId(recordId);
  };

  // -------------------------------------------------------------
  // 1. FIRST SCREEN: SECURE LOGIN PAGE
  // If not logged in, render the dedicated Full-Page Login screen
  // -------------------------------------------------------------
  if (!session.isLoggedIn) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // -------------------------------------------------------------
  // 2. SECOND SCREEN: 5 OPTIONS DASHBOARD (After Login)
  // If currentView is 'selection', display the 5 option cards
  // -------------------------------------------------------------
  if (currentView === 'selection') {
    return (
      <>
        <MainSelectionDashboard
          userSession={session}
          database={database}
          onSelectCategory={(catId) => {
            setCurrentView(catId);
            setHighlightedRecordId(null);
          }}
          onOpenUniversalSearch={() => setIsSearchOpen(true)}
          onOpenPrintReport={() => setIsPrintOpen(true)}
          onOpenBackupModal={() => setIsBackupOpen(true)}
          onLogout={handleLogout}
        />

        {/* Global Modals accessible from Selection Dashboard */}
        <FileViewerModal
          isOpen={viewingFile.isOpen}
          attachment={viewingFile.attachment}
          title={viewingFile.title}
          onClose={() =>
            setViewingFile({ isOpen: false, attachment: null, title: '' })
          }
        />

        <UniversalWagonSearch
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          database={database}
          onSelectResult={handleSelectSearchResult}
        />

        <DataBackupModal
          isOpen={isBackupOpen}
          onClose={() => setIsBackupOpen(false)}
          database={database}
          onUpdateDatabase={(newDb) => setDatabase(newDb)}
        />

        <PrintReportView
          isOpen={isPrintOpen}
          onClose={() => setIsPrintOpen(false)}
          database={database}
          userSession={session}
        />
      </>
    );
  }

  // -------------------------------------------------------------
  // 3. THIRD SCREEN: DEDICATED INDIVIDUAL CATEGORY PAGE
  // (User selected 1 of the 5 options: Mix Load, CYM Unloading,
  // Transhipment, PCML Diversion, or Sick Repair)
  // -------------------------------------------------------------
  const categoryTitlesMap: Record<string, { title: string; num: string }> = {
    mix_load: { title: 'MIX LOAD MANAGEMENT', num: '1' },
    cym_unloading: { title: 'CYM UNLOADING', num: '2' },
    transhipment: { title: 'TRANSHIPMENT', num: '3' },
    pcml_diversion: { title: 'PCML DIVERSION', num: '4' },
    sick_repair: { title: 'SICK REPAIR', num: '5' }
  };

  const activeCategoryInfo = categoryTitlesMap[currentView] || {
    title: 'OPERATIONAL MODULE',
    num: '1'
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900 font-sans">
      {/* Official Top Navigation Bar */}
      <Navbar
        activeTab={currentView}
        onTabChange={(tab) => {
          setCurrentView(tab);
          setHighlightedRecordId(null);
        }}
        onBackToHome={() => {
          setCurrentView('selection');
          setHighlightedRecordId(null);
        }}
        onOpenUniversalSearch={() => setIsSearchOpen(true)}
        onOpenBackupModal={() => setIsBackupOpen(true)}
        onOpenPrintReport={() => setIsPrintOpen(true)}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        userSession={session}
        onLogout={handleLogout}
      />

      {/* Main Dedicated Category Workspace for PC Desktop */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-5">
        {/* Breadcrumb strip with Back to 5 Options navigation */}
        <div className="no-print bg-white rounded-xl border border-slate-200 p-3.5 px-4 shadow-2xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setCurrentView('selection');
                setHighlightedRecordId(null);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
              <span>← Back to 5 Options Dashboard</span>
            </button>

            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500">
              <span>Andal Yard</span>
              <span>/</span>
              <span className="font-mono font-bold text-slate-800">
                Option {activeCategoryInfo.num}: {activeCategoryInfo.title}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="text-blue-900 hover:text-blue-700 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Universal Wagon Search</span>
            </button>
            <span className="text-slate-300">·</span>
            <button
              type="button"
              onClick={() => setIsPrintOpen(true)}
              className="text-slate-700 hover:text-slate-900 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-blue-800" />
              <span>Official Print / PDF</span>
            </button>
          </div>
        </div>

        {/* Dedicated Page for the Selected Category */}
        <section className="transition-opacity duration-150">
          {currentView === 'mix_load' && (
            <MixLoadManagement
              entries={database.mixLoads}
              onSaveEntry={handleSaveMixLoad}
              onDeleteEntry={handleDeleteMixLoad}
              onViewFile={(file, title) =>
                setViewingFile({ isOpen: true, attachment: file, title })
              }
              highlightedRecordId={highlightedRecordId}
            />
          )}

          {currentView === 'cym_unloading' && (
            <CYMUnloading
              entries={database.cymUnloadings}
              onSaveEntry={handleSaveCYM}
              onDeleteEntry={handleDeleteCYM}
              onViewFile={(file, title) =>
                setViewingFile({ isOpen: true, attachment: file, title })
              }
              highlightedRecordId={highlightedRecordId}
            />
          )}

          {currentView === 'transhipment' && (
            <Transhipment
              entries={database.transhipments}
              onSaveEntry={handleSaveTranshipment}
              onDeleteEntry={handleDeleteTranshipment}
              onViewFile={(file, title) =>
                setViewingFile({ isOpen: true, attachment: file, title })
              }
              highlightedRecordId={highlightedRecordId}
            />
          )}

          {currentView === 'pcml_diversion' && (
            <PCMLDiversion
              entries={database.pcmlDiversions}
              onSaveEntry={handleSavePCML}
              onDeleteEntry={handleDeletePCML}
              onViewFile={(file, title) =>
                setViewingFile({ isOpen: true, attachment: file, title })
              }
              highlightedRecordId={highlightedRecordId}
            />
          )}

          {currentView === 'sick_repair' && (
            <SickRepair
              entries={database.sickRepairs}
              onSaveEntry={handleSaveSickRepair}
              onDeleteEntry={handleDeleteSickRepair}
              onViewFile={(file, title) =>
                setViewingFile({ isOpen: true, attachment: file, title })
              }
              highlightedRecordId={highlightedRecordId}
            />
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="no-print bg-slate-900 border-t border-slate-800 text-slate-400 py-4 px-6 text-xs mt-auto">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <IRLogo size={26} />
            <div>
              <span className="font-semibold text-white tracking-wide">
                TRAINS OFFICE ANDAL · ASANSOL DIVISION · EASTERN RAILWAY
              </span>
              <p className="text-[11px] text-slate-500">
                Andal Marshalling Yard Freight Operations Terminal · Current User: {session.username} ({session.role})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="flex items-center gap-1 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Offline &amp; Network Ready</span>
            </span>
            <span className="text-slate-600">·</span>
            <button
              type="button"
              onClick={() => setIsBackupOpen(true)}
              className="text-slate-300 hover:text-white underline cursor-pointer"
            >
              Export JSON Backup
            </button>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <FileViewerModal
        isOpen={viewingFile.isOpen}
        attachment={viewingFile.attachment}
        title={viewingFile.title}
        onClose={() =>
          setViewingFile({ isOpen: false, attachment: null, title: '' })
        }
      />

      <UniversalWagonSearch
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        database={database}
        onSelectResult={handleSelectSearchResult}
      />

      <DataBackupModal
        isOpen={isBackupOpen}
        onClose={() => setIsBackupOpen(false)}
        database={database}
        onUpdateDatabase={(newDb) => setDatabase(newDb)}
      />

      <PrintReportView
        isOpen={isPrintOpen}
        onClose={() => setIsPrintOpen(false)}
        database={database}
        userSession={session}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={(s) => {
          setSession(s);
          saveSession(s);
        }}
      />
    </div>
  );
}
