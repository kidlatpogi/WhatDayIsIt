import React from 'react';
import { WidgetView } from './components/widget/WidgetView';
import { HomeDashboard } from './components/home/HomeDashboard';

export const App: React.FC = () => {
  const params = new URLSearchParams(window.location.search);
  const view = params.get('view');

  if (view === 'home') {
    return <HomeDashboard />;
  }

  return <WidgetView />;
};

export default App;
