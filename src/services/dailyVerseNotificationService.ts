import { LocalNotifications } from '@capacitor/local-notifications';
import { getVerseForDate, getVerseExcerpt } from './dhammapadaService';

export interface DailyVerseTime {
  hour: number;
  minute: number;
}

// Use a distinct ID range so we can cancel only daily-verse notifications.
const DAILY_VERSE_MIN_ID = 4_000_000;
const DAILY_VERSE_MAX_ID = 4_999_999;

function getDailyVerseNotificationId(date: Date): number {
  const dateStr = date.toISOString().split('T')[0].replace(/-/g, ''); // YYYYMMDD
  // Match the existing pattern used in notificationScheduler: typePrefix + YYMMDD
  return parseInt(`4${dateStr.substring(2)}`, 10);
}

export async function requestDailyVersePermissionIfNeeded(): Promise<boolean> {
  const current = await LocalNotifications.checkPermissions();
  if (current.display === 'granted') {
    return true;
  }

  const requested = await LocalNotifications.requestPermissions();
  return requested.display === 'granted';
}

export async function cancelDailyVerseNotifications(): Promise<void> {
  const pending = await LocalNotifications.getPending();
  const verseNotifications = pending.notifications.filter((n) => {
    const id = typeof n.id === 'number' ? n.id : Number(n.id);
    return Number.isFinite(id) && id >= DAILY_VERSE_MIN_ID && id <= DAILY_VERSE_MAX_ID;
  });

  if (verseNotifications.length > 0) {
    await LocalNotifications.cancel({ notifications: verseNotifications });
  }
}

/**
 * Schedule one daily-verse notification per day for the upcoming window.
 * Each notification is precomputed with the deterministic verse for that date.
 */
export async function scheduleDailyVerseNotifications(
  time: DailyVerseTime,
  windowDays = 365,
): Promise<void> {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  const notifications: Parameters<typeof LocalNotifications.schedule>[0]['notifications'] = [];

  for (let offset = 0; offset < windowDays; offset += 1) {
    const scheduledDate = new Date(start);
    scheduledDate.setDate(start.getDate() + offset);
    scheduledDate.setHours(time.hour, time.minute, 0, 0);

    if (scheduledDate.getTime() <= now.getTime()) continue;

    const verse = getVerseForDate(scheduledDate);
    const id = getDailyVerseNotificationId(scheduledDate);

    notifications.push({
      id,
      title: 'Daily Dhammapada Verse',
      body: getVerseExcerpt(verse),
      schedule: { at: scheduledDate },
      sound: undefined,
      attachments: [],
      actionTypeId: '',
      extra: {
        route: '/calendar',
        payloadType: 'daily-dhammapada-verse',
        globalVerseNumber: verse.globalVerseNumber,
      },
    });
  }

  if (notifications.length > 0) {
    await LocalNotifications.schedule({ notifications });
  }
}

