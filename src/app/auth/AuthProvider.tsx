// components/AuthProvider.tsx
'use client';

// In newer versions of Better Auth, the Provider might not be directly exposed
// We'll use a different approach
export function AuthProvider({ children }: { children: React.ReactNode }) {
  // For now, we'll just render children since Better Auth might handle context internally
  // We'll use the hooks directly in components
  return <>{children}</>;
}