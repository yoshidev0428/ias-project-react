import React from 'react';
import { TasksProgress } from '@/components/custom/CloudPlan';
import CloudInfo from '@/components/custom/cloud/CloudInfo';

import { Card, CardHeader, Divider } from '@mui/material';

const UserPage = (props) => {
  return (
    <div style={{ padding: '30px' }}>
      <TasksProgress
        style={{ height: 'auto', backgroundColor: 'rgb(221, 221, 221)' }}
      />
      <CloudInfo style={{ backgroundColor: 'rgb(221, 221, 221)' }} />

      <Card {...props} style={{ backgroundColor: 'rgb(221, 221, 221)' }}>
        <CardHeader
          subtitle={`Contact company`}
          title="Visit your plan in the company website"
        />
        <Divider />
        <h6 className="p-2 pl-4 pt-0" style={{ paddingLeft: '50px' }}>
          You can purchase and check your plan visiting{' '}
          <a href="lifeanalytics.org">lifeanalytics.org</a>
        </h6>
      </Card>
    </div>
  );
};

export default UserPage;
