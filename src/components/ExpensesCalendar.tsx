import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography, Button, TextField, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { addExpense, fetchExpensesByDate } from '../api/api';

// Helper functions
const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
const getStartingDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const CalendarWithExpenses = () => {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear] = useState<number>(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [expense, setExpense] = useState<string>(''); // Input for today's expense
  const [description, setDescription] = useState<string>('');
  const [totalExpense, setTotalExpense] = useState<number>(0);
  const [, setErrorMessage] = useState<string | null>(null); // Error message for no expenses

  const today = new Date().getDate();
  const todayMonth = new Date().getMonth();
  const todayYear = new Date().getFullYear();
  const isToday = (date: number) => selectedYear === todayYear && selectedMonth === todayMonth && date === today;

  const handleMonthChange = (_event: React.SyntheticEvent, newMonth: number) => {
    setSelectedMonth(newMonth);
    setSelectedDate(null); // Reset the selected date when month changes
    setErrorMessage(null); // Clear error message on month change
  };

  const handleDateClick = async (date: number) => {
    setSelectedDate(date);
  
    try {
      const response = await fetchExpensesByDate(`${selectedYear}-${selectedMonth + 1}-${date}`);
      if (response.expenses.length === 0) {
        setErrorMessage("No expenses found for this date. Looks like you were careful with your spending!");
        setExpenses([]);
        setTotalExpense(0);
      } else {
        setExpenses(response.expenses);
        setTotalExpense(response.total);
        setErrorMessage(null);
      }
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };
  
  const handleExpenseSubmit = async () => {
    try {
      const expenseData = {
        date: `${selectedYear}-${selectedMonth + 1}-${today}`,
        amount: expense,
        description,
      };
  
      const response = await addExpense(expenseData);
      setExpenses([...expenses, response.expense]);
      setTotalExpense(response.total);
      setExpense('');
      setDescription('');
    } catch (error) {
      console.error('Error submitting expense:', error);
    }
  };

  const daysInSelectedMonth = getDaysInMonth(selectedYear, selectedMonth);
  const startDay = getStartingDayOfMonth(selectedYear, selectedMonth);
  const daysArray = Array.from({ length: daysInSelectedMonth }, (_, index) => index + 1);

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', p: 2 }}>
      {/* Month-Year Tabs */}
      <Tabs
        value={selectedMonth}
        onChange={handleMonthChange}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable calendar months"
      >
        {months.map((month, index) => (
          <Tab key={index} label={`${month} ${selectedYear}`} />
        ))}
      </Tabs>

      {/* Calendar Table for Days */}
      <Typography variant="h6" sx={{ mt: 2 }}>
        {months[selectedMonth]} {selectedYear}
      </Typography>
      <Table sx={{ mt: 2, border: '1px solid #ccc' }}>
        <TableHead>
          <TableRow>
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day, index) => (
              <TableCell key={index} align="center" sx={{ bgcolor: '#f0f0f0', fontWeight: 'bold' }}>
                {day}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            {/* Empty cells before the first day of the month */}
            {[...Array(startDay)].map((_, index) => (
              <TableCell key={index}></TableCell>
            ))}
            {daysArray.slice(0, 7 - startDay).map((date) => (
              <TableCell
                key={date}
                align="center"
                sx={{
                  cursor: 'pointer',
                  bgcolor: selectedDate === date ? 'primary.main' : isToday(date) ? 'yellow' : 'inherit',
                  color: selectedDate === date || isToday(date) ? '#fff' : 'inherit',
                  // borderRadius: isToday(date) ? '50%' : 'none',
                }}
                onClick={() => handleDateClick(date)}
              >
                {date}
              </TableCell>
            ))}
          </TableRow>
          {Array.from({ length: Math.ceil((daysArray.length - (7 - startDay)) / 7) }, (_, rowIndex) => (
            <TableRow key={rowIndex}>
              {daysArray.slice((7 - startDay) + rowIndex * 7, (7 - startDay) + (rowIndex + 1) * 7).map((date) => (
                <TableCell
                  key={date}
                  align="center"
                  sx={{
                    cursor: 'pointer',
                    bgcolor: selectedDate === date ? 'primary.main' : isToday(date) ? 'green' : 'inherit',
                    color: selectedDate === date || isToday(date) ? '#fff' : 'inherit',
                    // borderRadius: isToday(date) ? '50%' : 'none',
                  }}
                  onClick={() => handleDateClick(date)}
                >
                  {date}
                  {/* {totalExpense} */}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Display Expenses for the Selected Date */}
      {selectedDate && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Expenses on {selectedDate}</Typography>
          {expenses.length > 0 ? (
            expenses.map((exp, idx) => (
              <Typography key={idx} variant="body1">{exp.description}: Rs {exp.amount}</Typography>
            ))
          ) : (
            <Typography variant="body1">No expenses found for this date. Looks like you were careful with your spending!</Typography>
          )}
          <Typography variant="h6" sx={{ mt: 2 }}>Total: Rs {totalExpense}</Typography>
        </Box>
      )}

      {/* Input form for today's expenses */}
      {isToday(today) && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Add Expense for Today</Typography>
          <TextField
            label="Amount (Rs)"
            value={expense}
            onChange={(e) => setExpense(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Button variant="contained" onClick={handleExpenseSubmit} sx={{ mt: 2 }}>
            Add Expense
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default CalendarWithExpenses;
