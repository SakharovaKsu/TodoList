import React, { ChangeEvent, FC, useCallback } from 'react'
import { Checkbox, IconButton } from '@mui/material'
import { EditableSpan } from '../../../../common/components/EditableSpan/EditableSpan'
import { Delete } from '@mui/icons-material'
import { TaskStatuses } from '../../../../common/enums/enums'
import { TaskType } from '../../todolistsApi'

type TaskPropsType = {
  task: TaskType
  todolistId: string
  changeTaskStatus: (id: string, status: TaskStatuses, todolistId: string) => void
  changeTaskTitle: (taskId: string, newTitle: string, todolistId: string) => void
  removeTask: (taskId: string, todolistId: string) => void
}
export const Task: FC<TaskPropsType> = React.memo(
  ({ task, todolistId, changeTaskStatus, changeTaskTitle, removeTask }) => {
    const onClickHandler = useCallback(() => removeTask(task.id, todolistId), [task.id, todolistId])

    const onChangeHandler = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        let newIsDoneValue = e.currentTarget.checked
        changeTaskStatus(task.id, newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New, todolistId)
      },
      [task.id, todolistId],
    )

    const onTitleChangeHandler = useCallback(
      (newValue: string) => {
        changeTaskTitle(task.id, newValue, todolistId)
      },
      [task.id, todolistId],
    )

    return (
      <div key={task.id} className={task.status === TaskStatuses.Completed ? 'is-done' : ''}>
        <Checkbox checked={task.status === TaskStatuses.Completed} color="primary" onChange={onChangeHandler} />

        <EditableSpan value={task.title} onChange={onTitleChangeHandler} />
        <IconButton onClick={onClickHandler}>
          <Delete />
        </IconButton>
      </div>
    )
  },
)
