import { useNavigate } from 'react-router-dom'
import { Context } from '../context'
import { useContext } from 'react'
import { toast } from 'react-toastify'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider, db } from '../firebase'
import { getDoc, doc, setDoc, updateDoc } from 'firebase/firestore'

export const Main = () => {

    const navigate = useNavigate()
    const { username, setUsername, rpsWins, setRpsWins, user } = useContext(Context)

    const signIn = () => {
        signInWithPopup(auth, provider)
            .then(async () => {
                let docRef = doc(db, "mp-rps-users", auth.currentUser.email)
                const docSnap = await getDoc(docRef)
                if (docSnap.exists()) {
                    await updateDoc(docRef, {
                        wins: Number(rpsWins) + docSnap.data().wins
                    })
                    setRpsWins(Number(rpsWins) + docSnap.data().wins)
                } else {
                    await setDoc(docRef, {
                        wins: Number(rpsWins)
                    })
                }
            })

    }

    const signOut = () => {
        auth.signOut().then(() => setRpsWins(0))
    }

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
            {user ?
                <div className='fixed top-0 left-0 m-3 flex gap-3 max-w-[50vw] sm:max-w-[40vw]'>
                    <img src={auth.currentUser.photoURL} className='rounded-[50%] h-[35px] w-35px' alt="profile-img" />
                    <div>
                        <p className='line-clamp-1'>{auth.currentUser.displayName}</p>
                        <p className=''>Wins: <span className='font-bold'>{rpsWins}</span></p>
                    </div>
                </div>
                :
                <button onClick={signIn} className='fixed top-0 left-0 px-4 py-2 flex items-center gap-2 bg-slate-300 m-3 rounded-md'>
                    <i className="fa fa-google" aria-hidden="true" />
                    Sign In
                </button>
            }
            {user ?
                <button onClick={signOut} className='fixed top-0 right-0 px-4 py-2 bg-slate-300 m-3 rounded-md'>Sign Out</button>
                :
                <p className='fixed top-0 right-0 px-4 py-2 text-lg'>Wins: <span className='font-bold'>{rpsWins}</span></p>
            }
            <h1 className="font-bold text-3xl">Multiplayer RPS</h1>
            <input maxLength={20} className="bg-slate-300 rounded px-4 py-2 outline-none" type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder='Nickname*' />
            <div className="space-y-2">
                <button onClick={joinRoom} className="bg-slate-200 rounded w-full p-2">Join Room</button>
                <button onClick={createRoom} className="bg-slate-200 rounded w-full p-2">Create Room</button>
            </div>
            <p className='fixed bottom-3 text-xs text-slate-400'>&copy;{new Date().getFullYear()} ZUMTHEZAZAKING</p>
        </div>
    )
}