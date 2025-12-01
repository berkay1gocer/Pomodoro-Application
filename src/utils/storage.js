import AsyncStorage from '@react-native-async-storage/async-storage';

const SESSIONS_KEY = '@focus_sessions';

export const saveSession = async (session) => {
  try {
    const existingSessions = await getSessions();
    const updatedSessions = [...existingSessions, session];
    await AsyncStorage.setItem(SESSIONS_KEY, JSON.stringify(updatedSessions));
    return true;
  } catch (error) {
    console.error('Error saving session:', error);
    return false;
  }
};

export const getSessions = async () => {
  try {
    const sessions = await AsyncStorage.getItem(SESSIONS_KEY);
    return sessions ? JSON.parse(sessions) : [];
  } catch (error) {
    console.error('Error getting sessions:', error);
    return [];
  }
};

export const clearAllSessions = async () => {
  try {
    await AsyncStorage.removeItem(SESSIONS_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing sessions:', error);
    return false;
  }
};
