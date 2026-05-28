import pb from './pocketbase';

function getUserId(): string | undefined {
  return pb.authStore.record?.id ?? pb.authStore.model?.id;
}

export async function getPreferences(): Promise<Record<string, string>> {
  const records = await pb.collection('preferences').getFullList<{ key: string; value: string }>();
  const prefs: Record<string, string> = {};
  for (const r of records) {
    prefs[r.key] = r.value;
  }
  return prefs;
}

export async function replacePreferences(prefs: Record<string, string>): Promise<Record<string, string>> {
  const userId = getUserId();
  if (!userId) {
    return prefs;
  }

  const existing = await pb.collection('preferences').getFullList<{ id: string }>({
    fields: 'id',
  });

  for (const record of existing) {
    await pb.collection('preferences').delete(record.id);
  }

  for (const [key, value] of Object.entries(prefs)) {
    await pb.collection('preferences').create({ key, value, user: userId });
  }

  return prefs;
}

export async function patchPreferences(prefs: Record<string, string>): Promise<Record<string, string>> {
  const userId = getUserId();

  for (const [key, value] of Object.entries(prefs)) {
    const existing = await pb.collection('preferences').getFirstListItem(`key = '${key}'`).catch(() => null);
    if (existing) {
      await pb.collection('preferences').update(existing.id, { value });
    }
    else if (userId) {
      await pb.collection('preferences').create({ key, value, user: userId });
    }
  }

  return getPreferences();
}
