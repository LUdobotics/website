import { describe, expect, it } from 'vitest';
import {
  formatMembershipRole,
  getStudentInvitationState,
  isStudentMembershipRole,
  isTeacherMembershipRole,
} from './accountLifecycle';

describe('student invitation routing', () => {
  it('rejects direct access without a Clerk ticket', () => {
    expect(getStudentInvitationState('')).toEqual({ kind: 'missing_ticket' });
  });

  it.each(['sign_in', 'sign_up', 'complete'] as const)('accepts the %s invitation state', kind => {
    expect(getStudentInvitationState(`?__clerk_ticket=ticket_123&__clerk_status=${kind}`)).toEqual({
      kind,
      ticket: 'ticket_123',
    });
  });

  it('rejects an unknown or missing invitation status', () => {
    expect(getStudentInvitationState('?__clerk_ticket=ticket_123')).toEqual({
      kind: 'invalid_status',
      status: null,
    });
    expect(getStudentInvitationState('?__clerk_ticket=ticket_123&__clerk_status=expired')).toEqual({
      kind: 'invalid_status',
      status: 'expired',
    });
  });
});

describe('organization role policy', () => {
  it.each(['org:admin_teacher', 'admin_teacher', 'org:admin', 'org:teacher'])(
    'recognizes %s as a teacher role',
    role => expect(isTeacherMembershipRole(role)).toBe(true),
  );

  it.each(['org:student', 'student'])('recognizes %s as a student role', role => {
    expect(isStudentMembershipRole(role)).toBe(true);
    expect(formatMembershipRole(role)).toBe('Student');
  });

  it('does not elevate unknown roles', () => {
    expect(isTeacherMembershipRole('org:member')).toBe(false);
    expect(isStudentMembershipRole('org:member')).toBe(false);
  });
});
