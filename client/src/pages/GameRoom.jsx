import { useContext, useEffect, useState } from "react"
import { Context } from "../context"
import Choice from "../components/game/Choice"
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

export const GameRoom = () => {

    const navigate = useNavigate()

    const { socket, username, rpsWins, setRpsWins } = useContext(Context)
    const [room, setRoom] = useState({ name: "", id: "" })
    const [opponent, setOpponent] = useState("")
    const [waiting, setWaiting] = useState(true)
    const [gameStart, setGameStart] = useState(false)
    const [gameFinish, setGameFinish] = useState(false)

    const [yourChoice, setYourChoice] = useState("")
    const [opponentChoice, setOpponentChoice] = useState("")
    const [round, setRound] = useState(1)
    const [outcome, setOutcome] = useState("")

    const [yourPoints, setYourPoints] = useState(0)
    const [opponentPoints, setOpponentPoints] = useState(0)

    useEffect(() => {
        socket.on("room_details", data => {
            resetValues()
            setRoom({ name: data.room, id: data.id })
            if (data.users === 2) {
                setWaiting(false)
                socket.emit("request_opponent_details", data.id + "/#/" + data.room)
                setTimeout(() => { setGameStart(true); }, 1500)
            }
        })
        socket.on("receive_opponents_details", data => {
            setOpponent(data.username)
        })

        socket.on("opponent_choice", data => {
            setOpponentChoice(data)
        })

        socket.on("room_full", data => {
            toast.error(data, { toastId: "room_full" })
        })

        socket.on("opponent_left", () => {
            setGameFinish(true)
            setOutcome("Opponent Left")
        })

    }, [room.id, room.name, round, socket])

    useEffect(() => {
        if (gameFinish) {
            socket.emit("game_finished", room.id + "/#/" + room.name)
        }
    }, [gameFinish])

    const mainMenu = () => {
        navigate("/")
    }

    const playAgain = () => {
        socket.emit("join_room", { room: room.name, id: room.id, username })
    }

    const resetValues = () => {
        setOpponent("")
        setWaiting(true)
        setGameStart(false)
        setGameFinish(false)
        setYourChoice("")
        setOpponentChoice("")
        setRound(1)
        setOutcome("")
        setYourPoints(0)
        setOpponentPoints(0)
    }

    return (
        <div className="h-screen flex flex-col gap-8 items-center justify-center">
            {!gameStart ?
                <div className="space-y-8">
                    {waiting ?
                        <div>
                            <h1 className="text-2xl font-bold text-center">{room.name}</h1>
                        </div>
                        : ""}
                    {waiting ?
                        <div className="text-2xl font-bold animate-pulse text-center">
                            Waiting for opponent...
                        </div>
                        : ""}
                    <div className="flex flex-col sm:flex-row gap-8 items-center">
                        <p className="text-xl break-words text-center sm:text-end font-bold">{username}</p>
                        <p className="text-3xl font-bold">VS</p>
                        <p className={`text-xl break-words text-center sm:text-start ${opponent ? "" : "animate-pulse"}`}>
                            {opponent ? opponent : "Waiting..."}
                        </p>
                    </div>
                </div>
                :
                (!gameFinish ?
                    <Choice
                        setYourChoice={setYourChoice}
                        yourChoice={yourChoice}
                        round={round}
                        setRound={setRound}
                        opponentChoice={opponentChoice}
                        room={room}
                        setYourPoints={setYourPoints}
                        setOpponentPoints={setOpponentPoints}
                        setOpponentChoice={setOpponentChoice}
                        yourPoints={yourPoints}
                        opponentPoints={opponentPoints}
                        username={username}
                        opponent={opponent}
                        setGameFinish={setGameFinish}
                        setOutcome={setOutcome}
                        rpsWins={rpsWins}
                        setRpsWins={setRpsWins}
                    />
                    :
                    <div className="space-y-4 text-center">
                        <p className="text-2xl font-bold">{outcome}</p>
                        <table className="mx-auto text-lg">
                            <tbody>
                                <tr>
                                    <td className="font-bold">{username}</td>
                                    <td>:</td>
                                    <td>{opponent}</td>
                                </tr>
                                <tr>
                                    <td className="font-bold">{yourPoints}</td>
                                    <td>:</td>
                                    <td>{opponentPoints}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="flex flex-col gap-2">
                            <button onClick={playAgain} className="px-4 py-2 bg-slate-200 rounded">Play Again</button>
                            <button onClick={mainMenu} className="px-4 py-2 bg-slate-200 rounded">Main Menu</button>
                        </div>
                    </div>
                )
            }
        </div>
    )
}