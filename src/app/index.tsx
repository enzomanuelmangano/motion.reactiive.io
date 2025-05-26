import { useEffect, useState } from 'react';

import App from '..';
import { useUnistyles } from '../theme';
import { ThemeStorage } from '../hooks/use-unistyles';

const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return children;
};

const ThemeHandler = ({ children }: { children: React.ReactNode }) => {
  const { setTheme } = useUnistyles();

  useEffect(() => {
    const theme = ThemeStorage.get();
    if (theme) {
      setTheme(theme);
    }
  }, [setTheme]);

  return children;
};

// eslint-disable-next-line import/no-default-export
export default function Index() {
  return (
    <ClientOnly>
      <ThemeHandler>
        <App />
      </ThemeHandler>
    </ClientOnly>
  );
}
