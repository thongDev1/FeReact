import { useState, type SVGProps } from 'react'
import * as Checkbox from '@radix-ui/react-checkbox'
import { useAutoAnimate } from '@formkit/auto-animate/react'

import { api } from '@/utils/client/api'

/**
 * QUESTION 3:
 * -----------
 * A todo has 2 statuses: "pending" and "completed"
 *  - "pending" state is represented by an unchecked checkbox
 *  - "completed" state is represented by a checked checkbox, darker background,
 *    and a line-through text
 *
 * We have 2 backend apis:
 *  - (1) `api.todo.getAll`       -> a query to get all todos
 *  - (2) `api.todoStatus.update` -> a mutation to update a todo's status
 *
 * Example usage for (1) is right below inside the TodoList component. For (2),
 * you can find similar usage (`api.todo.create`) in src/client/components/CreateTodoForm.tsx
 *
 * If you use VSCode as your editor , you should have intellisense for the apis'
 * input. If not, you can find their signatures in:
 *  - (1) src/server/api/routers/todo-router.ts
 *  - (2) src/server/api/routers/todo-status-router.ts
 *
 * Your tasks are:
 *  - Use TRPC to connect the todos' statuses to the backend apis
 *  - Style each todo item to reflect its status base on the design on Figma
 *
 * Documentation references:
 *  - https://trpc.io/docs/client/react/useQuery
 *  - https://trpc.io/docs/client/react/useMutation
 *
 *
 *
 *
 *
 * QUESTION 4:
 * -----------
 * Implement UI to delete a todo. The UI should look like the design on Figma
 *
 * The backend api to delete a todo is `api.todo.delete`. You can find the api
 * signature in src/server/api/routers/todo-router.ts
 *
 * NOTES:
 *  - Use the XMarkIcon component below for the delete icon button. Note that
 *  the icon button should be accessible
 *  - deleted todo should be removed from the UI without page refresh
 *
 * Documentation references:
 *  - https://www.sarasoueidan.com/blog/accessible-icon-buttons
 *
 *
 *
 *
 *
 * QUESTION 5:
 * -----------
 * Animate your todo list using @formkit/auto-animate package
 *
 * Documentation references:
 *  - https://auto-animate.formkit.com
 */

export const TodoList = () => {
  const apiContext = api.useContext()

  const [parent] = useAutoAnimate()

  const [status, setStatus] = useState<'all' | 'completed' | 'pending'>('all')

  const { data: todos = [] } = api.todo.getAll.useQuery({
    statuses: status == 'all' ? ['completed', 'pending'] : [status],
  })

  const { mutate: deleteToDo } = api.todo.delete.useMutation({
    onSuccess: () => {
      apiContext.todo.getAll.refetch()
    },
  })

  const { mutate: update } = api.todoStatus.update.useMutation({
    onSuccess: () => {
      apiContext.todo.getAll.refetch()
    },
  })
  const hanldeUpdate = (todo: { id: number; status: string }) => {
    update({
      todoId: todo.id,
      status: todo.status == 'pending' ? 'completed' : 'pending',
    })
  }
  return (
    <>
      <div className="mb-10">
        <button
          className={`mr-3 rounded-full  px-[24px] py-[12px] text-sm ${
            status == 'all'
              ? 'bg-[#334155] text-white'
              : 'border border-[#E2E8F0] text-[#334155]'
          }`}
          type="button"
          onClick={() => setStatus('all')}
        >
          All
        </button>
        <button
          className={`mr-3 rounded-full  px-[24px] py-[12px] text-sm ${
            status == 'pending'
              ? 'bg-[#334155] text-white'
              : 'border border-[#E2E8F0] text-[#334155]'
          }`}
          type="button"
          onClick={() => setStatus('pending')}
        >
          Pending
        </button>
        <button
          className={`mr-3 rounded-full  px-[24px] py-[12px] text-sm ${
            status == 'completed'
              ? 'bg-[#334155] text-white'
              : 'border border-[#E2E8F0] text-[#334155]'
          }`}
          type="button"
          onClick={() => setStatus('completed')}
        >
          Completed
        </button>
      </div>
      <ul className="grid grid-cols-1 gap-y-3" ref={parent}>
        {todos.map((todo) => (
          <li key={todo.id}>
            <div
              className={`flex items-center rounded-12 border border-gray-200 px-4 py-3 shadow-sm ${
                todo.status == 'completed' && 'bg-[#F8FAFC]'
              }`}
            >
              <Checkbox.Root
                onCheckedChange={() => hanldeUpdate(todo)}
                id={String(todo.id)}
                className="flex h-6 w-6 items-center justify-center rounded-6 border border-gray-300 focus:border-gray-700 focus:outline-none data-[state=checked]:border-gray-700 data-[state=checked]:bg-gray-700"
                checked={todo.status == 'completed'}
              >
                <Checkbox.Indicator>
                  <CheckIcon className="h-4 w-4 text-white" />
                </Checkbox.Indicator>
              </Checkbox.Root>

              <label
                className={`block pl-3 font-medium ${
                  todo.status == 'completed' && 'line-through'
                }`}
                htmlFor={String(todo.id)}
              >
                {todo.body}
              </label>
              <button
                onClick={() => {
                  deleteToDo({ id: todo.id })
                }}
                className="ml-auto"
              >
                <XMarkIcon className="w-6"></XMarkIcon>
              </button>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}

const XMarkIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  )
}

const CheckIcon = (props: SVGProps<SVGSVGElement>) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  )
}
