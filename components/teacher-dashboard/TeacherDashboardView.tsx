import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Activity, AlertTriangle, ChevronDown, ChevronRight, CircleHelp, Command,
  GraduationCap, Radio, Target, Users,
} from 'lucide-react';
import { chapterDetails, DashboardStudent, StudentStatus } from './dashboardData';

type StudentFilter = 'all' | StudentStatus;

interface TeacherDashboardViewProps {
  students: DashboardStudent[];
  organizationName?: string;
  simulated?: boolean;
  lastUpdatedLabel?: string;
  compact?: boolean;
  hideMissionProgress?: boolean;
}

const statusStyles: Record<StudentStatus, { label: string; className: string; dot: string }> = {
  on_track: { label: 'On track', className: 'text-ludo-green border-ludo-green/30 bg-ludo-green/10', dot: 'bg-ludo-green' },
  needs_help: { label: 'Needs help', className: 'text-ludo-orange border-ludo-orange/30 bg-ludo-orange/10', dot: 'bg-ludo-orange' },
  inactive: { label: 'Inactive', className: 'text-white/55 border-white/15 bg-white/5', dot: 'bg-white/35' },
};

const average = (values: number[]) => values.length
  ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
  : 0;

function avatarColor(value: string): string {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = ((hash << 5) - hash + value.charCodeAt(index)) | 0;
  }
  return `hsl(${Math.abs(hash) % 360} 70% 42%)`;
}

