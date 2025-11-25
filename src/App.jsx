import { useEffect, useState } from "react"
import Authentication from "./Authentication"
import TaskManager from "./TaskManager"
import { supabase } from "./supabase-client"

// 22 minutes

function App() {
  const [session, setSession] = useState(null)
const [loading, setLoading] = useState(true)

const fetchSession = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  setSession(session)
  setLoading(false)
}

useEffect(() => {
  fetchSession()

  const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session)
  })

  return () => {
    authListener.subscription.unsubscribe()
  }
}, [])

  async function handleLogout(){
    const {error} = await supabase.auth.signOut({ scope: 'global' });
    if (error) console.log("Logout Error:", error.message);
    else alert("Logged out successfully");
  }
  return (
    <div className="p-10 w-full min-h-screen flex justify-center flex-col items-center bg-[#212121] text-white">
      {loading ? (
      <p>Loading...</p>
    ) : !session ? (
      <Authentication />
    ) : (
      <>
        <button onClick={handleLogout} className="mb-5 bg-black py-2 px-4 rounded-xl font-semibold cursor-pointer border border-transparent hover:border-purple-500 transition">Logout</button>
        <TaskManager session={session} />
      </>
    )}
    </div>
  )
}

export default App
