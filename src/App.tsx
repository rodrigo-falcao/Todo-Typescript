import './App.css'
import { useEffect, useState } from 'react'
import { useTheme } from './ThemeContext.tsx'

interface TodoItem {
  id: string
  texto: string
  completado: boolean
}

function App() {
  const chaveTarefasMemoria = 'tarefas'

  const { theme, toggleTheme } = useTheme();
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [novoTodo, setnovoTodo] = useState<string>('')
  const [estaCarregado, setEstaCarregado] = useState<boolean>(false)
  
  const adicionarTarefa = (): void => {
    if (novoTodo !== '') {
      const newId = crypto.randomUUID()
      const novoTodoItem: TodoItem = {
        id: newId,
        texto: novoTodo,
        completado: false,
      };
      setTodos([...todos, novoTodoItem])
      setnovoTodo('')
    }
  }

  const marcarCompletado = (id: string): void => {
    const todosAtualizados = todos.map(todo => {
      if (todo.id === id) {
        return {
          ...todo,
          completado: !todo.completado
        }
      }
      return todo
    })
    setTodos(todosAtualizados)
  }

  const removerTarefa = (id: string): void => {
    const tarefasAtualizadas = todos.filter(todo => todo.id !== id)
    setTodos(tarefasAtualizadas)
  }

  const obterTaredasCompletas = (): TodoItem[] => {
    return todos.filter(todo => todo.completado)
  }

  useEffect(() => {
    if(estaCarregado) {
      localStorage.setItem(chaveTarefasMemoria, JSON.stringify(todos))
    }
  }, [todos, estaCarregado]);

  useEffect(() => {
    const tarefasDaMemoria = localStorage.getItem(chaveTarefasMemoria);
    if (tarefasDaMemoria) {
      setTodos(JSON.parse(tarefasDaMemoria));
    }
    setEstaCarregado(true);
  }, []);

  return (
    <>
      <div className={`App ${theme}`}>
        <div className={`container ${theme}`}>
          <h1>Lista de Tarefas {obterTaredasCompletas().length} / {todos.length}</h1>
          <div className="input-container">
            <input type="text" value={novoTodo} onChange={(e) => setnovoTodo(e.target.value)} placeholder="Digite uma tarefa" />
            <button onClick={() => adicionarTarefa()}>Adicionar Tarefa</button>
          </div>
          <ol>
            {
              todos.map((todo) => (
                <li key={todo.id}>
                  <input type="checkbox" checked={todo.completado} onChange={() => marcarCompletado(todo.id)} />
                  <span style={{ textDecoration: todo.completado ? 'line-through' : 'none' }}>{todo.texto}</span>
                  <button onClick={() => {
                    removerTarefa(todo.id)
                  }}>Remover</button>
                </li>
              ))
            }
          </ol>
          <div className='button-footer'>
            <button onClick={() => setTodos(todos.filter(todo => !todo.completado))}>
              Limpar tarefas Completas
            </button>
            <button onClick={toggleTheme}>
              Alterar para o tema {theme === 'light' ? 'dark' : 'light'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default App