import Task from "../model/task.js";

export async function getTasks(req, res){
    const cacheTasks = await client.get('tasks');
    if(cacheTasks){
        console.log('Cache hit')
        res.status(200).json(JSON.parse(cacheTasks));
        return;
    }else{
        console.log('cache miss');
        const tasks = await Task.findAll();
        if(tasks.length != 0){
            await client.set('tasks', JSON.stringify(tasks),{
                EX: 3600
            });
        }
        res.status(200).json(tasks);
    }
}

export async function findTask(req, res){
    const id = req.params.id;
    const task = await Task.findByPk(id);
    if(!task){
        return res.status(404).json("Tarefa não encontrada");
    }
    res.status(200).json(task);
}

export async function deleteTask(req,res){
    const id = req.params.id;
    const task = await Task.findByPk(id);
    if(!task){
        return res.status(404).json("Tarefa não encontrada");
    }
    await task.destroy();
    res.status(200).json(task);
}

export async function updateTask(req,res){
    const id = req.params.id;
    const task = await Task.findByPk(id);
    if(!task){
        return res.status(404).json("Tarefa não encontrada");
    }
    try{
        task.set(req.body);
        await task.save();
        res.status(200).json(task);
    }catch(err){
        console.log(err);
        res.status(400).json("Falha ao atualizar");
    }
}

export async function createTask(req,res){
    try{
      const newTask = await Task.create(req.body);
      res.status(201).json(newTask);
    }catch(err){
      console.log(err);
      res.status(400).json("Erro ao criar tarefa");
    }
  }