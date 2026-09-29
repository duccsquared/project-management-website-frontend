export default function () {
  const notifications = useState("notifications", () => []);
  const id = useState("notificationId", () => 0);

  const showNotif = (variant, title, body, time = 5000) => {
    id.value += 1;
    const notif = { id: id.value, variant: variant, title: title, body: body };
    notifications.value.push(notif);
    setTimeout(() => {
      notifications.value.shift();
    }, time);
  }

  const removeNotif = (id) => {
    notifications.value = notifications.value.filter(t => t.id !== id)
  }

  const showSuccess = (title, body = "", time = 5000) => {
    showNotif("success", title, body, time)
  };

  const showError = (title, body = "", time = 5000) => {
    showNotif("danger", title, body, time)
  };

  return { notifications, showSuccess, showError, removeNotif };
}