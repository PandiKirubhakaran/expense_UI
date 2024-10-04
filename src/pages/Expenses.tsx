import { Box } from "@mui/material";
import React from "react";
// import ScrollableCalendar from "../components/ScrollableCalendar";
// import ExpenseCalendar from "../components/ExpensesCalendar";
// import ScrollableCalendar from "../components/ScrollableCalendar";
import CalendarWithExpenses from "../components/ExpensesCalendar";

const Expenses: React.FC = () => {
  return (
    <Box>
      {/* <ScrollableCalendar /> */}
      {/* <ScrollableCalendar/> */}
      {/* <ExpenseCalendar/> */}
      <CalendarWithExpenses/>
    </Box>
  );
};

export default Expenses;
