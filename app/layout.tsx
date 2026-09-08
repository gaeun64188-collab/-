// ❌ 최상단 'use client'; 제거하기!

import React from 'react';
import { LanguageProvider } from './context/LanguageContext';
import './globals.css';

export const metadata = {
  title: 'Next.js App',
  description: 'Daegu small-business support platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
