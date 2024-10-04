import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// Helper function to get the number of days in a month
const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

const ScrollableCalendar = () => {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [expenses, setExpenses] = useState<any[]>([]); // List of expenses for the selected day
  const [expense, setExpense] = useState<string>(''); // Input for current day's expense
  const [description, setDescription] = useState<string>(''); // Description of the expense
  const [totalExpense, setTotalExpense] = useState<number>(0); // Total expenses for the day

  const today = new Date().getDate(); // Get current date
  const isToday = (date: number) => selectedYear === new Date().getFullYear() && selectedMonth === new Date().getMonth() && date === today;

  // Handling month/year change
  const handleMonthChange = (event: React.SyntheticEvent, newMonth: number) => {
    setSelectedMonth(newMonth);
    setSelectedDate(null); // Reset the selected date when month is changed
  };

  // Handling date click (fetch expenses for the clicked day)
  const handleDateClick = async (date: number) => {
    setSelectedDate(date);
    try {
      const response = await axios.get(`/api/expenses/${selectedYear}-${selectedMonth + 1}-${date}`);
      setExpenses(response.data.expenses);
      setTotalExpense(response.data.total);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  // Handle form submission for today's expenses
  const handleExpenseSubmit = async () => {
    try {
      const response = await axios.post('/api/expenses', {
        date: `${selectedYear}-${selectedMonth + 1}-${today}`,
        amount: expense,
        description: description,
      });
      setExpenses([...expenses, response.data.expense]); // Add new expense to the list
      setTotalExpense(response.data.total); // Update total expense
      setExpense('');
      setDescription('');
    } catch (error) {
      console.error('Error submitting expense:', error);
    }
  };

  const daysInSelectedMonth = getDaysInMonth(selectedYear, selectedMonth);

  return (
    <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', p: 2 }}>
      {/* Month-Year Tabs */}
      <Tabs
        value={selectedMonth}
        onChange={handleMonthChange}
        variant="scrollable"
        scrollButtons
        aria-label="scrollable calendar months"
        sx={{
          [`& .${tabsClasses.scrollButtons}`]: {
            '&.Mui-disabled': { opacity: 0.3 },
          },
        }}
      >
        {months.map((month, index) => (
          <Tab key={index} label={`${month} ${selectedYear}`} />
        ))}
      </Tabs>

      {/* Display days in selected month */}
      <Typography variant="h6" sx={{ mt: 2 }}>Dates in {months[selectedMonth]} {selectedYear}</Typography>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {Array.from({ length: daysInSelectedMonth }, (_, index) => index + 1).map((date) => (
          <Grid item key={date}>
            <Box
              onClick={() => handleDateClick(date)}
              sx={{
                cursor: 'pointer',
                bgcolor: selectedDate === date ? 'primary.main' : 'background.default',
                color: selectedDate === date ? '#fff' : 'text.primary',
                p: 2,
                borderRadius: '4px',
                textAlign: 'center',
                width: '50px',
              }}
            >
              {date}
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Display today's expenses */}
      {selectedDate && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">Expenses on {selectedDate}</Typography>
          {expenses.map((exp, idx) => (
            <Typography key={idx} variant="body1">{exp.description}: Rs {exp.amount}</Typography>
          ))}
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

export default ScrollableCalendar;
