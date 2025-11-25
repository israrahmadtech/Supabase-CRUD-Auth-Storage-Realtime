import { useState } from "react"
import { supabase } from "./supabase-client";

function Authentication() {
    const [newUser, setNewUser] = useState({ email: "", password: "" })
    const [isRegister, setIsRegister] = useState(false)
    function handleChange(e) {
        setNewUser(prev => ({...prev, [e.target.name]: e.target.value}))
    }

    async function handleSubmit(e){
        e.preventDefault()
        if(!newUser.email || !newUser.password) return

        if(isRegister){
            const {error: registerError} = await supabase.auth.signUp(newUser)
            if(registerError){
                console.error("Error registering:", registerError.message)
                return
            }
        }
        else{
            const {error: loginError} = await supabase.auth.signInWithPassword(newUser)
            if(loginError){
                console.error("Error login:", loginError.message)
            }
        }
    }
    
    return (
        <div className="w-100 border border-gray-500 hover:border-purple-500 mb-10 p-5">
            <form onSubmit={handleSubmit} action="">
                <input value={newUser?.email} onChange={handleChange} name="email" type="email" className='mb-2 border border-gray-500 bg-[#333] w-full outline-none focus:border-purple-500 py-1 px-3' placeholder='Email' />
                <input value={newUser?.password} onChange={handleChange} name="password" type="password" className='mb-2 border border-gray-500 bg-[#333] w-full outline-none focus:border-purple-500 py-1 px-3' placeholder='Password' />
                <div className="flex justify-between mt-3">
                    <button type="submit" className='bg-black py-2 px-4 rounded-xl font-semibold cursor-pointer border border-transparent hover:border-purple-500 transition'>
                        {isRegister ? "Register" : "Login"}</button>
                    <button onClick={() => setIsRegister(!isRegister)} type="button" className="bg-black py-2 px-4 rounded-xl font-semibold cursor-pointer border border-transparent hover:border-purple-500 transition">
                        {isRegister ? "Switch to Login" : "Switch to Register"}</button>
                </div>
            </form>
        </div>
    )
}

export default Authentication