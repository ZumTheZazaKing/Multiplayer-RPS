import { useNavigate } from 'react-router-dom'
import { Context } from '../context'
import { useContext } from 'react'
import { toast } from 'react-toastify'

export const Main = () => {

    const navigate = useNavigate()
    const { username, setUsername } = useContext(Context)

    const validateUsername = () => {
        if (username.trim() === "") {
            toast.warn("Enter a username")
            return false
        }
        return true;
    }

    const joinRoom = () => {
        if (validateUsername()) {
            navigate("./joinroom")
        }
    }

    const createRoom = () => {
        if (validateUsername()) {
            navigate('./createroom')
        }
    }

    return (
        <div className="h-screen flex flex-col gap-5 items-center justify-center">
            <h1 className="font-bold text-3xl">Multiplayer RPS</h1>
            <input maxLength={20} className="bg-slate-300 rounded px-4 py-2 outline-none" type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder='Username*' />
            <div className="space-y-2">
                <button onClick={joinRoom} className="bg-slate-200 rounded w-full p-2">Join Room</button>
                <button onClick={createRoom} className="bg-slate-200 rounded w-full p-2">Create Room</button>
            </div>
            <p className='fixed bottom-3 text-xs text-slate-400'>&copy;{new Date().getFullYear()} ZUMTHEZAZAKING</p>
        </div>
    )
}