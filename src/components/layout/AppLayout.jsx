import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import './AppLayout.css';

export default function AppLayout({ title, children, noPad = false }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <div className="app-main">
        <Topbar title={title} />
        <main className={`app-content${noPad ? ' app-content--no-pad' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
