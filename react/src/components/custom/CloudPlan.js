//import * as React from "react";
import React, { useEffect } from 'react';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Typography,
} from '@mui/material';
import InsertChartIcon from '@mui/icons-material/InsertChartOutlined';
import CloudInfo from './cloud/CloudInfo';
import { api } from '../../api/base';

export const getPurchaseList = async () => {
  let response = await api.get('/purchase');
  return response;
};

export const TasksProgress = (props) => (
  <Card sx={{ height: '100%' }} {...props}>
    <CardContent>
      <Grid container spacing={3} sx={{ justifyContent: 'space-between' }}>
        <Grid item>
          <Typography color="textSecondary" gutterBottom variant="overline">
            YOUR CLOUD STORAGE USAGE
          </Typography>
          <Typography color="textPrimary" variant="h4">
            75.5%
          </Typography>
        </Grid>
        <Grid item>
          <Avatar
            sx={{
              backgroundColor: 'warning.main',
              height: 56,
              width: 56,
            }}
          >
            <InsertChartIcon />
          </Avatar>
        </Grid>
      </Grid>
      <Box sx={{ pt: 3 }}>
        <LinearProgress value={75.5} variant="determinate" />
      </Box>
    </CardContent>
  </Card>
);

const CloudPlan = () => {
  useEffect(() => {
    const getPurchase = async () => {
      await getPurchaseList();
      // if(data.error) {
      //     console.log("Error occured while invoking getImageTree api")
      //     //alert("Error occured while getting the tree")
      // } else {
      //     store.dispatch({type: "set_experiment_data", content: data.data});
      // }
    };
    getPurchase();
  }, []);

  return (
    <>
      <TasksProgress />
      <CloudInfo />
    </>
  );
};

export default CloudPlan;
