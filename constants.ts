export const GOOGLE_SHEETS_URL = 'https://script.google.com/macros/s/AKfycbwyYFRAh5UqQmjCFsCMtGL0ExiBbhmP_YtSYuCqJiBRJiXtOlHjn9MxU_hsjCVjpUv0Hw/exec';

import {
  Gamepad2,
  Cpu,
  Zap,
  Users,
  BarChart,
  Layers,
  BookOpen,
  AlertTriangle,
  TrendingDown,
  School
} from 'lucide-react';
import { NavItem, Feature, Metric, RoadmapItem, ProblemCard } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Problem', href: '#problem' },
  { label: 'Solution', href: '#solution' },
  { label: 'Features', href: '#features' },
  { label: 'Roadmap', href: '#roadmap' },
];

export const PROBLEMS: ProblemCard[] = [
  {
    icon: School,
    title: "Robotics Education Is Hard to Scale",
    description: "Traditional ROS 2 learning requires expensive hardware, lab time, and expert supervision.",
  },
  {
    icon: BookOpen,
    title: "Tutorials Don't Build Real Skills",
    description: "Reading commands ≠ understanding distributed systems, nodes, topics, QoS, and debugging.",
  },
  {
    icon: TrendingDown,
    title: "Students Struggle to Stay Motivated",
    description: "ROS 2 has a steep learning curve & plenty of static documentation, leading to frustration.",
  },
];

export const FEATURES: Feature[] = [
  {
    icon: Zap,
    title: "Code + Gameplay Sync",
    description: "Edit ROS 2 nodes with instant feedback using game-code that is natively compatible with real-world robots.",
  },
  {
    icon: Layers,
    title: "Persistent Skill Tracking",
    description: "Learning profiles for students and classes that track progress over time.",
  },
  {
    icon: BarChart,
    title: "Classroom Dashboard",
    description: "Progress monitoring for instructors with analytics and insights.",
  },
  {
    icon: Users,
    title: "Team Challenges",
    description: "Multiplayer cooperative robotics missions for collaborative learning.",
  },
];

export const METRICS: Metric[] = [
  {
    value: "70",
    suffix: "%",
    label: "Faster ROS 2 Mastery",
    description: "Gamified repetition and narrative reinforcement deliver faster skill acquisition.",
  },
  {
    value: "3",
    suffix: "×",
    label: "Higher Retention",
    description: "Game-based learning improves conceptual memory and long-term understanding.",
  },
  {
    value: "0",
    label: "Hardware Required",
    description: "Train anytime, anywhere — no robots, no labs, no scheduling constraints.",
  },
];

export const ROADMAP: RoadmapItem[] = [
  {
    date: "Early 2026",
    title: "Beta Program & Educator Feedback",
    description: "Selected institutions gain early access. We incorporate real educator and learner insights to shape the final product.",
  },
  {
    date: "Mid 2026",
    title: "MVP Release & First Deployments",
    description: "The Odyssey rolls out to initial partners (You!), supported by onboarding support and metrics tools.",
  },
  {
    date: "Late 2026",
    title: "Full Deployment & Global Launch",
    description: "The Odyssey becomes widely available with live support, international outreach, and scalable deployment options.",
  },
  {
    date: "Beyond 2026",
    title: "Continuous Expansion",
    description: "We introduce new learning units, advanced ROS 2 missions, and the Next Odyssey!",
  },
];