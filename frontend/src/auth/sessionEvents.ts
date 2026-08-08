export const SESSION_EXPIRED_EVENT = "session-expired";

export function notifySessionExpired() {
    window.dispatchEvent(
        new CustomEvent(SESSION_EXPIRED_EVENT)
    );
}