import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Activity, BarChart3, Bot, ChevronDown, Eye, Gauge, ShieldCheck, Sparkles } from 'lucide-react';
import { Section } from './ui/Section';
import { TeacherDashboardView } from './teacher-dashboard/TeacherDashboardView';
import { DashboardStudent, demoStudents } from './teacher-dashboard/dashboardData';

const benefits = [
  {
    icon: Eye,
    title: 'See the whole class',
    description: 'Follow progress, activity and current checkpoints without interrupting the learning flow.',
  },
  {
    icon: Gauge,
    title: 'Intervene at the right moment',
    description: 'Spot help requests, repeated failures and command mistakes before frustration takes over.',
  },
  {
    icon: Bot,
    title: 'Teach without a lab bottleneck',
    description: 'Give every learner meaningful robotics practice, even when hardware and lab time are limited.',
  },
  {
    icon: BarChart3,
    title: 'Turn play into evidence',
    description: 'Connect Odyssey missions to measurable ROS 2 skills, accuracy and learning progression.',
  },
];

function useSimulatedClassroom(): { students: DashboardStudent[]; updateLabel: string } {
  const [students, setStudents] = useState(demoStudents);
  const [updateLabel, setUpdateLabel] = useState('Simulation running');
  const tick = useRef(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      tick.current += 1;
      const targetIndex = tick.current % 3;

      setStudents(previous => previous.map((student, index) => {
        if (index !== targetIndex) return student;
        const nextProgress = Math.min(student.progress + 1, 96);
        const nextCommandsTotal = student.commandsTotal + 1;
        const successful = index !== 1 || tick.current % 3 !== 0;
        const nextSuccessful = student.commandsSuccessful + (successful ? 1 : 0);
        return {
          ...student,
          progress: nextProgress,
          commandsTotal: nextCommandsTotal,
          commandsSuccessful: nextSuccessful,
          commandAccuracy: Math.round((nextSuccessful / nextCommandsTotal) * 100),
          score: Math.min(student.score + (successful ? 1 : 0), student.maxScore),
          lastSeen: 'Now',
        };
      }));

      setUpdateLabel(`Snapshot ${String(tick.current + 1).padStart(2, '0')} · live demo`);
    }, 4200);

    return () => window.clearInterval(interval);
  }, []);

  return { students, updateLabel };
}

export const TeacherBenefits: React.FC = () => {
  const { students, updateLabel } = useSimulatedClassroom();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  return (
    <Section id="teachers" className="bg-ludo-deep relative">
      <div className="absolute inset-0 bg-gradient-to-b from-ludo-blue/5 via-transparent to-ludo-cyan/5" />
      <div className="absolute left-0 top-1/3 h-80 w-80 -translate-x-1/2 rounded-full bg-ludo-blue/10 blur-[120px]" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 font-mono text-sm uppercase tracking-widest text-ludo-cyan">
            <Sparkles size={15} /> Built for educators
          </div>
          <h2 className="font-orbitron text-3xl font-bold text-white md:text-5xl">
            Teach robotics. <span className="text-transparent bg-clip-text bg-gradient-to-r from-ludo-cyan to-ludo-blue">See understanding happen.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl font-grotesk text-lg leading-relaxed text-white/60">
            The Odyssey gives students a world worth exploring and gives teachers a clear view of the skills being built along the way.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl grid-cols-1 gap-4 sm:grid-cols-2">
          {benefits.map((benefit, index) => (
            <motion.article
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: index * 0.08 }}
              className="rounded-2xl border border-ludo-border/30 bg-ludo-panel p-6 transition-colors hover:border-ludo-cyan/60"
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl border border-ludo-cyan/25 bg-ludo-cyan/10">
                <benefit.icon size={21} className="text-ludo-cyan" />
              </div>
              <h3 className="font-orbitron text-base font-bold text-white">{benefit.title}</h3>
              <p className="mt-3 font-grotesk text-sm leading-relaxed text-white/55">{benefit.description}</p>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="mt-12"
        >
          <div className="overflow-hidden rounded-2xl border border-ludo-cyan/25 bg-[#06101d]/95 shadow-[0_0_60px_rgba(0,255,255,0.08)]">
            <button
              type="button"
              aria-expanded={isPreviewOpen}
              aria-controls="teacher-dashboard-preview"
              onClick={() => setIsPreviewOpen(open => !open)}
              className="group flex w-full flex-col gap-5 p-5 text-left transition-colors hover:bg-ludo-cyan/[0.035] sm:flex-row sm:items-center sm:p-7"
            >
              <span className="inline-flex shrink-0 items-center gap-2 self-center rounded-lg border border-ludo-cyan bg-ludo-cyan px-4 py-3 font-orbitron text-[10px] font-bold uppercase tracking-wider text-ludo-deep shadow-[0_0_24px_rgba(0,255,255,0.22)] transition group-hover:border-white group-hover:bg-white">
                {isPreviewOpen ? 'Hide dashboard' : 'Click here to visualize'}
                <ChevronDown size={18} className={`transition-transform duration-300 ${isPreviewOpen ? 'rotate-180' : ''}`} />
              </span>
              <span className="flex min-w-0 items-center gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-ludo-cyan/30 bg-ludo-cyan/10 text-ludo-cyan shadow-[0_0_22px_rgba(0,255,255,0.12)]">
                  <Activity size={22} />
                </span>
                <span>
                  <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-ludo-green">
                    <ShieldCheck size={13} /> Interactive preview
                  </span>
                  <span className="mt-2 block font-orbitron text-lg font-bold text-white sm:text-xl">Watch Mission Control come alive</span>
                  <span className="mt-1 block font-grotesk text-sm text-white/50">Follow a simulated class as progress, scores and interventions evolve.</span>
                </span>
              </span>
              <span className="flex shrink-0 flex-wrap items-center gap-3 sm:ml-auto">
                <span className="hidden gap-2 font-mono text-[9px] uppercase tracking-wider sm:flex">
                  <span className="rounded-full border border-ludo-green/25 bg-ludo-green/10 px-3 py-1.5 text-ludo-green">Live simulation</span>
                  <span className="rounded-full border border-white/10 px-3 py-1.5 text-white/45">{students.length} students</span>
                </span>
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isPreviewOpen && (
                <motion.div
                  id="teacher-dashboard-preview"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <div className="border-t border-white/10 p-3 sm:p-5">
                    <p className="mb-4 font-grotesk text-xs leading-relaxed text-white/45 sm:text-right">
                      This preview uses simulated students. The authenticated teacher dashboard connects to real Odyssey telemetry.
                    </p>
                    <TeacherDashboardView students={students} simulated lastUpdatedLabel={updateLabel} compact />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </Section>
  );
};