const StudentAvatar: React.FC<{ student: DashboardStudent; className?: string }> = ({ student, className = '' }) => (
  <span
    className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ludo-cyan/20 font-mono text-[10px] font-bold text-white ${className}`}
    style={{ backgroundColor: avatarColor(student.id) }}
  >
    {student.helpRequested && (
      <>
        <span className="absolute -inset-2 animate-pulse rounded-full border-2 border-ludo-orange/70" />
        <span className="absolute -right-1.5 -top-1.5 z-30 flex h-4 w-4 items-center justify-center rounded-full bg-ludo-orange text-[9px] font-black text-ludo-deep">!</span>
      </>
    )}
    <span className="relative z-10">{student.initials}</span>
    {student.profileImageUrl && (
      <img
        alt=""
        className="absolute inset-0 z-20 h-full w-full rounded-full object-cover"
        onError={event => event.currentTarget.remove()}
        src={student.profileImageUrl}
      />
    )}
  </span>
);

export const TeacherDashboardView: React.FC<TeacherDashboardViewProps> = ({
  students,
  organizationName = 'Orbital Academy',
  simulated = false,
  lastUpdatedLabel = 'Updated just now',
  compact = false,
  hideMissionProgress = false,
}) => {
  const [filter, setFilter] = useState<StudentFilter>('all');
  const [selectedChapter, setSelectedChapter] = useState('Ch1');
  const [expandedStudentId, setExpandedStudentId] = useState<string | null>(students[1]?.id ?? null);

  const filteredStudents = useMemo(
    () => filter === 'all' ? students : students.filter(student => student.status === filter),
    [filter, students],
  );
  const activeStudents = students.filter(student => student.status !== 'inactive').length;
  const needsHelp = students.filter(student => student.status === 'needs_help').length;
  const averageProgress = average(students.map(student => student.progress));
  const averageAccuracy = average(students.map(student => student.commandAccuracy));
  const activeChapter = chapterDetails.find(chapter => chapter.id === selectedChapter) ?? chapterDetails[0];
  const chapterStudents = students.filter(student => student.chapter === activeChapter.id);

  const stats = [
    { label: 'Students', value: students.length, icon: Users, accent: 'text-ludo-cyan' },
    { label: 'Active now', value: activeStudents, icon: GraduationCap, accent: 'text-ludo-green' },
    { label: 'Avg. progress', value: `${averageProgress}%`, icon: Target, accent: 'text-ludo-blue' },
    { label: 'Need attention', value: needsHelp, icon: AlertTriangle, accent: 'text-ludo-orange' },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-ludo-cyan/25 bg-[#06101d]/95 shadow-[0_0_60px_rgba(0,255,255,0.1)]">
      <div className="flex flex-col gap-4 border-b border-white/10 bg-white/[0.025] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-orbitron text-sm font-bold text-white sm:text-base">Teacher Dashboard</span>
            <span className="rounded-full border border-ludo-cyan/25 bg-ludo-cyan/10 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-ludo-cyan">
              {simulated ? 'Simulation' : 'Live'}
            </span>
          </div>
          <p className="mt-1 font-grotesk text-xs text-white/55">{organizationName} · The Odyssey</p>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-white/50">
          <Radio size={13} className="animate-pulse text-ludo-green" />
          {lastUpdatedLabel}
        </div>
      </div>

      <div className={compact ? 'p-4 sm:p-5' : 'p-5 sm:p-7'}>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {stats.map(stat => (
            <motion.div layout key={stat.label} className="rounded-xl border border-white/10 bg-white/[0.035] p-3 sm:p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="font-grotesk text-[11px] text-white/55 sm:text-xs">{stat.label}</span>
                <stat.icon size={15} className={stat.accent} />
              </div>
              <motion.p
                key={String(stat.value)}
                initial={{ opacity: 0.35, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 font-orbitron text-xl font-bold text-white sm:text-2xl"
              >
                {stat.value}
              </motion.p>
            </motion.div>
          ))}
        </div>

        {!hideMissionProgress && <div className="mt-4 rounded-xl border border-white/10 bg-ludo-deep/60 p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 font-orbitron text-xs font-bold text-white">
              <Activity size={15} className="text-ludo-magenta" />
              Mission progress
            </div>
            <div className="flex gap-1 overflow-x-auto pb-1">
              {chapterDetails.map(chapter => (
                <button
                  key={chapter.id}
                  type="button"
                  onClick={() => setSelectedChapter(chapter.id)}
                  className={`shrink-0 rounded-md border px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-wider transition-colors ${
                    chapter.id === selectedChapter
                      ? 'border-ludo-cyan/50 bg-ludo-cyan/10 text-ludo-cyan'
                      : 'border-white/10 text-white/45 hover:text-white'
                  }`}
                >
                  {chapter.id}
                </button>
              ))}
            </div>
          </div>
          <p className="mt-2 font-grotesk text-xs text-white/50">{activeChapter.title}</p>

          <div className="relative mt-5 grid grid-cols-4 gap-2">
            <div className="absolute left-[8%] right-[8%] top-3 h-px bg-gradient-to-r from-ludo-cyan/30 via-ludo-magenta/45 to-white/10" />
            {activeChapter.milestones.map((milestone, index) => {
              const milestoneStudents = chapterStudents.filter(student => Math.min(3, Math.floor(student.progress / 25)) === index);
              return (
                <div key={milestone} className="relative min-w-0 text-center">
                  <div className="relative z-10 mx-auto flex h-6 w-6 items-center justify-center rounded-full border border-ludo-cyan/35 bg-[#071422] font-mono text-[9px] text-ludo-cyan">
                    {index + 1}
                  </div>
                  <p className="mt-2 truncate font-grotesk text-[9px] text-white/55 sm:text-[10px]">{milestone}</p>
                  <div className="mt-2 flex min-h-6 justify-center -space-x-1.5">
                    {milestoneStudents.slice(0, 3).map(student => (
                      <motion.span layout key={student.id} title={student.name}>
                        <StudentAvatar className="h-6 w-6 border-2 border-[#071422] text-[8px]" student={student} />
                      </motion.span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>}

        <div className="mt-4 overflow-hidden rounded-xl border border-white/10">
          <div className="flex flex-col gap-3 border-b border-white/10 bg-white/[0.025] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 font-orbitron text-xs font-bold text-white">
              <Command size={15} className="text-ludo-cyan" /> Students
              <span className="font-mono text-[9px] font-normal text-white/40">{averageAccuracy}% avg. accuracy</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {([
                ['all', 'All'], ['on_track', 'On track'], ['needs_help', 'Attention'], ['inactive', 'Inactive'],
              ] as const).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setFilter(value)}
                  className={`rounded-md px-2 py-1 font-mono text-[9px] uppercase tracking-wider transition-colors ${
                    filter === value ? 'bg-ludo-cyan text-ludo-deep' : 'bg-white/5 text-white/45 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-white/[0.07]">
            <AnimatePresence initial={false}>
              {filteredStudents.map(student => {
                const status = statusStyles[student.status];
                const expanded = expandedStudentId === student.id;
                return (
                  <motion.div layout key={student.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    <button
                      type="button"
                      onClick={() => setExpandedStudentId(expanded ? null : student.id)}
                      className="grid w-full grid-cols-[minmax(0,1.5fr)_70px] items-center gap-3 px-3 py-3 text-left transition-colors hover:bg-white/[0.035] sm:grid-cols-[minmax(0,1.5fr)_100px_minmax(120px,1fr)_70px] sm:px-4"
                    >
                      <span className="flex min-w-0 items-center gap-2.5">
                        {expanded ? <ChevronDown size={13} className="shrink-0 text-white/35" /> : <ChevronRight size={13} className="shrink-0 text-white/35" />}
                        <StudentAvatar student={student} />
                        <span className="min-w-0">
                          <span className="block truncate font-grotesk text-xs font-semibold text-white">{student.name}</span>
                          <span className="block truncate font-grotesk text-[10px] text-white/40">{student.checkpoint}</span>
                          <span className="mt-2 block sm:hidden">
                            <span className="mb-1 flex justify-between font-mono text-[9px] font-bold text-ludo-cyan"><span>Progress</span><span>{student.progress}%</span></span>
                            <span className="block h-2 overflow-hidden rounded-full bg-white/10">
                              <motion.span className="block h-full rounded-full bg-gradient-to-r from-ludo-blue to-ludo-cyan shadow-[0_0_10px_rgba(0,255,255,0.35)]" animate={{ width: `${student.progress}%` }} transition={{ duration: 0.9, ease: 'easeOut' }} />
                            </span>
                          </span>
                        </span>
                      </span>
                      <span className={`justify-self-start rounded-full border px-2 py-1 font-mono text-[8px] uppercase ${status.className}`}>
                        <span className={`mr-1 inline-block h-1.5 w-1.5 rounded-full ${status.dot}`} />{status.label}
                      </span>
                      <span className="hidden min-w-0 sm:block">
                        <span className="mb-1.5 flex justify-between font-mono text-[9px] font-bold text-white/50"><span>{student.chapter}</span><span className="text-ludo-cyan">{student.progress}%</span></span>
                        <span className="block h-2.5 overflow-hidden rounded-full border border-ludo-cyan/10 bg-white/10">
                          <motion.span className="block h-full rounded-full bg-gradient-to-r from-ludo-blue to-ludo-cyan shadow-[0_0_10px_rgba(0,255,255,0.35)]" animate={{ width: `${student.progress}%` }} transition={{ duration: 0.9, ease: 'easeOut' }} />
                        </span>
                      </span>
                      <span className="text-right">
                        <motion.span key={student.score} initial={{ opacity: 0.35, y: 3 }} animate={{ opacity: 1, y: 0 }} className="block font-orbitron text-xs font-bold text-ludo-cyan">
                          {student.score}/{student.maxScore || 100}
                        </motion.span>
                        <span className="mt-1 block font-mono text-[8px] uppercase tracking-wider text-white/35">Score · {student.lastSeen}</span>
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {expanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-ludo-deep/45"
                        >
                          <div className="grid grid-cols-2 gap-3 px-5 py-4 sm:grid-cols-4">
                            <Detail label="Command accuracy" value={`${student.commandAccuracy}%`} />
                            <Detail label="Commands" value={`${student.commandsSuccessful}/${student.commandsTotal}`} />
                            <Detail label="Score" value={student.maxScore ? `${student.score}/${student.maxScore}` : student.score} />
                            <Detail label="Hints / failures" value={`${student.hintsUsed} / ${student.failures}`} />
                            <Detail label="Command mistakes" value={student.commandMistakes} />
                            <Detail label="Average similarity" value={`${student.averageCommandSimilarity}%`} />
                            <Detail label="Penalty" value={student.totalCommandPenalty} />
                            <Detail
                              label="Most common mistake"
                              value={`${student.mostCommonMistake}${student.mostCommonMistakeCount > 0 ? ` (${student.mostCommonMistakeCount})` : ''}`}
                            />
                            <div className="col-span-2 sm:col-span-4 flex items-start gap-2 rounded-lg border border-white/[0.08] bg-white/[0.025] p-3">
                              <CircleHelp size={14} className={student.helpRequested ? 'mt-0.5 shrink-0 text-ludo-orange' : 'mt-0.5 shrink-0 text-ludo-cyan'} />
                              <div>
                                <p className="font-mono text-[9px] uppercase tracking-wider text-white/40">Teacher insight</p>
                                <p className="mt-1 font-grotesk text-[11px] text-white/70">
                                  {student.helpRequested
                                    ? `${student.name} requested help. Review: ${student.topMistakes}.`
                                    : `${student.state}. Most common issue: ${student.topMistakes}.`}
                                </p>
                              </div>
                            </div>
                            <div className="col-span-2 rounded-lg border border-white/[0.08] bg-white/[0.025] p-3 sm:col-span-4">
                              <p className="font-mono text-[9px] uppercase tracking-wider text-white/40">Full top mistakes</p>
                              <p className="mt-1 font-grotesk text-[11px] text-white/70">{student.topMistakes}</p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            {filteredStudents.length === 0 && (
              <p className="px-4 py-8 text-center font-grotesk text-xs text-white/45">No students match this view.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Detail: React.FC<{ label: string; value: string | number }> = ({ label, value }) => (
  <div>
    <p className="font-mono text-[9px] uppercase tracking-wider text-white/35">{label}</p>
    <p className="mt-1 font-grotesk text-xs font-semibold text-white/80">{value}</p>
  </div>
);
