window.onload=function(){
  loadTasks()
}

function loadTasks(){
  const tasks=JSON.parse(localStorage.getItem('tasks'))||[]

  tasks.forEach(task => {
    createListItem(task)  
  });
}


const addbtn=document.getElementById('add-todo')
addbtn.addEventListener('click',()=>{
  const input=document.getElementById('todo-input')
  const task=input.value.trim()

  if(task===""){
    alert("Please enter a task")
    return
  }
  
  createListItem(task)
  saveTask(task)
  input.value=""

})


function createListItem(task){
  const li=document.createElement('li')
  li.textContent=task

  const btn=document.createElement('button')
  btn.textContent="❌"

  btn.onclick=()=>{
    li.remove()
    deleteTask(task)
  }

  li.appendChild(btn)

  document.getElementById('todo-list').appendChild(li)

}

function saveTask(task){
  const tasks=JSON.parse(localStorage.getItem('tasks'))||[]
  tasks.push(task)
  localStorage.setItem('tasks',JSON.stringify(tasks))
}

function deleteTask(task){
  const tasks=JSON.parse(localStorage.getItem('tasks'))||[]
  const updatedTasks=tasks.filter(t=>t!==task)  
  localStorage.setItem('tasks',JSON.stringify(updatedTasks))

}