import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Bot, Eye, Gauge, ShieldCheck, Sparkles } from 'lucide-react';
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
        const progressGain = index === 1 ? 1 : 2;
        const nextProgress = Math.min(student.progress + progressGain, 96);
        const nextCommandsTotal = student.commandsTotal + 1;
        const successful = index !== 1 || tick.current % 3 !== 0;
        const nextSuccessful = student.commandsSuccessful + (successful ? 1 : 0);
        return {
          ...student,
          progress: nextProgress,
          commandsTotal: nextCommandsTotal,
          commandsSuccessful: nextSuccessful,
          commandAccuracy: Math.round((nextSuccessful / nextCommandsTotal) * 100),
          score: Math.min(student.score + (successful ? 8 : 2), student.maxScore),
          lastSeen: 'Now',
        };
      }));

      setUpdateLabel(`Snapshot ${String(tick.current + 1).padStart(2, '0')} · live demo`);
    }, 2800);

    return () => window.clearInterval(interval);
  }, []);

  return { students, updateLabel };
}

export const TeacherBenefits: React.FC = () => {
  const { students, updateLabel } = useSimulatedClassroom();

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

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ludo-green">
                <ShieldCheck size={14} /> Interactive preview
              </div>
              <h3 className="mt-2 font-orbitron text-xl font-bold text-white">A classroom in motion</h3>
            </div>
            <p className="max-w-md font-grotesk text-xs leading-relaxed text-white/45 sm:text-right">
              This preview uses simulated students. The authenticated teacher dashboard connects to real Odyssey telemetry.
            </p>
          </div>
          <TeacherDashboardView students={students} simulated lastUpdatedLabel={updateLabel} compact />
        </motion.div>
      </div>
    </Section>
  );
};
