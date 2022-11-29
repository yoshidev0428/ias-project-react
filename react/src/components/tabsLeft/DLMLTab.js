import React, { useState } from 'react'
import {
    AccordionSummary,
    Accordion,
    AccordionDetails,
    Typography
} from '@mui/material'
import TabItem from '../custom/TabItem'
import Judge from "./contents/dlml/Judge"
import MethodSelect from "./contents/dlml/MethodSelect"
import BoxSelect from "./contents/dlml/BoxSelect"
import ObjectSelect from "./contents/dlml/ObjectSelect"
import MethodSelect2 from "./contents/dlml/MethodSelect2"
import BoxSelect2 from "./contents/dlml/BoxSelect2"
import ObjectSelect2 from "./contents/dlml/ObjectSelect2"
import Count from "./contents/dlml/Count"
import ObjectClass2 from "./contents/dlml/ObjectClass2"
import ClassObjectStatus2 from "./contents/dlml/ClassObjectStatus2"
import { Divider } from 'semantic-ui-react'

export default function DLMLTab() {

    const [expanded, setExpanded] = useState(false)

    const handleChange = (panel) => (event, isExpanded) => {
        console.log(panel, isExpanded, expanded, "panel, isExpanded, expanded, ")
        setExpanded(isExpanded ? panel : false)
    }

    return (
        <TabItem title="Learning">
            <Accordion className="mt-1" expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <AccordionSummary aria-controls="panel1bh-content" id="panel1bh-header" className="border">
                    <Typography>Deep Learning</Typography>
                </AccordionSummary>
                <AccordionDetails className='p-0'>
                    <Judge />
                    <Divider />
                    <MethodSelect />
                    <Divider />
                    <BoxSelect />
                    <Divider />
                    <ObjectSelect />
                </AccordionDetails>
            </Accordion>
            <Accordion className="mt-1" expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                <AccordionSummary aria-controls="panel2bh-content" id="panel2bh-header" className="border" >
                    <Typography>Machine Learning</Typography>
                </AccordionSummary>
                <AccordionDetails className='p-0'>
                    <MethodSelect2 />
                    <Divider />
                    <BoxSelect2 />
                    <Divider />
                    <ObjectSelect2 />
                    <Divider />
                    <Count />
                    <Divider />
                    <ObjectClass2 />
                    <Divider />
                    <ClassObjectStatus2 />
                </AccordionDetails>
            </Accordion>
        </TabItem>
    )
}
