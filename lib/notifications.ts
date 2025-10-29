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

export function requestNotificationPermission() {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission()
  }
}
