/* eslint-disable default-case */
import Rock from '../../assets/rock.png'
import Scissors from '../../assets/scissors.png'
import Paper from '../../assets/paper.png'
import { useState, useContext, useEffect } from 'react';
import { Context } from '../../context';
import { updateDoc, doc } from 'firebase/firestore';
import { db, auth } from '../../firebase';

const Choice = props => {

    const imgStyle = "w-[75px] sm:w-[100px] cursor-pointer transition-all"
    const {
        setYourChoice,
        yourChoice,
        opponentChoice,
        setOpponentChoice,
        room,
        round,
        setRound,
        setYourPoints,
        setOpponentPoints,
        yourPoints,
        opponentPoints,
        username,
        opponent,
        setGameFinish,
        setOutcome,
        rpsWins,
        setRpsWins
    } = props
    const { socket, user } = useContext(Context)

    const [choice, setChoice] = useState("")
    const [ready, setReady] = useState(false)
    const [result, setResult] = useState("")

    useEffect(() => {
        if (yourChoice && opponentChoice) {
            setReady(true)
            switch (yourChoice) {
                case "paper":
                    if (opponentChoice === "paper") {
                        setResult("Tie")
                    } else if (opponentChoice === "rock") {
                        setResult("You Win")
                        setYourPoints(Number(yourPoints) + 1)
                    } else {
                        setResult("You Lose")
                        setOpponentPoints(opponentPoints + 1)
                    }
                    break;

                case "rock":
                    if (opponentChoice === "rock") {
                        setResult("Tie")
                    } else if (opponentChoice === "scissors") {
                        setResult("You Win")
                        setYourPoints(Number(yourPoints) + 1)
                    } else {
                        setResult("You Lose")
                        setOpponentPoints(Number(opponentPoints) + 1)
                    }
                    break;

                case "scissors":
                    if (opponentChoice === "scissors") {
                        setResult("Tie")
                    } else if (opponentChoice === "paper") {
                        setResult("You Win")
                        setYourPoints(Number(yourPoints) + 1)
                    } else {
                        setResult("You Lose")
                        setOpponentPoints(Number(opponentPoints) + 1)
                    }
                    break;
            }
            const timeout = setTimeout(async () => {
                setChoice("")
                setYourChoice("")
                setOpponentChoice("")
                setReady(false)
                setResult("")
                setRound(round + 1)
                if (yourPoints + 1 >= 3 || opponentPoints + 1 >= 3) {
                    setGameFinish(true)
                    clearTimeout(timeout)
                    if (yourPoints + 1 >= 3) {
                        setOutcome("You Win")
                        setRpsWins(Number(rpsWins) + 1)
                        if (user) {
                            await updateDoc(doc(db, "mp-rps-users", auth.currentUser.email), {
                                wins: Number(rpsWins) + 1
                            })
                        }
                    } else {
                        setOutcome("You Lose")
                    }
                }
            }, 3500)
        }
    }, [yourChoice, opponentChoice])

    const choose = e => {
        setChoice(e.target.alt)
    }

    const confirmChoice = () => {
        setYourChoice(choice)
        socket.emit("make_choice", { choice, room: room.id + "/#/" + room.name })
    }

    return (
        <div>
            <h1 className='text-center font-bold text-xl'>Round {round}</h1>
            {!ready ?
                <div className='space-y-8'>
                    <p className="font-bold text-center text-xl uppercase ">
                        MAKE YOUR CHOICE
                    </p>
                    <div className="flex items-center justify-between gap-6">
                        <img onClick={e => choose(e)} className={`${imgStyle} ${choice === "rock" ? "scale-125" : "hover:scale-[1.1]"}`} src={Rock} alt="rock" />
                        <img onClick={e => choose(e)} className={`${imgStyle} ${choice === "paper" ? "scale-125" : "hover:scale-[1.1]"}`} src={Paper} alt="paper" />
                        <img onClick={e => choose(e)} className={`${imgStyle} ${choice === "scissors" ? "scale-125" : "hover:scale-[1.1]"}`} src={Scissors} alt="scissors" />
                    </div>
                    <div className={`${choice ? "" : "invisible"} text-center`}>
                        <p className={` font-bold text-xl capitalize`}>{choice ? choice : "Sample Text"}</p>
                        {!yourChoice ?
                            <button onClick={confirmChoice} className='bg-slate-300 rounded-md px-4 py-2 mt-5'>Confirm</button>
                            :
                            <p className='animate-pulse'>Waiting for opponent...</p>
                        }
                    </div>
                </div>
                :
                <div className='space-y-4'>
                    <p className='font-bold text-2xl text-center'>{result}</p>
                    <div className='flex gap-8 items-center'>
                        <div className='flex flex-col gap-3 text-lg items-center text-center'>
                            <p className='text-lg font-bold'>{username}</p>
                            <img
                                src={yourChoice === "paper" ? Paper : (yourChoice === "rock" ? Rock : Scissors)}
                                className={`${result === "Tie" ? "" : (result === "You Win" ? "" : "grayscale")} w-[75px] sm:w-[100px]`}
                                alt="your choice"
                            />
                        </div>
                        <div className='flex flex-col gap-3 text-lg items-center text-center'>
                            <p className='text-lg'>{opponent}</p>
                            <img
                                src={opponentChoice === "paper" ? Paper : (opponentChoice === "rock" ? Rock : Scissors)}
                                className={`${result === "Tie" ? "" : (result === "You Lose" ? "" : "grayscale")} w-[75px] sm:w-[100px]`}
                                alt="opponent choice"
                            />
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}; export default Choice;