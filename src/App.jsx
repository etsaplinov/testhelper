import React, { Component } from 'react';
import Questions from './components/Questions';
import './App.css';
// import TestSelector from './components/TestSelector';
import Navigation from './components/Navigation';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header text-center">
          <h1 className="App-title">Test helper</h1>
        </header>
        <Navigation />
        {/* <div className="container-fluid">
          <TestSelector />
        </div> */}
        <div>
          <Questions />
        </div>
      </div>
    );
  }
}

export default App;
