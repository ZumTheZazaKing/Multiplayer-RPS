import { Context } from "../context"
import { useContext, useEffect, useState } from "react"
import { useNavigate } from 'react-router-dom'

export const JoinRoom = () => {

    const { socket, username } = useContext(Context)
    const [rooms, setRooms] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        socket.emit("get_rooms")
        socket.on("receive_rooms", data => {
            setRooms(data)
        })
    })

    const joinRoom = (room) => {
        let roomArr = room.split("/#/")
        socket.emit("join_room", { room: roomArr[1], id: roomArr[0], username })
        navigate("/gameroom")
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen gap-4">
            <button onClick={() => navigate("/")} className="text-xl fixed top-0 left-0 p-5">Back</button>
            <h1 className="text-2xl font-bold">Join Room</h1>
            <div className="h-[250px] w-[90vw] sm:w-[70vw] md:w-[50vw] lg:w-[400px] overflow-auto space-y-2">
                {rooms && rooms.length > 0 ? rooms.map((room, i) => {
                    return (
                        <div className="px-4 py-2 bg-slate-200 rounded-md flex items-center justify-between" key={i}>
                            <span>{room.split("/#/")[1]}</span>
                            <button onClick={() => joinRoom(room)} className="bg-green-500 text-slate-100 px-3 py-1 rounded">Join</button>
                        </div>
                    )
                }) :
                    <p className="text-center">
                        No rooms available.<br />
                        Try make one yourself?
                    </p>
                }
            </div>
        </div>
    )
}