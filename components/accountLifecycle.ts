export const teacherMembershipRoles = new Set([
  'org:admin_teacher',
  'admin_teacher',
  'org:admin',
  'org:teacher',
]);

export const studentMembershipRoles = new Set([
  'org:student',
  'student',
]);

export const isTeacherMembershipRole = (role?: string | null) => (
  Boolean(role && teacherMembershipRoles.has(role))
);

export const isStudentMembershipRole = (role?: string | null) => (
  Boolean(role && studentMembershipRoles.has(role))
);

export type StudentInvitationStatus = 'sign_in' | 'sign_up' | 'complete';

export type StudentInvitationState =
  | { kind: 'missing_ticket' }
  | { kind: 'invalid_status'; status: string | null }
  | { kind: StudentInvitationStatus; ticket: string };

export const getStudentInvitationState = (search: string): StudentInvitationState => {
  const params = new URLSearchParams(search);
  const ticket = params.get('__clerk_ticket');
  const status = params.get('__clerk_status');

  if (!ticket) {
    return { kind: 'missing_ticket' };
  }

  if (status !== 'sign_in' && status !== 'sign_up' && status !== 'complete') {
    return { kind: 'invalid_status', status };
  }

  return { kind: status, ticket };
};

export const getCanonicalStudentInvitationUrl = (
  pathname: string,
  search: string,
) => {
  const params = new URLSearchParams(search);

  if (
    !params.has('__clerk_ticket')
    || pathname === '/account/student/invitation'
    || pathname.startsWith('/account/student/invitation/')
  ) {
    return null;
  }

  return `/account/student/invitation${search.startsWith('?') ? search : `?${search}`}`;
};

export const isInvitationOnboarding = (search: string) => (
  new URLSearchParams(search).get('source') === 'invitation'
);

export const shouldExitActiveSessionForInvitation = (
  invitation: StudentInvitationState,
  isSignedIn: boolean,
) => (
  isSignedIn && invitation.kind !== 'missing_ticket' && invitation.kind !== 'invalid_status'
);

export const formatMembershipRole = (role: string) => {
  if (isTeacherMembershipRole(role)) {
    return 'Teacher';
  }

  if (isStudentMembershipRole(role)) {
    return 'Student';
  }

  return role.replace(/^org:/, '');
};
