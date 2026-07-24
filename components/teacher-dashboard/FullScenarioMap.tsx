import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronRight, GitBranch, Lock, MapPin, X } from 'lucide-react';
import {
  odysseyScenario,
  odysseyScenarioStepDetails,
  OdysseyScenarioChapter,
  OdysseyScenarioStep,
} from './launcherScenario.generated';
import { DashboardStudent } from './dashboardData';

type SelectedStep = { chapter: OdysseyScenarioChapter; step: OdysseyScenarioStep };
type Position = { x: number; y: number };

const graphPadding = 96;
const graphDepthGap = 168;
const graphLaneGap = 132;
const graphNodeRadius = 16;

function requirements(step: OdysseyScenarioStep): string[] {
  return step.requires?.allOf?.filter(id => id !== step.id) ?? [];
}

function commandTokenClassName(token: string, index: number): string {
  if (index === 0) return 'text-sky-300';
  if (index === 1) return 'text-violet-300';
  if (token.startsWith('-')) return 'text-amber-300';
  if (token.includes(':=')) return 'text-emerald-300';
  return 'text-slate-100';
}

const ShellCommand: React.FC<{ command: string }> = ({ command }) => (
  <pre className="mt-3 overflow-x-auto rounded-md border border-slate-700 bg-slate-950 p-3 text-xs shadow-inner">
    <code className="font-mono">
      {command.split(/\s+/).map((token, index) => (
        <span className={commandTokenClassName(token, index)} key={`${index}-${token}`}>
          {index > 0 ? ' ' : ''}{token}
        </span>
      ))}
    </code>
  </pre>
);

