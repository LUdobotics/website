import { describe, expect, it } from 'vitest';
import { cloudAccessStatus } from './AccountPage';

describe('cloud access gating', () => {
  it('shows an explicit unavailable state without entitlement', () => {
    expect(cloudAccessStatus('cloud_entitlement_missing')).toContain('contact your teacher');
  });

  it('explains revoked and expired access', () => {
    expect(cloudAccessStatus('cloud_entitlement_revoked')).toContain('revoked');
    expect(cloudAccessStatus('cloud_entitlement_expired')).toContain('expired');
  });
});
