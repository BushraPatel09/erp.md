const test = require('node:test');
const assert = require('node:assert/strict');
const { calculateNextProgress } = require('../src/services/backupEngine');

test('calculateNextProgress never exceeds 100', () => {
  for (let i = 0; i < 100; i += 1) {
    const next = calculateNextProgress(95);
    assert.ok(next <= 100);
    assert.ok(next >= 95);
  }
});
