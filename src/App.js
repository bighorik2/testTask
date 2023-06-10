
import { Route, Routes } from 'react-router-dom'
import React from 'react';
import Chat from './pages/Chat.jsx'
import Login from './pages/Login.jsx'


class App extends React.Component {

  render() {
    return (
      <div >
        <header>
        </header>
        <main className=''>
          <Routes >
            <Route index element={<Login />} />

            <Route path='/Chat/:id/:token' element={<Chat />} />
          </Routes >
        </main>

      </div>

    );
  }
}



export default App;
