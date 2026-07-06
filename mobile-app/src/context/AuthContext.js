import { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const stored = await AsyncStorage.getItem('iskool_user');
      if (stored) setUser(JSON.parse(stored));
    } catch {}
    setLoading(false);
  };

  const login = async (email, password, schoolId) => {
    const body = { email, password };
    if (schoolId) body.schoolId = schoolId;
    const res = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    await AsyncStorage.setItem('iskool_token', data.token);
    await AsyncStorage.setItem('iskool_user', JSON.stringify(data));
    if (data.schoolId) await AsyncStorage.setItem('iskool_school_id', data.schoolId.toString());
    setUser(data);
    return data;
  };

  const logout = async () => {
    await AsyncStorage.removeItem('iskool_token');
    await AsyncStorage.removeItem('iskool_user');
    await AsyncStorage.removeItem('iskool_school_id');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
