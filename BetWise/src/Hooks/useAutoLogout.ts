import { useEffect, useRef } from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebaseConfig'; 

const AUTO_LOGOUT_TIME = 30 * 60 * 1000;

const useAutoLogout = () => {
  const navigate = useNavigate();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      signOut(auth).then(() => {
        navigate('/');
        alert('You have been logged out due to inactivity.');
      }).catch((error) => {
        console.error('Error during sign out:', error);
        alert('An error occurred while logging out. Please try again.');
      });
    }, AUTO_LOGOUT_TIME);
  };

  useEffect(() => {
    const events = ['mousemove', 'keydown', 'click', 'scroll'];

    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer(); // initialize timer on mount

    return () => {
      events.forEach(event => window.removeEventListener(event, resetTimer));
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);
};

export default useAutoLogout;
