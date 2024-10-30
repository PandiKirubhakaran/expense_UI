import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Grid,
  TextField,
  Button,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Box,
} from "@mui/material";
// import { Bar, Doughnut } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { API_URL } from "../api/api";

// Register the chart.js components to prevent errors
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

// Define the types for the dashboard data structure
interface CapitalLog {
  amount: number;
  description: string;
  date: string;
}

interface DashboardData {
  totalCapital: number;
  totalExpenses: number;
  dailyExpenses: Record<string, number>;
  capitalLogs: CapitalLog[];
}

const Dashboard: React.FC = () => {
  const [capitalAmount, setCapitalAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const barChartRef = useRef<ChartJS | null>(null); // Ref for Bar chart
  const doughnutChartRef = useRef<ChartJS | null>(null); // Ref for Doughnut chart

  // Fetch dashboard data from the server
  const fetchDashboardData = async () => {
    try {
      const response = await axios.get( `${API_URL}dashboard`, {
        params: {
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear(),
        },
        withCredentials: true, // Include credentials in the request
      });
      setDashboardData(response.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  // Handle adding capital to the server
  const handleAddCapital = async () => {
    try {
      const response = await axios.post(
        `${API_URL}capital`,
        {
          amount: capitalAmount,
          description,
        },
        {
          withCredentials: true, // Include credentials in the request
        }
      );

      setDashboardData((prev) =>
        prev
          ? {
              ...prev,
              totalCapital: response.data.capital,
              capitalLogs: response.data.logs,
            }
          : null
      );

      setCapitalAmount("");
      setDescription("");
    } catch (error) {
      console.error("Error adding capital:", error);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Clean up the chart instances on component unmount
  useEffect(() => {
    return () => {
      if (barChartRef.current) {
        barChartRef.current.destroy();
      }
      if (doughnutChartRef.current) {
        doughnutChartRef.current.destroy();
      }
    };
  }, []);

  // Display loading state while data is being fetched
  if (!dashboardData) return <div>Loading...</div>;

  // Prepare data for the Bar chart
  // const barData = {
  //   labels: Object.keys(dashboardData.dailyExpenses),
  //   datasets: [
  //     {
  //       label: "Daily Expenses",
  //       backgroundColor: "rgba(75,192,192,1)",
  //       borderColor: "rgba(75,192,192,1)",
  //       data: Object.values(dashboardData.dailyExpenses),
  //     },
  //   ],
  // };

  // // Prepare data for the Doughnut chart
  // const doughnutData = {
  //   labels: ["Total Capital", "Total Expenses"],
  //   datasets: [
  //     {
  //       backgroundColor: ["#36A2EB", "#FF6384"],
  //       data: [dashboardData.totalCapital, dashboardData.totalExpenses],
  //     },
  //   ],
  // };

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Amount"
            value={capitalAmount}
            onChange={(e) => setCapitalAmount(e.target.value)}
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
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddCapital}
            fullWidth
          >
            Add Capital
          </Button>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="h6">Capital Overview</Typography>
          <Typography variant="body1">
            Total Capital: {dashboardData.totalCapital}
          </Typography>
          <Typography variant="body1">
            Total Expenses: {dashboardData.totalExpenses}
          </Typography>
        </Grid>
        {/* <Grid item xs={12} sm={6}>
  <Paper sx={{ height: "300px" }}>
    <Bar
      ref={barChartRef}  // Directly use the ref
      data={barData}
    />
  </Paper>
</Grid> */}

{/* <Grid item xs={12} sm={6}>
  <Paper sx={{ height: "300px" }}>
    <Doughnut
      ref={doughnutChartRef}  // Directly use the ref
      data={doughnutData}
    />
  </Paper>
</Grid> */}

        <Grid item xs={12}>
          <Typography variant="h6">Capital Log</Typography>
          <Paper>
            <Box sx={{ maxHeight: "300px", overflowY: "auto",mb:4 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Amount</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dashboardData.capitalLogs.map((log, index) => (
                    <TableRow key={index}>
                      <TableCell>{log.amount}</TableCell>
                      <TableCell>{log.description}</TableCell>
                      <TableCell>
                        {new Date(log.date).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
