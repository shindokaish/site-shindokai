const webpush = require('web-push');
const { createClient } = require('@supabase/supabase-js');

webpush.setVapidDetails(
  'mailto:jeremy.boitrel@gmail.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const sb = () => createClient(
  process.env.SUPABASE_URL || 'https://jcfltkuobbjqicczpsjn.supabase.co',
  process.env.SUPABASE_KEY || 'sb_publishable_15BDd64WYwMfW8VV9ZXDqg_Oa2ySvKc'
);

module.exports = async (req, res) => {
  // Vercel cron passe un header Authorization
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end();
  }

  const client = sb();
  const now = new Date().toISOString();

  // Récupérer les notifications programmées
  const { data: row } = await client.from('data_store').select('value').eq('key', 'scheduled_notifications').maybeSingle();
  const scheduled = row?.value || [];

  // Filtrer celles à envoyer maintenant
  const toSend = scheduled.filter(n => !n.sent && n.scheduledAt <= now);
  if (!toSend.length) return res.json({ checked: scheduled.length, sent: 0 });

  // Récupérer les abonnés
  const { data: subRow } = await client.from('data_store').select('value').eq('key', 'push_subscriptions').maybeSingle();
  const subscriptions = subRow?.value || [];

  let totalSent = 0;
  const newEntries = []; // nouvelles occurrences récurrentes

  for (const notif of toSend) {
    const payload = JSON.stringify({
      title: notif.title, body: notif.body,
      image: notif.image, url: notif.url,
      actions: notif.actions || [], vibrate: notif.vibrate || [200,100,200],
      persistent: notif.persistent || false
    });
    const results = await Promise.allSettled(
      subscriptions.map(sub => webpush.sendNotification(sub, payload))
    );
    totalSent += results.filter(r => r.status === 'fulfilled').length;
    notif.sent = true;
    notif.sentAt = now;

    // Si récurrente, créer la prochaine occurrence
    if (notif.repeatDays && notif.repeatDays > 0) {
      const next = new Date(notif.scheduledAt);
      next.setDate(next.getDate() + notif.repeatDays);
      newEntries.push({
        ...notif,
        id: Date.now() + Math.random(),
        scheduledAt: next.toISOString(),
        sent: false,
        sentAt: undefined
      });
    }
  }

  // Sauvegarder — garder 30 entrées envoyées + toutes les en attente
  const updated = [
    ...scheduled.map(n => toSend.find(s => s.id === n.id) || n),
    ...newEntries
  ].filter((n, i, arr) => !n.sent || arr.filter(x => x.sent).indexOf(n) >= arr.filter(x => x.sent).length - 30);

  await client.from('data_store').upsert({ key: 'scheduled_notifications', value: updated });

  res.json({ checked: scheduled.length, sent: totalSent });
};
