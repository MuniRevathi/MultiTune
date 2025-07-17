import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { Songs } from './pages/Songs';
import { SongDetails } from './pages/SongDetails';
import { Search } from './pages/Search';
import { Languages } from './pages/Languages';
import { About } from './pages/About';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/songs" element={<Songs />} />
            <Route path="/songs/:id" element={<SongDetails />} />
            <Route path="/search" element={<Search />} />
            <Route path="/languages" element={<Languages />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
