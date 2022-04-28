import React, { useState } from 'react';
import {
    AccordionSummary,
    Accordion,
    AccordionDetails
} from '@mui/material';
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function ExpansionPanel(props) {

    const [expanded, setExpanded] = useState(false);

    const handleChange = (panel) => (isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <div className='mt-3'>
            <Accordion expanded={expanded === props.expanded} onChange={handleChange(props.expanded)} >
                <AccordionSummary
                    // expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1bh-content"
                    id="panel1bh"
                    style={{ border: "1px solid rgb(0,0,0,0.125)" }}
                >
                    <p> {props.title} </p>
                </AccordionSummary>
                <AccordionDetails style={{ display: 'block', padding: "0px" }}>
                    {props.children}
                </AccordionDetails>
            </Accordion>
        </div>
    );
}