import {
    useCallback,
    useEffect,
    useRef,
    useState
} from "react";

import { IDLE_TIMEOUT_CONFIG } from "./idleTimeoutConfig";

interface UseIdleTimeoutOptions {

    enabled: boolean;

    onLogout: () => void;
}

export function useIdleTimeout({
    enabled,
    onLogout
}: UseIdleTimeoutOptions) {

    const [showWarning, setShowWarning] =
        useState(false);

    const [remainingSeconds, setRemainingSeconds] =
        useState(0);


    const idleTimerRef =
        useRef<ReturnType<typeof setTimeout> | null>(null);

    const warningTimerRef =
        useRef<ReturnType<typeof setTimeout> | null>(null);

    const countdownIntervalRef =
        useRef<ReturnType<typeof setInterval> | null>(null);

    const showWarningRef =
        useRef(false);

    const clearTimers = useCallback(() => {

        if (idleTimerRef.current) {

            clearTimeout(
                idleTimerRef.current
            );

            idleTimerRef.current = null;

        }


        if (warningTimerRef.current) {

            clearTimeout(
                warningTimerRef.current
            );

            warningTimerRef.current = null;

        }


        if (countdownIntervalRef.current) {

            clearInterval(
                countdownIntervalRef.current
            );

            countdownIntervalRef.current = null;

        }

    }, []);


    const scheduleIdleTimer = useCallback(() => {

        clearTimers();


        idleTimerRef.current =
            setTimeout(() => {

                const warningSeconds =
                    Math.ceil(
                        IDLE_TIMEOUT_CONFIG.warningDurationMs / 1000
                    );


                showWarningRef.current = true;

                setShowWarning(true);

                setRemainingSeconds(
                    warningSeconds
                );


                countdownIntervalRef.current =
                    setInterval(() => {

                        setRemainingSeconds(
                            previous => {

                                if (previous <= 1) {

                                    if (
                                        countdownIntervalRef.current
                                    ) {

                                        clearInterval(
                                            countdownIntervalRef.current
                                        );

                                        countdownIntervalRef.current =
                                            null;

                                    }

                                    return 0;

                                }

                                return previous - 1;

                            }
                        );

                    }, 1000);


                warningTimerRef.current =
                    setTimeout(() => {

                        onLogout();

                    }, IDLE_TIMEOUT_CONFIG.warningDurationMs);


            }, IDLE_TIMEOUT_CONFIG.idleTimeoutMs);


    }, [
        clearTimers,
        onLogout
    ]);


    const resetTimers = useCallback(() => {

        if (!enabled) {

            clearTimers();

            showWarningRef.current = false;

            return;
        }

        showWarningRef.current = false;

        setShowWarning(false);

        setRemainingSeconds(0);


        scheduleIdleTimer();

    }, [
        enabled,
        scheduleIdleTimer
    ]);


    useEffect(() => {

        if (!enabled) {

            clearTimers();

            return;

        }


        const activityEvents = [
            "mousemove",
            "keydown",
            "click",
            "touchstart",
            "scroll"
        ];


        const handleActivity = () => {

            if (showWarningRef.current) {
                return;
            }

            resetTimers();

        };


        activityEvents.forEach(event => {

            window.addEventListener(
                event,
                handleActivity
            );

        });


        /*
         * Start the initial idle timer.
         */
        scheduleIdleTimer();


        return () => {

            activityEvents.forEach(event => {

                window.removeEventListener(
                    event,
                    handleActivity
                );

            });


            clearTimers();

            showWarningRef.current = false;
        };

    }, [
        enabled,
        resetTimers,
        scheduleIdleTimer,
        clearTimers
    ]);


    return {

        showWarning:
            enabled && showWarning,

        remainingSeconds:
            enabled
                ? remainingSeconds
                : 0,

        resetTimers

    };

}