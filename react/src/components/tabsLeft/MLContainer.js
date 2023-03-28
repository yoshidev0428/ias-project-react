import * as React from 'react';
import MLMethodSelection from './contents/dlml/MLMethodSelection';
import MLTrainingContainer from './contents/dlml/MLTrainingContainer';
import MLPredictionExport from './contents/dlml/MLPredictionExport';
import Count from './contents/dlml/Count';
import MLObjectClass from './contents/dlml/MLObjectClass';
import MLClassObjectStatus from './contents/dlml/MLClassObjectStatus';
import { Divider } from 'semantic-ui-react';

export default function MLContainer() {
  return (
    <>
      <MLMethodSelection />
      <Divider sx={{ padding: '16px 0px' }} />
      <MLTrainingContainer />
      <Divider sx={{ padding: '16px 0px' }} />
      <MLPredictionExport />
      <Divider sx={{ padding: '16px 0px' }} />
      <Count />
      <Divider sx={{ padding: '16px 0px' }} />
      <MLObjectClass />
      <Divider />
      <MLClassObjectStatus />
    </>
  );
}
