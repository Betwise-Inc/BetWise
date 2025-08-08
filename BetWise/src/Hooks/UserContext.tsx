import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../../firebaseConfig";
import { getUserByEmail } from "../APIconfigs/Users";

type User = {
  email: string | null;
  isAdmin: boolean;
};

type UserContextType = {
  user: User | null;
  loading: boolean;
};

const UserContext = createContext<UserContextType>({ user: null, loading: true });

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser && firebaseUser.email) {
        try {
          const userData = await getUserByEmail(firebaseUser.email);
          setUser({ email: firebaseUser.email, isAdmin: userData?.isAdmin || false });
        } catch {
          setUser({ email: firebaseUser.email, isAdmin: false });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};


export const useUser = () => useContext(UserContext);
