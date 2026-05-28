import pb from './pocketbase';

function getUserId(): string | undefined {
  return pb.authStore.record?.id ?? pb.authStore.model?.id;
}

export async function getFavorites(): Promise<string[]> {
  const records = await pb.collection('favorites').getFullList<{ tool_path: string }>({
    sort: 'created',
  });
  return records.map(r => r.tool_path);
}

export async function updateFavorites(toolPaths: string[]): Promise<string[]> {
  const userId = getUserId();
  if (!userId) {
    return [];
  }

  const existing = await pb.collection('favorites').getFullList<{ id: string }>({
    fields: 'id',
  });

  for (const record of existing) {
    await pb.collection('favorites').delete(record.id);
  }

  for (const path of toolPaths) {
    await pb.collection('favorites').create({ tool_path: path, user: userId });
  }

  return toolPaths;
}

export async function mergeFavorites(localFavorites: string[]): Promise<string[]> {
  const serverPaths = await getFavorites();
  const merged = [...new Set([...serverPaths, ...localFavorites])];

  await updateFavorites(merged);

  return merged;
}
