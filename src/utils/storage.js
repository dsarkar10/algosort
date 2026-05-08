import AsyncStorage from '@react-native-async-storage/async-storage';

const PROGRESS_KEY = '@algosort_progress';

const defaultProgress = {};

export async function loadProgress() {
  try {
    const json = await AsyncStorage.getItem(PROGRESS_KEY);
    if (json) return JSON.parse(json);
    return { ...defaultProgress };
  } catch {
    return { ...defaultProgress };
  }
}

export async function saveProgress(progress) {
  try {
    await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch {}
}
