import React from 'react';
import useAuth from '../utils/useAuth';
import TwoFilloutSliders from '@/components/TwoFilloutSliders';

export default function ClerkContentWrapper({ children }) {
  const { isSignedIn } = useAuth();

  return (
    <>
      {children}
    </>
  );
}