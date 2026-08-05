import { describe, expect, it } from 'vitest';
import { filterFromUrl, pageFromUrl } from './adminApi';

describe('admin URL state', () => {
  it('bounds invalid pages', () => {
    expect(pageFromUrl('?page=-1')).toBe(1);
    expect(pageFromUrl('?page=3')).toBe(3);
    expect(pageFromUrl('?page=nope')).toBe(1);
  });
  it('reads stable search filters', () => {
    expect(filterFromUrl('?q=robotics')).toBe('robotics');
    expect(filterFromUrl('')).toBe('');
  });
});
