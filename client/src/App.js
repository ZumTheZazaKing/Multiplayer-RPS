import { lazy, Suspense, useMemo, useState } from 'react'
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom'
import { Context } from './context'
import io from 'socket.io-client'
import { ToastContainer } from 'react-toastify'
import Loader from './components/game/Loader'
import "react-toastify/dist/ReactToastify.css";

const socket = io.connect("http://localhost:3001")

const Main = lazy(() => import('./pages/Main').then(module => ({ default: module.Main })))
const CreateRoom = lazy(() => import('./pages/CreateRoom').then(module => ({ default: module.CreateRoom })))
const GameRoom = lazy(() => import("./pages/GameRoom").then(module => ({ default: module.GameRoom })))
const JoinRoom = lazy(() => import('./pages/JoinRoom').then(module => ({ default: module.JoinRoom })))

function App() {

  const [username, setUsername] = useState("")

  const memo = useMemo(() => ({
    socket,
    username,
    setUsername
  }), [socket, username])

  return (
    <Router>
      <Context.Provider value={memo}>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/createroom" element={<CreateRoom />} />
            <Route path="/gameroom" element={<GameRoom />} />
            <Route path="/joinroom" element={<JoinRoom />} />
          </Routes>
        </Suspense>
        <ToastContainer position="bottom-left" />
      </Context.Provider>
    </Router>
  );
}

export default App;
