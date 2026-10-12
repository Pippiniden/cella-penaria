import { db } from '../data/db';
import { getDeviceId } from '../data/repos/settings';
import { seedIfEmpty } from '../data/seed';
import { requestPersist } from '../platform/storage';

// 起動時の準備。初期データの投入、端末 ID の発行、データ保護の要求。

export async function bootstrap(): Promise<void> {
  await seedIfEmpty(db);
  await getDeviceId(db);
  void requestPersist();
}
