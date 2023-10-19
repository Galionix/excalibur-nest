// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useEffect } from 'react';
import { AuthAndStart, currentAuth } from '../game/main';
import styles from './app.module.scss';

import NxWelcome from './nx-welcome';

export function App() {
  useEffect(() => {
    if (!currentAuth.user?.uid) return;
    AuthAndStart();
  }, []);
  return (
    <div>
      {/* <NxWelcome title="client-react" /> */}
      <button onClick={AuthAndStart}>Start</button>
    </div>
  );
}

export default App;
