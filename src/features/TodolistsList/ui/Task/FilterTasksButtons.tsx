import React, { FC } from 'react'
import { Button } from '@mui/material'
import { changeTodolistFilter, FilterValues, TodolistDomain } from '../../model/todolists/todolists.reducer'
import { useAppDispatch } from '../../../../common/hooks/useAppDispatch'

type FilterTasksButtonsProps = {
  todolist: TodolistDomain
}

const FilterTasksButtons: FC<FilterTasksButtonsProps> = ({ todolist }) => {
  const dispatch = useAppDispatch()

  const handleFilterChange = (filter: FilterValues) => {
    dispatch(changeTodolistFilter({ todolistId: todolist.id, filter }))
  }

  return (
    <div>
      <Button
        variant={todolist.filter === 'all' ? 'outlined' : 'text'}
        onClick={() => handleFilterChange('all')}
        color={'inherit'}
      >
        All
      </Button>
      <Button
        variant={todolist.filter === 'active' ? 'outlined' : 'text'}
        onClick={() => handleFilterChange('active')}
        color={'primary'}
      >
        Active
      </Button>
      <Button
        variant={todolist.filter === 'completed' ? 'outlined' : 'text'}
        onClick={() => handleFilterChange('completed')}
        color={'secondary'}
      >
        Completed
      </Button>
    </div>
  )
}

export default FilterTasksButtons
