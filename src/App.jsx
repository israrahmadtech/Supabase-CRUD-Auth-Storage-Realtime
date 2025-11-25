import { useEffect, useState } from "react"
import Authentication from "./authentication"
import TaskManager from "./TaskManager"
import { supabase } from "./supabase-client"

// 22 minutes

function App() {
  const [session, setSession] = useState(null)
  const fetchSession = async () => {
    const currentSession = await supabase.auth.getSession()
    console.log(currentSession);

    setSession(currentSession.data.session)
  }

  useEffect(() => {
    fetchSession()

    const {data: authListner} = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      authListner.subscription.unsubscribe()
    }
  }, [])

  async function handleLogout(){
    await supabase.auth.signOut()
  }
  return (
    <div className="p-10 w-full min-h-screen flex justify-center flex-col items-center bg-[#212121] text-white">
      {!session ?
          <Authentication />
        :
        <>
          <button onClick={handleLogout} className="mb-5 bg-black py-2 px-4 rounded-xl font-semibold cursor-pointer border border-transparent hover:border-purple-500 transition">Logout</button>
          <TaskManager session={session} />
        </>
      }
    </div>
  )
}

export default App