import { describe, expect, it } from 'vitest';
import {
  formatMembershipRole,
  getCanonicalStudentInvitationUrl,
  getStudentInvitationState,
  isInvitationOnboarding,
  isStudentMembershipRole,
  isTeacherMembershipRole,
  shouldExitActiveSessionForInvitation,
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

  it.each([
    '/launcher_download_client',
    '/',
    '/account/sign-in',
  ])('moves a ticket from %s to the guarded invitation route', pathname => {
    const search = '?__clerk_ticket=ticket_123&__clerk_status=sign_in';

    expect(getCanonicalStudentInvitationUrl(pathname, search)).toBe(
      `/account/student/invitation${search}`,
    );
  });

  it('does not rewrite the guarded invitation route again', () => {
    expect(
      getCanonicalStudentInvitationUrl(
        '/account/student/invitation',
        '?__clerk_ticket=ticket_123&__clerk_status=sign_in',
      ),
    ).toBeNull();
  });

  it('does not rewrite ordinary launcher navigation', () => {
    expect(
      getCanonicalStudentInvitationUrl('/launcher_download_client', ''),
    ).toBeNull();
  });

  it('marks invitation redirects separately from ordinary student sign-in', () => {
    expect(isInvitationOnboarding('?source=invitation')).toBe(true);
    expect(isInvitationOnboarding('')).toBe(false);
    expect(isInvitationOnboarding('?source=sign-in')).toBe(false);
  });

  it.each(['sign_in', 'sign_up', 'complete'] as const)(
    'requires an active session to exit before processing %s',
    kind => {
      const invitation = getStudentInvitationState(
        `?__clerk_ticket=ticket_123&__clerk_status=${kind}`,
      );

      expect(shouldExitActiveSessionForInvitation(invitation, true)).toBe(true);
      expect(shouldExitActiveSessionForInvitation(invitation, false)).toBe(false);
    },
  );

  it('does not sign out users for malformed invitation URLs', () => {
    expect(
      shouldExitActiveSessionForInvitation(
        getStudentInvitationState(''),
        true,
      ),
    ).toBe(false);
    expect(
      shouldExitActiveSessionForInvitation(
        getStudentInvitationState('?__clerk_ticket=ticket_123'),
        true,
      ),
    ).toBe(false);
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
