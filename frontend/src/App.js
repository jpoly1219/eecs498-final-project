import React from 'react';
import Header from './components/Header';
import ProblemTab from './components/ProblemTab';
import CodeEditor from './components/CodeEditor';
import FeedbackPanel from './components/FeedbackPanel';
import './App.css'; // Anima styles

const App = () => {
  return (
    <div className="app">
      <Header />
      <div className="content">
        <ProblemTab />
        <CodeEditor />
        <FeedbackPanel />
      </div>
    </div>
  );
};

export default App;
