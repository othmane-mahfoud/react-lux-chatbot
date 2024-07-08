import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('currentUser'));
    if (storedUser) {
      setCurrentUser(storedUser);
    }
  }, []);

  const signUp = (firstName, lastName, email, password) => {
    return new Promise((resolve, reject) => {
      let users = JSON.parse(localStorage.getItem('users')) || [];
      const userExists = users.find(user => user.email === email);
      if (userExists) {
        reject(new Error('User already exists'));
      } else {
        const newUser = { id: Date.now().toString(), firstName, lastName, email, password };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        setCurrentUser(newUser);
        resolve(newUser);
      }
    });
  };

  const signIn = (email, password) => {
    return new Promise((resolve, reject) => {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(user => user.email === email && user.password === password);
      if (!user) {
        reject(new Error('Invalid email or password'));
      } else {
        localStorage.setItem('currentUser', JSON.stringify(user));
        setCurrentUser(user);
        resolve(user);
      }
    });
  };

  const signOut = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;