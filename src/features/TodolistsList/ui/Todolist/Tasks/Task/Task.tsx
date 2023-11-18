import React, { ChangeEvent, FC } from 'react'
import { Checkbox, IconButton } from '@mui/material'
import { EditableSpan } from '../../../../../../common/components/EditableSpan/EditableSpan'
import { Delete } from '@mui/icons-material'
import { TaskStatuses } from '../../../../../../common/enums/enums'
import { TaskType } from '../../../../api/tasks/tasks.types'
import { useActions } from '../../../../../../common/hooks/useActions'
import { tasksThunk } from '../../../../model/Task/tasks.reducer'
import s from './Task.module.css'

type Props = {
  task: TaskType
  todolistId: string
}

export const Task: FC<Props> = React.memo(({ task, todolistId }) => {
  const { removeTask, updateTask } = useActions(tasksThunk)

  const onClickHandler = () => removeTask({ taskId: task.id, todolistId })

  const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const newIsDoneValue = e.currentTarget.checked
    const status = newIsDoneValue ? TaskStatuses.Completed : TaskStatuses.New
    updateTask({ taskId: task.id, domainModel: { status }, todolistId })
  }

  const onTitleChangeHandler = (title: string) => {
    updateTask({ taskId: task.id, domainModel: { title }, todolistId })
  }

  return (
    <div key={task.id} className={task.status === TaskStatuses.Completed ? s.isDone : ''}>
      <Checkbox checked={task.status === TaskStatuses.Completed} color="primary" onChange={onChangeHandler} />
      <EditableSpan value={task.title} onChange={onTitleChangeHandler} />
      <IconButton onClick={onClickHandler}>
        <Delete />
      </IconButton>
    </div>
  )
})
