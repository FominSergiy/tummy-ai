import { Redirect } from 'expo-router';
import { useState } from 'react';

export default function Index() {
  const [isAuthn, setIsAuth] = useState<boolean>(false);

  if (!isAuthn) {
    return <Redirect href={'/login'} />;
  }

  return <Redirect href={'/(tabs)/home'} />;
}
