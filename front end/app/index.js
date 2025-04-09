import { Redirect } from 'expo-router';

export default function Index() {
  // Redirect to the auth login screen as the entry point
  return <Redirect href="/auth/login" />;
} 