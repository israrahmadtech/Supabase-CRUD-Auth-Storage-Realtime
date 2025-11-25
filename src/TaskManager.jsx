import { useEffect, useState } from "react"
import { supabase } from "./supabase-client";

function TaskManager({ session }) {
  const [allTasks, setAllTasks] = useState([])
  const [newTask, setNewTask] = useState({ title: "", description: "", image_url: "" })
  const [isUpdating, setIsUpdating] = useState(false)
  const [taskImage, setTaskImage] = useState(null)

  function handleChange(e) {
    setNewTask(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function fetchTasks() {
    try {
      const { data, error } = await supabase
        .from('tasks')                                // which table?
        .select('*')                                  // which column?
        .order('created_at', { ascending: true })     // formatting/sorting
      if (error) {
        console.error("Error while adding task: ", error.message);
        return
      }
      setAllTasks(data)
    }
    catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchTasks()
  }, [])

  // Real Time Subscription
  useEffect(() => {
    const channel = supabase.channel("tasks-channel")
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'tasks' }, payload => {
        console.log('New Task:', payload.new)
        setAllTasks(prev => [...prev, payload.new])
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  async function saveTask(e) {
    e.preventDefault()

    let imageUrl = null
    if (taskImage) {
      imageUrl = await uploadImage(taskImage)
    }

    if (isUpdating) {
      await updateTask()
      setIsUpdating(false)
      setNewTask({ title: "", description: "" })
    }
    else {
      await saveNewTask(imageUrl)
      setNewTask({ title: "", description: "" })
    }
  }

  async function uploadImage(image) {
    const imagePath = image.name + "-" + Date.now()
    const { error } = await supabase.storage.from('tasks-images').upload(imagePath, image)

    if (error) {
      console.log("Error uploading image:", error.message)
      return null
    }

    const { data } = await supabase.storage.from('tasks-images').getPublicUrl(imagePath)
    return data.publicUrl
  }

  // Update task
  async function updateTask() {
    await supabase
      .from('tasks')
      .update({ title: newTask?.title, description: newTask?.description })
      .eq('id', newTask?.id)
    // fetchTasks()
  }

  function moveDataToForm(task) {
    setNewTask(task)
    setIsUpdating(true)
  }

  // Save New Task
  async function saveNewTask(imageUrl) {
    const { error } = await supabase
      .from('tasks')
      .insert({ ...newTask, email: session.user.email, image_url: imageUrl })
      .maybeSingle()

    if (error) {
      alert("Task save nahi hua!", error.message);
      return;
    }

    // fetchTasks()
  }

  // Delete task
  async function deleteTask(id) {
    await supabase.from('tasks').delete().eq("id", id)
    // fetchTasks()
  }

  function handleFileChange(e) {
    if (e.target.files && e.target.files.length > 0) {
      setTaskImage(e.target.files[0])
    }
  }

  return (
    <div className='flex flex-col items-center'>
      <div className='border border-gray-500 hover:border-purple-500 p-5 w-full max-w-100'>
        <h1 className='text-2xl font-semibold mb-2 text-center'>Task Manager CRUD</h1>
        <form onSubmit={saveTask} action="">
          <input value={newTask?.title} onChange={handleChange} name="title" type="text" className='mb-2 border border-gray-500 bg-[#333] w-full outline-none focus:border-purple-500 py-1 px-3' placeholder='Task Title' />
          <textarea value={newTask?.description} onChange={handleChange} name="description" rows="2" className='mb-2 border border-gray-500 bg-[#333] w-full outline-none focus:border-purple-500 py-1 px-3' placeholder='Task Description' />
          <input onChange={handleFileChange} name="images" type="file" accept="image/*" />
          <button className='bg-black py-2 px-4 rounded-xl font-semibold cursor-pointer border border-transparent hover:border-purple-500 transition'>{isUpdating ? "Update Task" : "Add Task"}</button>
        </form>
      </div>
      <div className="mt-5 flex flex-col items-center">
        <button onClick={fetchTasks} className='mb-2 bg-black py-2 px-4 rounded-xl font-semibold cursor-pointer border border-transparent hover:border-purple-500 transition'>Refresh Tasks</button>
        <div className="flex flex-wrap gap-5 justify-center">
          {
            allTasks?.map(task => (
              <div key={task?.id} className="w-100 border border-gray-500 p-5 hover:border-purple-500">
                <h3 className='font-semibold text-lg'>{task?.id}</h3>
                <h3 className='font-semibold text-lg'>{task?.title}</h3>
                <p className='text-gray-300'>{task?.description}</p>
                <p className='text-purple-300'>
                  {task?.created_at && new Date(task.created_at).toLocaleString()}
                </p>
                <img src={task?.image_url} alt={task?.title} width="50px" />
                <div className='mt-3'>
                  <button onClick={() => moveDataToForm(task)} className='me-2 bg-black py-1 px-3 rounded-md font-semibold cursor-pointer border border-transparent hover:border-purple-500 transition'>Edit</button>
                  <button onClick={() => deleteTask(task?.id)} className='bg-black py-1 px-3 rounded-md font-semibold cursor-pointer border border-transparent hover:border-purple-500 transition'>Delete</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default TaskManager