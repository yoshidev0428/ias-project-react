import React, { useState } from 'react';
import {
  AccordionSummary,
  Accordion,
  AccordionDetails,
  Typography,
  Box,
} from '@mui/material';
import TabItem from '../custom/TabItem';
import Judge from './contents/dlml/Judge';
import MethodSelect from './contents/dlml/MethodSelect';
import BoxSelect from './contents/dlml/BoxSelect';
import ObjectSelect from './contents/dlml/ObjectSelect';
import { Divider } from 'semantic-ui-react';
import MLContainer from './MLContainer';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Icon from '@mdi/react';
import { mdiImageOutline } from '@mdi/js';
import { mdiImageCheck } from '@mdi/js';

import { COLORS } from '@/constants';
import '@/styles/ML.css';

export default function DLMLTab() {
  const [expanded, setExpanded] = useState(false);
  const [viewMode, setViewMode] = useState('original');
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const handleChangeViewMode = (e, newViewMode) => {
    e.stopPropagation();
    setViewMode(newViewMode);
  };

  return (
    <TabItem title="Learning">
      <Accordion
        className="mt-1"
        expanded={expanded === 'panel1'}
        onChange={handleChange('panel1')}
      >
        <AccordionSummary
          aria-controls="panel1bh-content"
          id="panel1bh-header"
          className="border"
        >
          <Typography>Deep Learning</Typography>
        </AccordionSummary>
        <AccordionDetails className="p-0">
          <Judge />
          <Divider />
          <MethodSelect />
          <Divider />
          <BoxSelect />
          <Divider />
          <ObjectSelect />
        </AccordionDetails>
      </Accordion>
      <Accordion
        className="mt-1"
        expanded={expanded === 'panel2'}
        onChange={handleChange('panel2')}
      >
        <AccordionSummary
          aria-controls="panel2bh-content"
          id="panel2bh-header"
          className="border"
        >
          <Box className="tabContainer" sx={{ alignItems: 'center' }}>
            <Typography>Machine Learning</Typography>
            <ToggleButtonGroup
              value={viewMode}
              exclusive
              onChange={handleChangeViewMode}
            >
              <ToggleButton
                className="toggleBtn"
                value="original"
                aria-label="list"
              >
                <Icon
                  path={mdiImageOutline}
                  size={1}
                  color={COLORS.LIGHT_CYAN}
                />
              </ToggleButton>
              <ToggleButton
                className="toggleBtn"
                value="processed"
                aria-label="module"
              >
                <Icon path={mdiImageCheck} size={1} color={COLORS.LIGHT_CYAN} />
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </AccordionSummary>
        <AccordionDetails className="p-0">
          <MLContainer />
        </AccordionDetails>
      </Accordion>
    </TabItem>
  );
}
