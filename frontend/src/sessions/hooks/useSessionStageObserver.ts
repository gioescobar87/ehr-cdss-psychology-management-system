import { useEffect } from "react";

import type { SessionStage } from "../types/sessionWorkspace.types";

import {
  SESSION_PROGRESS_HEIGHT,
  SESSION_STAGE_SECTION_IDS,
  SESSION_STAGE_ITEMS,
} from "../constants/sessionStage.constants";

interface UseSessionStageObserverOptions {
  enabled?: boolean;
  onStageChange: (stage: SessionStage) => void;
}

function getAppHeaderHeight(): number {
  if (typeof window === "undefined") {
    return 64;
  }

  const rootStyles = window.getComputedStyle(document.documentElement);

  const value = rootStyles.getPropertyValue("--app-header-height").trim();

  const parsedValue = Number.parseFloat(value);

  return Number.isNaN(parsedValue) ? 64 : parsedValue;
}

export function useSessionStageObserver({
  enabled = true,
  onStageChange,
}: UseSessionStageObserverOptions): void {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const sections = SESSION_STAGE_ITEMS.map((item) => {
      const sectionId = SESSION_STAGE_SECTION_IDS[item.id];

      return {
        stage: item.id,
        element: document.getElementById(sectionId),
      };
    }).filter(
      (
        item,
      ): item is {
        stage: SessionStage;
        element: HTMLElement;
      } => item.element !== null,
    );

    if (sections.length === 0) {
      return;
    }

    const appHeaderHeight = getAppHeaderHeight();

    const topOffset = appHeaderHeight + SESSION_PROGRESS_HEIGHT + 16;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSections = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visibleSections.length === 0) {
          return;
        }

        const visibleSection = visibleSections[0];

        const matchedSection = sections.find(
          (section) => section.element === visibleSection.target,
        );

        if (!matchedSection) {
          return;
        }

        onStageChange(matchedSection.stage);
      },
      {
        root: null,
        rootMargin: `-${topOffset}px 0px -55% 0px`,
        threshold: 0,
      },
    );

    sections.forEach(({ element }) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, [enabled, onStageChange]);
}
