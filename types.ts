import { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
}

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface Metric {
  value: string;
  label: string;
  description: string;
  suffix?: string;
}

export interface RoadmapItem {
  date: string;
  title: string;
  description: string;
}

export interface ProblemCard {
  icon: LucideIcon;
  title: string;
  description: string;
}