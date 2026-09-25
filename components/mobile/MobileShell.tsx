"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IS } from '@/components/mobile/tokens';
import { TabBar, type TabId } from '@/components/mobile/TabBar';

// Tab screens
import { DashboardScreen } from '@/components/mobile/screens/DashboardScreen';
import { LibraryScreen } from '@/components/mobile/screens/LibraryScreen';
import { AIScreen } from '@/components/mobile/screens/AIScreen';
import { AnalyticsScreen } from '@/components/mobile/screens/AnalyticsScreen';
import { ProfileScreen } from '@/components/mobile/screens/ProfileScreen';

// Modal screens
import { WorkoutLoggerScreen } from '@/components/mobile/screens/WorkoutLoggerScreen';
import { PostWorkoutScreen } from '@/components/mobile/screens/PostWorkoutScreen';
import { ReadinessScreen } from '@/components/mobile/screens/ReadinessScreen';
import { ExerciseDetailScreen } from '@/components/mobile/screens/ExerciseDetailScreen';
import { RoutineBuilderScreen } from '@/components/mobile/screens/RoutineBuilderScreen';
import { WearableSyncScreen } from '@/components/mobile/screens/WearableSyncScreen';

type Modal =
  | { type: "workout-logger" }
  | { type: "post-workout"; summary: { totalVolume: number; totalSets: number; duration: number } }
  | { type: "readiness" }
  | { type: "exercise-detail"; name: string }
  | { type: "routine-builder" }
  | { type: "wearable-sync" }
  | null;

const TAB_ORDER: TabId[] = ["dashboard", "library", "ai", "analytics", "profile"];

interface MobileShellProps {
  onLogout?: () => void;
}

export function MobileShell({ onLogout }: MobileShellProps = {}) {
  const [activeTab, setActiveTab] = useState<TabId>("dashboard");
  const [prevTab, setPrevTab] = useState<TabId>("dashboard");
  const [modal, setModal] = useState<Modal>(null);

  const openModal = (m: Modal) => setModal(m);
  const closeModal = () => setModal(null);

  const handleTabChange = (tab: TabId) => {
    setPrevTab(activeTab);
    setActiveTab(tab);
  };

  const tabDirection =
    TAB_ORDER.indexOf(activeTab) > TAB_ORDER.indexOf(prevTab) ? 1 : -1;

  return (
    <div
      style={{
        position: "fixed", inset: 0,
        background: IS.bg,
        color: IS.textPrimary,
        fontFamily: IS.fontDisplay,
        overflowX: "hidden",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* Safe area top spacer */}
      <div style={{ height: "env(safe-area-inset-top, 0px)" }} />

      {/* Scrollable tab content */}
      <div style={{
        position: "absolute",
        top: "env(safe-area-inset-top, 0px)",
        left: 0, right: 0,
        bottom: "calc(64px + env(safe-area-inset-bottom, 0px))",
        overflowY: "auto",
        overflowX: "hidden",
        WebkitOverflowScrolling: "touch",
      }}>
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: tabDirection * 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: tabDirection * -24 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{ minHeight: "100%" }}
          >
            {activeTab === "dashboard" && (
              <DashboardScreen
                onStartWorkout={() => openModal({ type: "workout-logger" })}
                onReadinessCheck={() => openModal({ type: "readiness" })}
                onExerciseDetail={(name) => openModal({ type: "exercise-detail", name })}
                onProfileClick={() => handleTabChange("profile")}
              />
            )}
            {activeTab === "library" && (
              <LibraryScreen
                onExerciseDetail={(name) => openModal({ type: "exercise-detail", name })}
                onAddExercise={() => openModal({ type: "routine-builder" })}
              />
            )}
            {activeTab === "ai" && (
              <AIScreen
                onStartWorkout={() => openModal({ type: "workout-logger" })}
              />
            )}
            {activeTab === "analytics" && (
              <AnalyticsScreen />
            )}
            {activeTab === "profile" && (
              <ProfileScreen
                onWearableSync={() => openModal({ type: "wearable-sync" })}
                onLogout={onLogout}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Tab Bar */}
      <TabBar activeTab={activeTab} onChange={handleTabChange} />

      {/* Modal Overlays */}
      <AnimatePresence>
        {modal?.type === "workout-logger" && (
          <WorkoutLoggerScreen
            key="workout-logger"
            onClose={closeModal}
            onFinish={(summary) => setModal({ type: "post-workout", summary })}
            onOpen3DGuide={(exerciseName) => openModal({ type: "exercise-detail", name: exerciseName })}
          />
        )}
        {modal?.type === "post-workout" && (
          <PostWorkoutScreen
            key="post-workout"
            summary={modal.summary}
            onClose={closeModal}
          />
        )}
        {modal?.type === "readiness" && (
          <ReadinessScreen
            key="readiness"
            onClose={closeModal}
          />
        )}
        {modal?.type === "exercise-detail" && (
          <ExerciseDetailScreen
            key="exercise-detail"
            exerciseName={modal.name}
            onClose={closeModal}
          />
        )}
        {modal?.type === "routine-builder" && (
          <RoutineBuilderScreen
            key="routine-builder"
            onClose={closeModal}
          />
        )}
        {modal?.type === "wearable-sync" && (
          <WearableSyncScreen
            key="wearable-sync"
            onClose={closeModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
