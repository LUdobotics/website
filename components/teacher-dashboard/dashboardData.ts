export type StudentStatus = 'on_track' | 'needs_help' | 'inactive';

export type OdysseyStudentTelemetry = {
  user: {
    id: string;
    clerk_user_id: string | null;
    email: string | null;
    display_name: string | null;
  };
  chapter: string | null;
  checkpoint: string | null;
  state: string | null;
  status: string | null;
  progress: number;
  score: number;
  max_score: number;
  hints_used: number;
  commands_total: number;
  commands_successful: number;
  command_mistakes: number;
  command_accuracy: number;
  average_command_similarity: number;
  total_command_penalty: number;
  failures: number;
  most_common_mistake: string | null;
  most_common_mistake_count: number;
  top_mistakes: string | null;
  help_requested: boolean;
  updated_at: string | null;
  game_session_id: string | null;
};

export type OdysseyTeacherDashboardResponse = {
  students: OdysseyStudentTelemetry[];
};

export type DashboardStudent = {
  id: string;
  name: string;
  email: string;
  initials: string;
  chapter: string;
  checkpointId: string;
  checkpoint: string;
  state: string;
  progress: number;
  score: number;
  maxScore: number;
  hintsUsed: number;
  commandsTotal: number;
  commandsSuccessful: number;
  commandAccuracy: number;
  commandMistakes: number;
  failures: number;
  topMistakes: string;
  helpRequested: boolean;
  status: StudentStatus;
  lastSeen: string;
};

export const chapterDetails = [
  {
    id: 'Ch1',
    shortTitle: 'CLI foundations',
    title: 'Chapter 1 — CLI foundations',
    milestones: ['Exterior', 'Airlock', 'Battery Room', 'System reboot'],
  },
  {
    id: 'Ch2',
    shortTitle: 'Nodes & tools',
    title: 'Chapter 2 — Packages, nodes and tools',
    milestones: ['ARGOS briefing', 'RQT package', 'Relay camera', 'Secure vault'],
  },
  {
    id: 'Ch3',
    shortTitle: 'Robot control',
    title: 'Chapter 3 — Launch files and robot control',
    milestones: ['Liftoff', 'First Node', 'Mining Drone', 'Final Boss'],
  },
] as const;

const checkpointLabels: Record<string, string> = {
  c1_s01: 'Exterior',
  c1_s04: 'Second airlock door',
  c1_s07: 'Battery Room',
  c1_s10: 'System Reboot Signal',
  c2_s01: 'ARGOS Briefing',
  c2_s03: 'Open CCR Door',
  c2_s04: 'Relay Camera to CCR',
  c2_s09: 'Maintenance Bay Area 5',
  c2_s11: 'Secure Vault Challenge',
  c3_s02: 'Launch System Discovery',
  c3_s04: 'Robot Teleoperation',
  c3_s05: 'Sensor Topic Check',
  c3_s08: 'Final System Validation',
};

function initialsFor(value: string): string {
  const parts = value.replace(/@.*/, '').split(/[\s._-]+/).filter(Boolean);
  return parts.slice(0, 2).map(part => part[0]?.toUpperCase() ?? '').join('') || '?';
}

function relativeLastSeen(updatedAt: string | null): string {
  if (!updatedAt) return 'Never';
  const minutes = Math.max(Math.floor((Date.now() - new Date(updatedAt).getTime()) / 60_000), 0);
  if (minutes < 2) return 'Now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function normalizeTelemetry(student: OdysseyStudentTelemetry): DashboardStudent {
  const name = student.user.display_name ?? student.user.email ?? student.user.clerk_user_id ?? 'Student';
  const lastSeen = relativeLastSeen(student.updated_at);
  const status: StudentStatus = !student.updated_at || lastSeen.endsWith('d ago')
    ? 'inactive'
    : student.help_requested || student.status === 'STUCK' || student.failures > 0
      ? 'needs_help'
      : 'on_track';

  return {
    id: student.user.id,
    name,
    email: student.user.email ?? student.user.clerk_user_id ?? student.user.id,
    initials: initialsFor(name),
    chapter: student.chapter ?? 'Not started',
    checkpointId: student.checkpoint ?? 'not_started',
    checkpoint: checkpointLabels[student.checkpoint ?? ''] ?? student.checkpoint ?? 'Not started',
    state: student.state ?? 'No game state yet',
    progress: Math.round(student.progress * 100),
    score: student.score,
    maxScore: student.max_score,
    hintsUsed: student.hints_used,
    commandsTotal: student.commands_total,
    commandsSuccessful: student.commands_successful,
    commandAccuracy: Math.round(student.command_accuracy * 100),
    commandMistakes: student.command_mistakes,
    failures: student.failures,
    topMistakes: student.top_mistakes || student.most_common_mistake || 'None recorded',
    helpRequested: student.help_requested,
    status,
    lastSeen,
  };
}

export const demoStudents: DashboardStudent[] = [
  {
    id: 'maya', name: 'Maya Chen', email: 'maya@orbital.edu', initials: 'MC', chapter: 'Ch2',
    checkpointId: 'c2_s04',
    checkpoint: 'Relay Camera to CCR', state: 'Configuring image_tools node', progress: 68,
    score: 820, maxScore: 1000, hintsUsed: 1, commandsTotal: 54, commandsSuccessful: 49,
    commandAccuracy: 91, commandMistakes: 5, failures: 0, topMistakes: 'topic name',
    helpRequested: false, status: 'on_track', lastSeen: 'Now',
  },
  {
    id: 'leo', name: 'Leo Martin', email: 'leo@orbital.edu', initials: 'LM', chapter: 'Ch2',
    checkpointId: 'c2_s03',
    checkpoint: 'Open CCR Door', state: 'Waiting on service response', progress: 52,
    score: 610, maxScore: 1000, hintsUsed: 4, commandsTotal: 47, commandsSuccessful: 32,
    commandAccuracy: 68, commandMistakes: 15, failures: 2, topMistakes: 'service type, namespace',
    helpRequested: true, status: 'needs_help', lastSeen: '1m ago',
  },
  {
    id: 'sana', name: 'Sana Diallo', email: 'sana@orbital.edu', initials: 'SD', chapter: 'Ch3',
    checkpointId: 'c3_s04',
    checkpoint: 'Robot Teleoperation', state: 'Testing velocity commands', progress: 83,
    score: 930, maxScore: 1000, hintsUsed: 0, commandsTotal: 76, commandsSuccessful: 73,
    commandAccuracy: 96, commandMistakes: 3, failures: 0, topMistakes: 'None recorded',
    helpRequested: false, status: 'on_track', lastSeen: 'Now',
  },
  {
    id: 'noah', name: 'Noah Weber', email: 'noah@orbital.edu', initials: 'NW', chapter: 'Ch1',
    checkpointId: 'c1_s07',
    checkpoint: 'Battery Room', state: 'Paused at checkpoint', progress: 34,
    score: 390, maxScore: 1000, hintsUsed: 2, commandsTotal: 29, commandsSuccessful: 22,
    commandAccuracy: 76, commandMistakes: 7, failures: 0, topMistakes: 'package path',
    helpRequested: false, status: 'inactive', lastSeen: '2d ago',
  },
];
