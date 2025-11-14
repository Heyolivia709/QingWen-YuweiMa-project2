import { createContext, useCallback, useContext, useMemo } from 'react';
import useLocalStorage from '../hooks/useLocalStorage.js';

const UserContext = createContext(undefined);

export function UserProvider({ children }) {
  const [user, setUser] = useLocalStorage('kitten-sudoku-user', null);
  const [users, setUsers] = useLocalStorage('kitten-sudoku-users', []);

  const register = useCallback(
    (username, password) => {
      if (!username || !password) {
        return { success: false, message: 'Username and password are required.' };
      }

      const exists = users.some((record) => record.username.toLowerCase() === username.toLowerCase());
      if (exists) {
        return { success: false, message: 'That username is already in use. Please choose another.' };
      }

      const nextUsers = [...users, { username, password }];
      setUsers(nextUsers);
      setUser({ username });
      return { success: true };
    },
    [setUser, setUsers, users],
  );

  const login = useCallback(
    (username, password) => {
      const match = users.find((record) => record.username === username && record.password === password);
      if (!match) {
        return { success: false, message: 'Incorrect username or password.' };
      }
      setUser({ username: match.username });
      return { success: true };
    },
    [setUser, users],
  );

  const logout = useCallback(() => {
    setUser(null);
  }, [setUser]);

  const value = useMemo(
    () => ({
      user,
      users,
      register,
      login,
      logout,
      isAuthenticated: Boolean(user),
    }),
    [login, logout, register, user, users],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within <UserProvider>');
  }
  return context;
}
