import React, { useState, useEffect } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonButtons,
  IonButton,
  IonIcon,
  IonLabel
} from '@ionic/react';
import { settingsOutline, statsChartOutline, leafOutline, calendarOutline } from 'ionicons/icons';
import NextUposathaWidget from '../components/uposatha/NextUposathaWidget';
import DhammaAudioWidget from '../components/audio/DhammaAudioWidget';
import { MalaService } from '../services/MalaService';
import './Home.css';

const Home: React.FC = () => {
  const [globalStats, setGlobalStats] = useState<{ totalSessions: number; currentStreak: number } | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const stats = await MalaService.getStats();
    setGlobalStats({
      totalSessions: stats.overall.totalSessions,
      currentStreak: stats.overall.currentStreak
    });
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonTitle>DHAMMA PATH</IonTitle>
          <IonButtons slot="end">
            <IonButton routerLink="/settings">
              <IonIcon icon={settingsOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="ion-padding home-container">

          {/* Hero Section */}
          <div className="home-hero">
            <h1 className="home-hero__title">Namo Buddhaya</h1>
            <p className="home-hero__subtitle">Your daily path to mindfulness.</p>
          </div>

          {/* Primary Feature: Upcoming Uposatha */}
          <section>
            <div className="home-section-header">
              <IonIcon icon={leafOutline} color="secondary" />
              <h3 className="home-section-title">Current Observance</h3>
            </div>
            <NextUposathaWidget />
          </section>

          {/* Stats Section */}
          <section>
            <div className="home-section-header">
              <IonIcon icon={statsChartOutline} color="primary" />
              <h3 className="home-section-title">Practice Summary</h3>
            </div>

            <div className="stats-grid">
              <div className="glass-card stat-card">
                <div className="stat-value">{globalStats?.totalSessions || 0}</div>
                <div className="stat-label">Total Sessions</div>
              </div>
              <div className="glass-card stat-card">
                <div className="stat-value">{globalStats?.currentStreak || 0}</div>
                <div className="stat-label">Day Streak</div>
              </div>
            </div>
          </section>

          {/* Audio Section */}
          <section>
            <div className="home-section-header">
              <h3 className="home-section-title">Daily Inspiration</h3>
            </div>
            <DhammaAudioWidget />
          </section>

          {/* Quick Actions */}
          <section>
            <div className="home-section-header">
              <h3 className="home-section-title">Quick Actions</h3>
            </div>
            <div className="action-grid">
              <div className="glass-card action-card-button" onClick={() => document.querySelector('ion-router-outlet')?.componentOnReady().then((el: any) => el.push('/sati'))}>
                <div className="action-icon-wrapper" style={{ background: 'rgba(var(--ion-color-primary-rgb), 0.1)', borderColor: 'rgba(var(--ion-color-primary-rgb), 0.3)' }}>
                  <IonIcon icon={leafOutline} color="primary" />
                </div>
                <div className="action-label">Practice</div>
                <div className="action-sublabel">Start Session</div>
              </div>

              <div className="glass-card action-card-button" onClick={() => document.querySelector('ion-router-outlet')?.componentOnReady().then((el: any) => el.push('/calendar'))}>
                <div className="action-icon-wrapper" style={{ background: 'rgba(var(--ion-color-secondary-rgb), 0.1)', borderColor: 'rgba(var(--ion-color-secondary-rgb), 0.3)' }}>
                  <IonIcon icon={calendarOutline} color="secondary" />
                </div>
                <div className="action-label">Calendar</div>
                <div className="action-sublabel">View Dates</div>
              </div>
            </div>
          </section>

        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;
