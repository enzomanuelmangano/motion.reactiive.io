import { useEffect, useState } from 'react';

import App from '../index';
import { useUnistyles } from '../hooks/use-unistyles';

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
  const { setTheme, themeName } = useUnistyles();

  useEffect(() => {
    setTheme(themeName);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
