import { useNavigate } from 'react-router-dom'
import { useState, useContext } from 'react'
import uniqid from 'uniqid'
import { Context } from '../context'

export const CreateRoom = () => {

    const navigate = useNavigate()
    const { socket, username } = useContext(Context)

    const [room, setRoom] = useState("")

    const createRoom = () => {
        if (room !== "") {
            socket.emit("join_room", { room, id: uniqid(), username })
            navigate("/gameroom")
        }
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <button onClick={() => navigate("/")} className="text-xl fixed top-0 left-0 p-5">Back</button>
            <h1 className="text-2xl font-bold">Create Room</h1>
            <input
                value={room}
                onChange={e => setRoom(e.target.value)}
                type="text"
                placeholder="Room name..."
                className="bg-slate-300 rounded px-4 py-2 outline-none"
                maxLength={25}
            />
            <button onClick={createRoom} className="bg-slate-200 rounded p-2 px-3 mt-4">Create Room</button>
        </div>
    )
}