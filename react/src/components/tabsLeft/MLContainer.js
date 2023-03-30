import * as React from 'react';
import MLMethodSelection from './contents/dlml/MLMethodSelection';
import MLTrainingContainer from './contents/dlml/MLTrainingContainer';
import MLObjectBrightness from './contents/dlml/MLObjectBrightness';
import MLSelectTarget from './contents/dlml/MLSelectTarget';
import Count from './contents/dlml/Count';
import MLObjectClass from './contents/dlml/MLObjectClass';
import MLClassObjectStatus from './contents/dlml/MLClassObjectStatus';
import { Divider } from 'semantic-ui-react';
import SmallCard from '../custom/SmallCard';

export default function MLContainer() {
  return (
    <>
      <MLMethodSelection />
      <Divider sx={{ padding: '16px 0px' }} />
      <MLTrainingContainer />
      <Divider sx={{ padding: '16px 0px' }} />
      <div className="pt-2 pl-1" style={{ padding: '2px' }}>
        <div
          className={'mb-2'}
          style={{ fontWeight: 'bold', fontSize: '14px' }}
        >
          {`Object Select`}
        </div>
      </div>
      <MLObjectBrightness />
      <Divider sx={{ padding: '16px 0px' }} />
      <MLSelectTarget />
      <Divider sx={{ padding: '16px 0px' }} />
      <Count />
      <Divider sx={{ padding: '16px 0px' }} />
      <MLObjectClass />
      <Divider />
      <MLClassObjectStatus />
    </>
  );
}
