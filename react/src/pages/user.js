import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


import {TasksProgress} from '../components/custom/CloudPlan'
import CloudInfo from '../components/custom/cloud/CloudInfo'
import CloudChart from '../components/custom/cloud/CloudChart'

import {
  Box,
  Button,
  Card,
  CardHeader,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@mui/material';
import {AccountProfile} from './user/account-profile'

const UserPage = (props) => {
	return (
		<div style={{padding: "30px"}}>

			<TasksProgress style={{height: "auto", backgroundColor: "rgb(221, 221, 221)"}} />
			<CloudInfo style={{backgroundColor: "rgb(221, 221, 221)"}}/>

			<Card {...props} style={{backgroundColor: "rgb(221, 221, 221)"}}>
		    	<CardHeader
			      subtitle={`Contact company`}
			      title="Visit your plan in the company website"
			    />
			    <Divider />
			    <h6 className="p-2 pl-4 pt-0" style={{paddingLeft: "50px"}}>
				    You can purchase and check your plan visiting <a href="lifeanalytics.org">lifeanalytics.org</a>
			    </h6>
			</Card>
		</div>
	)
}

export default UserPage


// <Row>
// 	<Col className="pr-0"><CloudChart sx={{ height: '100%' }} /></Col>
// 	<Col className="pl-0"><CloudInfo /></Col>
// </Row>
// <Row>
// 	<h3>asdfasdf</h3>
// </Row>

			// <CloudChart sx={{ height: '100%' }} />
