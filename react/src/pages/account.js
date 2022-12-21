import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box, Container, Grid, Typography } from '@mui/material';
import AccountProfile from './user/account-profile'
import {AccountProfileDetails} from './user/account-profile-details'


const AccountPage = (props) => {
	return (
		<>
	      <title>
	        Account | Material Kit
	      </title>
		    <AccountProfile />
		</>
	)
}

export default AccountPage