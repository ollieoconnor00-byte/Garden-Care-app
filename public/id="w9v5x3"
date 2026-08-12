self.addEventListener('push', event => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = {
      title: 'Garden Care 🌿',
      body: event.data ? event.data.text() : 'You have a garden reminder.'
    };
  }

  const title = data.title || 'Garden Care 🌿';

  const options = {
    body: data.body || 'You have a garden reminder.',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: 'garden-care',
    renotify: true,
    data: {
      url: '/'
    }
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});


self.addEventListener('notificationclick', event => {
  event.notification.close();

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(clientList => {

      for(const client of clientList){
        if('focus' in client){
          return client.focus();
        }
      }

      if(clients.openWindow){
        return clients.openWindow('/');
      }

    })
  );
});
