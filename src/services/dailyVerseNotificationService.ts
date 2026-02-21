import { LocalNotifications } from '@capacitor/local-notifications';
import { getVerseForDate, getCleanVerseText, getVerseDisplayReference } from './dhammapadaService';
import { Observer, getSunrise } from '@ishubhamx/panchangam-js';


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
 * The notification is scheduled exactly at precise sunrise for the user's location.
 * Each notification is precomputed with the deterministic verse for that date.
 */
export async function scheduleDailyVerseNotifications(
  observer: Observer,
  windowDays = 30,
): Promise<void> {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  const notifications: Parameters<typeof LocalNotifications.schedule>[0]['notifications'] = [];

  for (let offset = 0; offset < windowDays; offset += 1) {
    const targetDate = new Date(start);
    targetDate.setDate(start.getDate() + offset);

    // Calculate sunrise for the specific date and location
    const sunriseDate = getSunrise(targetDate, observer);

    if (!sunriseDate) {
      console.log(`[DailyVerse] Could not calculate sunrise for date: ${targetDate}`);
      continue;
    }

    let scheduleConfig: any = { at: sunriseDate };

    // If sunrise has already passed...
    if (sunriseDate.getTime() <= now.getTime()) {
      if (offset === 0) {
        // Schedule today's verse to appear immediately by omitting the schedule object
        scheduleConfig = undefined;
        console.log(`[DailyVerse] Today's sunrise passed, posting immediately`);
      } else {
        continue;
      }
    } else {
      console.log(`[DailyVerse] Scheduling for future sunrise at ${sunriseDate}`);
    }

    const verse = getVerseForDate(sunriseDate);
    const id = getDailyVerseNotificationId(sunriseDate);
    const reference = getVerseDisplayReference(verse);

    const notificationItem: any = {
      id,
      title: `Verse of the Day • ${verse.chapterTitle}`,
      body: getCleanVerseText(verse),      // The truncated preview in collapsed mode
      largeBody: getCleanVerseText(verse), // The full text in expanded mode
      summaryText: reference,              // Appears below the title
      ongoing: true,                       // Makes the notification sticky/persistent
      autoCancel: false,                   // Prevent dismissal on click
      sound: undefined,
      iconColor: '#ffc670',
      attachments: [],
      actionTypeId: '',
      extra: {
        route: '/calendar',
        payloadType: 'daily-dhammapada-verse',
        globalVerseNumber: verse.globalVerseNumber,
      },
    };

    if (scheduleConfig) {
      notificationItem.schedule = scheduleConfig;
    }

    notifications.push(notificationItem);
  }

  if (notifications.length > 0) {
    console.log(`[DailyVerse] Scheduling ${notifications.length} notifications...`);
    try {
      await LocalNotifications.schedule({ notifications });
      console.log('[DailyVerse] Successfully scheduled/posted notifications.');
    } catch (e) {
      console.error('[DailyVerse] Error scheduling notifications:', e);
    }
  } else {
    console.log('[DailyVerse] No notifications to schedule.');
  }
}

