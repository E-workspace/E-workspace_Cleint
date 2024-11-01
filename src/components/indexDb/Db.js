// db.js
import { openDB } from 'idb';

const DB_NAME = 'notificationDB';
const STORE_NAME = 'notifications';

export async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
}

export async function addNotification(notification) {
  const db = await initDB();
  await db.add(STORE_NAME, notification);
}

export async function getNotifications() {
  const db = await initDB();
  return await db.getAll(STORE_NAME);
}

export async function deleteNotification(id) {
  const db = await initDB();
  await db.delete(STORE_NAME, id);
}
