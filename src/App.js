import './App.css';
import React, { useRef } from 'react';
import { AgGridReact } from 'ag-grid-react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import DeleteIcon from '@mui/icons-material/Delete';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-material.css';

function App() {

  const [todo, setTodo] = React.useState({ description: '', priority: '', date: '' });
  const [todos, setTodos] = React.useState([]);
  const [tab, setTab] = React.useState('home');

  const [columnDefs] = React.useState([
    { field: 'description', sortable: true, filter: true, floatingFilter: true },
    {
      field: 'priority', sortable: true, filter: true, floatingFilter: true,
      cellStyle: params => params.value === 'High' ? { color: 'red' } : { color: 'black' }
    },
    { field: 'date', sortable: true, filter: true, floatingFilter: true },
  ]);

  const gridRef = useRef();

  const handleAddTodo = () => {
    setTodos([todo, ...todos]);
    setTodo({ description: '', priority: '', date: '' });
  };

  const handleDoneTodo = () => {
    if (gridRef.current.getSelectedNodes().length > 0) {
      setTodos(todos.filter((todo, index) =>
        index != gridRef.current.getSelectedNodes()[0].id));
    } else {
      alert('Please, select a row first');
    }
  };

  const onChangeFunction = (newDate) => {
    const dateString = dayjs(newDate).format('DD.MM.YYYY');
    setTodo({ ...todo, date: dateString });
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <div>
      <Tabs value={tab} onChange={handleTabChange}>
        <Tab label="Home" value="home" />
        <Tab label="Todos" value="todos" />
      </Tabs>
      {tab === 'home' && <h1>Welcome</h1>}
      {tab === 'todos' && <div>
        <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
          <TextField
            label="Description"
            variant="standard"
            name='description'
            value={todo.description}
            onChange={e => setTodo({ ...todo, description: e.target.value })}
          />
          <TextField
            label="Priority"
            variant="standard"
            name='priority'
            value={todo.priority}
            onChange={e => setTodo({ ...todo, priority: e.target.value })}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Date"
              date={todo.date}
              onChange={onChangeFunction}
              format="DD.MM.YYYY"
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <Button onClick={handleAddTodo} variant="outlined">Add</Button>
          <Button onClick={handleDoneTodo} variant="outlined" color="error" endIcon={<DeleteIcon />}>Delete</Button>
        </Stack>
        <div className="ag-theme-material" style={{ height: 600, width: 600, margin: 'auto' }}>
          <AgGridReact
            ref={gridRef}
            onGridReady={params => gridRef.current = params.api}
            rowSelection='single'
            rowData={todos}
            columnDefs={columnDefs}
            animateRows={true}
          />
        </div>
      </div>}
    </div>
  );
}

export default App;
