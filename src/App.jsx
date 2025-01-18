import React from 'react';
import './App.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider, redirect } from 'react-router';
import Home from './pages/home.jsx';
import About from './pages/about.jsx';
import Game from './pages/game.jsx';
import Settings from './pages/settings.jsx';
import NoGroup from './pages/no-group.jsx';
import { isGroupInDB } from './db/index.js';
import Layout from './components/layout.jsx';
import AddPlayers from './pages/add-players.jsx';
import AddScores from './pages/add-score.jsx';
import SelectPlayers from './pages/select-players.jsx';
import PlayerStats from './pages/player-stats.jsx';
import ErrorBoundary from './pages/error-boundary.jsx';

async function checkGroupExists({ params }) {
  const temp = await isGroupInDB(params.groupId);
  if (!temp) {
    return redirect('/no-group');
  }
  return params;
}

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<Layout />} errorElement={<ErrorBoundary />}>
      <Route index element={<Home />} />
      <Route path='/about' element={<About />} />
      <Route path='/group/:groupId' element={<Game />} loader={checkGroupExists} />
      <Route path='/group/:groupId/settings' element={<Settings />} loader={checkGroupExists} />
      <Route path='/group/:groupId/settings/add-players' element={<AddPlayers />} loader={checkGroupExists} />
      <Route path='/group/:groupId/add-scores' element={<AddScores />} loader={checkGroupExists} />
      <Route path='/group/:groupId/select-players' element={<SelectPlayers />} loader={checkGroupExists} />
      <Route path='/group/:groupId/player/:player_id' element={<PlayerStats />} loader={checkGroupExists} />
      <Route path='/no-group' element={<NoGroup />} />
    </Route>,
  ),
);

function App() {
  return (
    <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}

export default App;
