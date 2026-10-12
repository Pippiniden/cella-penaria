import 'fake-indexeddb/auto';
import { afterEach, describe, expect, it } from 'vitest';
import { CellaDB } from '../../src/data/db';
import { alive, save, softDelete } from '../../src/data/repos/base';
import { seedIfEmpty, seedLocations, seedTagAxes } from '../../src/data/seed';

let n = 0;
const dbs: CellaDB[] = [];
function freshDb() {
  const db = new CellaDB(`test-${n++}`);
  dbs.push(db);
  return db;
}
afterEach(async () => {
  await Promise.all(dbs.splice(0).map((d) => d.delete()));
});

describe('seedIfEmpty', () => {
  it('空のときだけ入れ、2回目は何もしない', async () => {
    const db = freshDb();
    await seedIfEmpty(db);
    expect(await db.locations.count()).toBe(seedLocations.length);
    expect(await db.tagAxes.count()).toBe(seedTagAxes.length);

    const loc = await db.locations.get('loc-fridge');
    await save(db, db.locations, { ...loc!, name: '冷蔵庫' });
    await seedIfEmpty(db);
    expect((await db.locations.get('loc-fridge'))?.name).toBe('冷蔵庫');
  });

  it('初期データは固定IDで updatedAt は 0', () => {
    for (const a of seedTagAxes) {
      expect(a.id.startsWith('axis-')).toBe(true);
      expect(a.updatedAt).toBe(0);
    }
  });

  it('タグ軸の値IDは全体で重複しない', () => {
    const ids = seedTagAxes.flatMap((a) => a.values.map((v) => v.id));
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('save / softDelete', () => {
  it('更新日時と端末IDを付け、削除は論理削除', async () => {
    const db = freshDb();
    await seedIfEmpty(db);
    const loc = (await db.locations.get('loc-room'))!;
    const saved = await save(db, db.locations, loc, 1000);
    expect(saved.updatedAt).toBe(1000);
    expect(saved.deviceId).not.toBe('seed');

    await softDelete(db, db.locations, 'loc-room', 2000);
    const deleted = await db.locations.get('loc-room');
    expect(deleted?.deletedAt).toBe(2000);
    expect(alive(await db.locations.toArray()).some((l) => l.id === 'loc-room')).toBe(false);
  });
});