function chapterLayout(chapter: OdysseyScenarioChapter) {
  const positions = new Map<string, Position>();
  const dependencies: Array<{ from: string; to: string }> = [];
  const stepById = new Map(chapter.steps.map(step => [step.id, step]));
  const depthByStep = new Map<string, number>();

  const computeDepth = (step: OdysseyScenarioStep, visiting = new Set<string>()): number => {
    const existing = depthByStep.get(step.id);
    if (existing !== undefined) return existing;
    if (visiting.has(step.id)) return 0;

    const nextVisiting = new Set(visiting).add(step.id);
    const prerequisiteDepths = requirements(step)
      .map(id => stepById.get(id))
      .filter((candidate): candidate is OdysseyScenarioStep => Boolean(candidate))
      .map(candidate => computeDepth(candidate, nextVisiting) + 1);
    const depth = prerequisiteDepths.length ? Math.max(...prerequisiteDepths) : 0;
    depthByStep.set(step.id, depth);
    return depth;
  };

  chapter.steps.forEach(step => {
    computeDepth(step);
    requirements(step).forEach(from => {
      if (stepById.has(from)) dependencies.push({ from, to: step.id });
    });
  });

  const maxDepth = Math.max(0, ...depthByStep.values());
  const groups = new Map<number, OdysseyScenarioStep[]>();
  chapter.steps.forEach(step => {
    const depth = depthByStep.get(step.id) ?? 0;
    groups.set(depth, [...(groups.get(depth) ?? []), step]);
  });
  const maxBranchCount = Math.max(1, ...Array.from(groups.values(), group => group.length));
  const width = Math.max(760, graphPadding * 2 + maxDepth * graphDepthGap);
  const height = Math.max(260, maxBranchCount * graphLaneGap + 128);

  groups.forEach((group, depth) => {
    const x = maxDepth === 0
      ? width / 2
      : graphPadding + depth * graphDepthGap;
    const startY = height / 2 - ((group.length - 1) * graphLaneGap) / 2;
    group.forEach((step, lane) => positions.set(step.id, { x, y: startY + lane * graphLaneGap }));
  });

  return {
    positions,
    dependencies,
    width,
    height,
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
          if (!chapter.isAvailable) {
            return (
              <div key={chapter.chapterId} className="rounded-xl border border-dashed border-white/10 bg-white/[0.025] px-4 py-5 text-white/40">
                <div className="flex items-center gap-3">
                  <Lock size={16} className="shrink-0" />
                  <span className="font-orbitron text-xs font-bold">{chapter.title}</span>
                  <span className="ml-auto rounded-full bg-white/[0.06] px-2 py-1 font-mono text-[9px] uppercase tracking-wider">
                    Coming soon
                  </span>
                </div>
              </div>
            );
          }

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
            <div key={step.id} className="absolute w-40 -translate-x-1/2 text-center" style={{ left: position.x, top: position.y - graphNodeRadius }}>
              <button
                type="button"
                onClick={() => onSelect(step)}
                className="mx-auto flex h-8 w-8 items-center justify-center rounded-full border border-ludo-cyan/45 bg-[#071422] font-mono text-[9px] font-bold text-ludo-cyan shadow-[0_0_14px_rgba(0,255,255,.12)] transition hover:scale-110 hover:bg-ludo-cyan hover:text-ludo-deep"
              >
                {step.puzzleId ?? index + 1}
              </button>
              <button type="button" onClick={() => onSelect(step)} className="mt-3 flex min-h-9 w-full items-center justify-center rounded-md border border-white/[0.06] bg-[#071422]/95 px-2 py-1.5 font-grotesk text-[10px] font-semibold leading-tight text-white/80 shadow-sm transition-colors hover:border-ludo-cyan/25 hover:text-ludo-cyan">
                {step.label}
              </button>
              <p className="mt-1 truncate px-2 font-mono text-[8px] text-white/40">{step.location}</p>
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
  const details = odysseyScenarioStepDetails[selection.step.id];
  if (!details) return null;

  return (
    <div role="dialog" aria-modal="true" aria-label={selection.step.label} className="fixed inset-0 z-[130] flex items-center justify-center bg-ludo-deep/90 p-4 backdrop-blur-md" onMouseDown={event => event.target === event.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-ludo-cyan/30 bg-[#06101d] shadow-[0_0_60px_rgba(0,255,255,.14)]">
        <div className="flex items-start justify-between border-b border-white/10 p-5">
          <div><p className="font-mono text-[9px] uppercase tracking-widest text-ludo-cyan">{selection.chapter.title}</p><h3 className="mt-2 font-orbitron text-xl font-bold text-white">{details.overviewTitle}</h3></div>
          <button type="button" aria-label="Close checkpoint details" onClick={onClose} className="rounded-lg p-2 text-white/45 hover:bg-white/5 hover:text-white"><X size={20} /></button>
        </div>
        <div className="grid md:grid-cols-2">
          <div className="relative min-h-72 overflow-hidden text-white md:min-h-[28rem]" style={{ background: details.accentBackground }}>
            <img
              alt={details.overviewTitle}
              className="absolute inset-0 h-full w-full object-cover"
              onError={event => event.currentTarget.remove()}
              src={`/teacher-dashboard/steps/${selection.step.id}.webp`}
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ludo-deep/95 to-transparent p-7 pt-20">
              <MapPin size={24} />
              <p className="mt-3 font-orbitron font-bold">{selection.step.location}</p>
              <p className="mt-2 font-mono text-xs opacity-70">{selection.step.puzzleId ?? selection.step.id}</p>
            </div>
          </div>
          <div className="space-y-5 p-6">
            <div><p className="font-mono text-[9px] uppercase tracking-widest text-ludo-cyan">Overview</p><p className="mt-2 font-grotesk text-sm leading-relaxed text-white/70">{details.overview}</p></div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-ludo-cyan">Teacher note</p>
              <p className="mt-2 font-grotesk text-sm leading-relaxed text-white/65">{details.teacherNote}</p>
              {details.commands?.map(command => <ShellCommand command={command} key={command} />)}
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-widest text-white/35">Learning objectives</p>
              <ul className="mt-2 list-inside list-disc space-y-1 font-grotesk text-sm text-white/65">
                {details.learningObjectives.map(objective => <li key={objective}>{objective}</li>)}
              </ul>
            </div>
            <div><p className="font-mono text-[9px] uppercase tracking-widest text-white/35">Prerequisites</p><p className="mt-2 font-grotesk text-sm text-white/65">{requirements(selection.step).join(', ') || 'Start of chapter'}</p></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
