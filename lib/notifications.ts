// Browser-based push notification simulation
export function showNotification(title: string, options?: NotificationOptions) {
  if ("Notification" in window) {
    if (Notification.permission === "granted") {
      new Notification(title, options)
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          new Notification(title, options)
        }
      })
    }
  }
}

export async function requestNotificationPermission(): Promise<boolean> {
  if ("Notification" in window) {
    if (Notification.permission === "granted") {
      return true
    }
    if (Notification.permission === "denied") {
      return false
    }
    const permission = await Notification.requestPermission()
    return permission === "granted"
  }
  return false
}

export function isNotificationEnabled(): boolean {
  if (typeof window === "undefined") return false
  const saved = localStorage.getItem("heartmatch-notifications-enabled")
  return saved === "true" && Notification.permission === "granted"
}

export function setNotificationEnabled(enabled: boolean) {
  if (typeof window !== "undefined") {
    localStorage.setItem("heartmatch-notifications-enabled", enabled.toString())
  }
}
