import './App.css';
import Search from './components/Search';
import { useState } from 'react';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <main>
      <div className="wrapper">
        <h1 className="text-amber-300 font-bold">
          Welcome to <span className="text-gradient">MovieBox</span>
        </h1>
      </div>
      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
    </main>
  );
};

export default App;