import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronRight, GitBranch, MapPin, X } from 'lucide-react';
import {
  getOdysseyScenarioStepDetails,
  odysseyScenario,
  OdysseyScenarioChapter,
  OdysseyScenarioStep,
} from './launcherScenario.generated';
import { DashboardStudent } from './dashboardData';

type SelectedStep = { chapter: OdysseyScenarioChapter; step: OdysseyScenarioStep };
type Position = { x: number; y: number };

const nodeGap = 148;
const graphPadding = 74;

function requirements(step: OdysseyScenarioStep): string[] {
  return step.requires?.allOf?.filter(id => id !== step.id) ?? [];
}

function chapterLayout(chapter: OdysseyScenarioChapter) {
  const positions = new Map<string, Position>();
  const dependencies: Array<{ from: string; to: string }> = [];
  chapter.steps.forEach((step, index) => {
    positions.set(step.id, { x: graphPadding + index * nodeGap, y: 64 + (index % 2) * 32 });
    requirements(step).forEach(from => dependencies.push({ from, to: step.id }));
  });
  return {
    positions,
    dependencies,
    width: Math.max(760, graphPadding * 2 + Math.max(chapter.steps.length - 1, 0) * nodeGap),
    height: 205,
  };
}

export const FullScenarioMap: React.FC<{ students: DashboardStudent[] }> = ({ students }) => {
  const [openChapterIds, setOpenChapterIds] = useState<Set<string>>(() => new Set(['Ch1']));
  const [selectedStep, setSelectedStep] = useState<SelectedStep | null>(null);

  return (
    <section className="overflow-hidden rounded-2xl border border-ludo-cyan/25 bg-[#06101d]/95 shadow-[0_0_60px_rgba(0,255,255,0.08)]">
      <div className="border-b border-white/10 bg-white/[0.025] px-5 py-4 sm:px-7">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 font-orbitron text-sm font-bold text-white">
              <GitBranch size={16} className="text-ludo-magenta" /> Complete Odyssey map
            </div>
            <p className="mt-1 font-grotesk text-xs text-white/50">
              Every checkpoint is synchronized from the launcher scenario. Select a chapter, then a checkpoint for teaching context.
            </p>
          </div>
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-ludo-cyan">
            {odysseyScenario.chapters.reduce((total, chapter) => total + chapter.steps.length, 0)} checkpoints
          </span>
        </div>
      </div>

      <div className="space-y-3 p-4 sm:p-6">
        {odysseyScenario.chapters.map(chapter => {
          const open = openChapterIds.has(chapter.chapterId);
          const chapterStudents = students.filter(student => student.chapter === chapter.chapterId);
          const needsHelp = chapterStudents.filter(student => student.status === 'needs_help').length;
          return (
            <div key={chapter.chapterId} className="overflow-hidden rounded-xl border border-white/10 bg-ludo-deep/55">
              <button
                type="button"
                onClick={() => setOpenChapterIds(previous => {
                  const next = new Set(previous);
                  next.has(chapter.chapterId) ? next.delete(chapter.chapterId) : next.add(chapter.chapterId);
                  return next;
                })}
                className="flex w-full flex-col gap-3 px-4 py-4 text-left transition-colors hover:bg-white/[0.035] sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="flex min-w-0 items-center gap-3">
                  {open ? <ChevronDown size={16} className="shrink-0 text-ludo-cyan" /> : <ChevronRight size={16} className="shrink-0 text-white/40" />}
                  <span>
                    <span className="block font-orbitron text-xs font-bold text-white">{chapter.title}</span>
                    <span className="mt-1 block font-grotesk text-[11px] text-white/40">{chapter.steps.length} checkpoints</span>
                  </span>
                </span>
                <span className="flex flex-wrap gap-2 font-mono text-[9px] uppercase tracking-wider">
                  <span className="rounded-full border border-ludo-cyan/20 bg-ludo-cyan/5 px-2 py-1 text-ludo-cyan">{chapterStudents.length} students</span>
                  <span className={`rounded-full border px-2 py-1 ${needsHelp ? 'border-ludo-orange/30 bg-ludo-orange/10 text-ludo-orange' : 'border-white/10 text-white/40'}`}>{needsHelp} need help</span>
                </span>
              </button>

              <AnimatePresence initial={false}>
                {open && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden border-t border-white/10">
                    <ChapterGraph chapter={chapter} students={chapterStudents} onSelect={step => setSelectedStep({ chapter, step })} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {selectedStep && <StepDialog selection={selectedStep} onClose={() => setSelectedStep(null)} />}
    </section>
  );
};

const ChapterGraph: React.FC<{
  chapter: OdysseyScenarioChapter;
  students: DashboardStudent[];
  onSelect: (step: OdysseyScenarioStep) => void;
}> = ({ chapter, students, onSelect }) => {
  const layout = useMemo(() => chapterLayout(chapter), [chapter]);
  return (
    <div className="overflow-x-auto p-3 sm:p-5">
      <div className="relative" style={{ width: layout.width, height: layout.height }}>
        <svg aria-hidden="true" className="absolute inset-0" width={layout.width} height={layout.height}>
          {layout.dependencies.map(edge => {
            const from = layout.positions.get(edge.from);
            const to = layout.positions.get(edge.to);
            if (!from || !to) return null;
            const middle = from.x + (to.x - from.x) / 2;
            return <path key={`${edge.from}-${edge.to}`} d={`M ${from.x} ${from.y} C ${middle} ${from.y}, ${middle} ${to.y}, ${to.x} ${to.y}`} fill="none" stroke="rgba(0,255,255,.22)" strokeWidth="2" />;
          })}
        </svg>
        {chapter.steps.map((step, index) => {
          const position = layout.positions.get(step.id)!;
          const checkpointStudents = students.filter(student => student.checkpointId === step.id);
          return (
            <div key={step.id} className="absolute w-32 -translate-x-1/2 -translate-y-1/2 text-center" style={{ left: position.x, top: position.y }}>
              <button
                type="button"
                onClick={() => onSelect(step)}
                className="mx-auto flex h-8 w-8 items-center justify-center rounded-full border border-ludo-cyan/45 bg-[#071422] font-mono text-[9px] font-bold text-ludo-cyan shadow-[0_0_14px_rgba(0,255,255,.12)] transition hover:scale-110 hover:bg-ludo-cyan hover:text-ludo-deep"
              >
                {step.puzzleId ?? index + 1}
              </button>
              <button type="button" onClick={() => onSelect(step)} className="mt-2 line-clamp-2 min-h-7 font-grotesk text-[10px] font-semibold leading-tight text-white/75 transition-colors hover:text-ludo-cyan">
                {step.label}
              </button>
              <p className="truncate font-mono text-[8px] text-white/35">{step.location}</p>
              <div className="mt-2 flex min-h-6 justify-center -space-x-1.5">
                {checkpointStudents.slice(0, 4).map(student => (
                  <span key={student.id} title={`${student.name} · ${student.status.replace('_', ' ')}`} className={`flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#071422] font-mono text-[8px] font-bold text-white ${student.helpRequested ? 'bg-ludo-orange' : 'bg-ludo-blue'}`}>
                    {student.initials}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const StepDialog: React.FC<{ selection: SelectedStep; onClose: () => void }> = ({ selection, onClose }) => {
  const details = getOdysseyScenarioStepDetails(selection.chapter, selection.step);
  return (
    <div role="dialog" aria-modal="true" aria-label={selection.step.label} className="fixed inset-0 z-[130] flex items-center justify-center bg-ludo-deep/90 p-4 backdrop-blur-md" onMouseDown={event => event.target === event.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-3xl overflow-hidden rounded-2xl border border-ludo-cyan/30 bg-[#06101d] shadow-[0_0_60px_rgba(0,255,255,.14)]">
        <div className="flex items-start justify-between border-b border-white/10 p-5">
          <div><p className="font-mono text-[9px] uppercase tracking-widest text-ludo-cyan">{selection.chapter.title}</p><h3 className="mt-2 font-orbitron text-xl font-bold text-white">{selection.step.label}</h3></div>
          <button type="button" aria-label="Close checkpoint details" onClick={onClose} className="rounded-lg p-2 text-white/45 hover:bg-white/5 hover:text-white"><X size={20} /></button>
        </div>
        <div className="grid md:grid-cols-[.8fr_1.2fr]">
          <div className="flex min-h-56 items-center justify-center p-7 text-white" style={{ background: details.accentBackground }}>
            <div className="text-center"><MapPin className="mx-auto" size={28} /><p className="mt-3 font-orbitron font-bold">{selection.step.location}</p><p className="mt-2 font-mono text-xs opacity-70">{selection.step.puzzleId ?? selection.step.id}</p></div>
          </div>
          <div className="space-y-5 p-6">
            <div><p className="font-mono text-[9px] uppercase tracking-widest text-ludo-cyan">Teacher note</p><p className="mt-2 font-grotesk text-sm leading-relaxed text-white/65">{details.teacherNote}</p></div>
            <div><p className="font-mono text-[9px] uppercase tracking-widest text-white/35">Prerequisites</p><p className="mt-2 font-grotesk text-sm text-white/65">{requirements(selection.step).join(', ') || 'Start of chapter'}</p></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
