import React from 'react';
import { 
  AccordionSummary,
  Accordion,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function ExpansionPanel(props) {
    return (
      <>
        <Accordion >
          <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh"
          >
            <strong> {props.title} </strong>
          </AccordionSummary>
          <AccordionDetails style={{display:'block'}}>
            {props.children}
          </AccordionDetails>
        </Accordion>
      </>
    );
}