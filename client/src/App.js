import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom'
import { Context } from './context'
import io from 'socket.io-client'
import { ToastContainer } from 'react-toastify'
import Loader from './components/game/Loader'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from './firebase'
import { doc, updateDoc } from 'firebase/firestore'
import "react-toastify/dist/ReactToastify.css";

const socket = io.connect("https://zum-multiplayer-rps.onrender.com:3001")

const Main = lazy(() => import('./pages/Main').then(module => ({ default: module.Main })))
const CreateRoom = lazy(() => import('./pages/CreateRoom').then(module => ({ default: module.CreateRoom })))
const GameRoom = lazy(() => import("./pages/GameRoom").then(module => ({ default: module.GameRoom })))
const JoinRoom = lazy(() => import('./pages/JoinRoom').then(module => ({ default: module.JoinRoom })))

function App() {

  const [user] = useAuthState(auth)

  const [username, setUsername] = useState("")
  const [rpsWins, setRpsWins] = useState(user ? 0 : localStorage.getItem("zum_rps_wins") || 0)

  useEffect(() => {
    if (!user) {
      localStorage.setItem("zum_rps_wins", rpsWins)
    } else {
      localStorage.setItem("zum_rps_wins", 0)
    }
  }, [rpsWins, user])

  const memo = useMemo(() => ({
    socket,
    username,
    setUsername,
    rpsWins,
    setRpsWins,
    user,
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [socket, username, rpsWins, user])

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
