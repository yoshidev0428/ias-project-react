import React from 'react';
import { useState, useEffect } from 'react';
import TabItem from '@/components/custom/TabItem';
import SmallCard from '@/components/custom/SmallCard';
import PageHeader from './PageHeader';
import Divider from '@mui/material/Divider';
import { Col, Row } from 'react-bootstrap';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import NativeSelect from '@mui/material/NativeSelect';
import { mdiCheck, mdiCamera } from '@mdi/js';
import Icon from '@mdi/react';
import TextField from '@mui/material/TextField';
import { useChannelsStore } from '@/state';
import { Options } from '@/constants/filterOptions';

import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';


const Filter2D = ({ setFilter }) => {
  const IconLabelButtons = () => {
    return (
      <SmallCard>
        <button className="btn btn-light btn-sm w-50" name="2D">
          <Icon
            size={0.8}
            horizontal
            vertical
            rotate={180}
            color="#212529"
            path={mdiCamera}
          ></Icon>
          Preview
        </button>
        <button
          className="btn btn-light btn-sm w-50"
          name="3D"
          onClick={FilterApply}
        >
          <Icon
            size={0.8}
            horizontal
            vertical
            rotate={180}
            color="#212529"
            path={mdiCheck}
          ></Icon>
          Apply
        </button>
      </SmallCard>
    );
  };
  const setFilter2D = useChannelsStore((state) => state.setFilter2D);
  const setPasses_1 = useChannelsStore((state) => state.setPasses_1);
  const setPasses_2 = useChannelsStore((state) => state.setPasses_2);

  const options = Options(3);
  const filterList = Object.keys(options);
  const emhasisList = filterList.slice(0, 12);
  const edgeList = filterList.slice(12, 22);
  const morphologicalList = filterList.slice(22, 33);
  const kernelList = filterList.slice(33, 35);
  const leargeList = filterList.slice(37, 39);

  const FilterApply = () => {};
  const GetKernel = (props) => {
    const [item, radio] = props.content;
    const [selectedIndex, setSelectedIndex] = useState(0);
    useEffect(() => {
      setSelectedIndex(0);
      if (item === 'Convolution') {
        setFilter2D('Gauss', 3);
      } else if (item === 'Morphological') {
        setFilter2D('Open', 3);
      } else {
        setFilter2D(item, 3);
      }
    }, [radio]);

    const handleSet = (event) => {
      if (item === 'Convolution') {
        const kernelSize = parseInt(event.target.value);
        setSelectedIndex(kernelSize);
        if (kernelSize === 0) {
          setFilter2D('Gauss', 3);
        } else if (kernelSize === 1) {
          setFilter2D('Gauss', 5);
        } else if (kernelSize === 2) {
          setFilter2D('Gauss', 7);
        } else if (kernelSize === 3) {
          setFilter2D('High_pass', 3);
        } else if (kernelSize === 4) {
          setFilter2D('High_pass', 5);
        } else if (kernelSize === 5) {
          setFilter2D('High_pass', 7);
        } else if (kernelSize === 6) {
          setFilter2D('Horizontal_edge', 3);
        } else if (kernelSize === 7) {
          setFilter2D('Vertical_edge', 3);
        }
      } else if (item === 'Morphological') {
        const kernelSize = parseInt(event.target.value);
        setSelectedIndex(kernelSize);
        if (kernelSize === 0) {
          setFilter2D('Open', 3);
        } else if (kernelSize === 1) {
          setFilter2D('Close', 3);
        } else if (kernelSize === 2) {
          setFilter2D('Erode', 4);
        } else if (kernelSize === 3) {
          setFilter2D('Dilate', 3);
        }
      } else {
        const kernelSize = parseInt(event.target.value);
        setSelectedIndex(kernelSize);
        setFilter2D(item, 3 + 2 * kernelSize);
      }
    };
    return (
      <FormControl>
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          value={selectedIndex}
          name="radio-buttons-group"
          onChange={(event) => handleSet(event)}
        >
          {radio.map((ele, index) => (
            <FormControlLabel
              value={index}
              key={index}
              style={{ height: '30px', fontSize: '14px' }}
              label={ele}
              control={<Radio color="primary" />}
            />
          ))}
        </RadioGroup>
      </FormControl>
    );
  };
  const FilterProperty = (props) => {
    let item = props.item;
    try {
      item = item.replace(' ', '_');
    } catch (err) {
      item = 'Low_pass';
    }

    const selectedVals = Object.values(options[item]);
    const [radioName, radio, inputNum] = selectedVals;
    const [formData, setFormData] = useState(inputNum);
    useEffect(() => {
      setFormData(inputNum);
    }, [inputNum]);

    const inputNumKeys = Object.keys(inputNum);
    const InputNum = (props) => {
      const [inputLabel, index] = props.content;
      return (
        <div className="topInput">
          <TextField
            id="outlined-number"
            label={inputLabel}
            type="number"
            inputProps={{
              value: formData[inputLabel],
              min: 0,
              max: 100,
            }}
            // value={formData[inputLabel]}
            name={inputLabel}
            onChange={(e) =>
              onChangeInput(e.target.name, e.target.value, index)
            }
            // onChange={onChangeInput(index)}
            InputLabelProps={{
              shrink: true,
            }}
            style={{ paddingTop: '5px', paddingBottom: '10px', width: '100%' }}
          />
        </div>
      );
    };

    const onChangeInput = (name, value, index) => {
      setFormData({
        ...formData,
        [name]: value,
      });
      if (index === 0) {
        setPasses_1(parseInt(value));
      } else {
        setPasses_2(parseInt(value));
      }
    };

    return (
      <>
        <Row>
          <Col xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
            <GetKernel content={[item, radio]} />
          </Col>
        </Row>
        {inputNumKeys.map((i, index) => (
          <InputNum content={[i, index, '5px']} />
        ))}
      </>
    );
    // }, [click]); // eslint-disable-line react-hooks/exhaustive-deps
  };
  let firstName = 'Low_pass';
  const SubSelect = (props) => {
    const filterNames = props.name;
    const [selectedValue, setSelectedValue] = useState('Low_pass');
    firstName = filterNames[0];
    useEffect(() => {
      setSelectedValue(firstName);
    }, [firstName]);

    function handleChange(event) {
      setSelectedValue(event.target.value);
    }
    return (
      <Box sx={{ minWidth: 120 }}>
        <FormControl fullWidth>
          <div
            style={{
              backgroundColor: 'white',
              fontSize: '12px',
            }}
          ></div>
          <NativeSelect
            defaultValue={30}
            value={selectedValue}
            onChange={handleChange}
            inputProps={{
              name: 'select',
              id: 'uncontrolled-native',
            }}
          >
            {filterNames.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </NativeSelect>
        </FormControl>
        <div style={{ backgroundColor: 'white', height: '10px' }}></div>
        <FormControl fullWidth>
          <FilterProperty item={selectedValue} />
        </FormControl>
      </Box>
    );
  };

  const SelectMenu = () => {

    const Accordion = styled((props) => (
      <MuiAccordion disableGutters elevation={0} square {...props} />
    ))(({ theme }) => ({
      border: `1px solid ${theme.palette.divider}`,
      '&:not(:last-child)': {
        borderBottom: 0,
      },
      '&:before': {
        display: 'none',
      },
    }));
    
    const AccordionSummary = styled((props) => (
      <MuiAccordionSummary
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
        {...props}
      />
    ))(({ theme }) => ({
      backgroundColor:
        theme.palette.mode === 'dark'
          ? 'rgba(255, 255, 255, .05)'
          : 'rgba(0, 0, 0, .03)',
      flexDirection: 'row-reverse',
      '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
        transform: 'rotate(90deg)',
      },
      '& .MuiAccordionSummary-content': {
        marginLeft: theme.spacing(1),
      },
    }));
    
    const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
      padding: theme.spacing(2),
      borderTop: '1px solid rgba(0, 0, 0, .125)',
    }));
    
    const [expanded, setExpanded] = useState('panel1');
    const [filterOption, setFilterOption] = useState(emhasisList);
    const handleChange = (panel, op) => (event, newExpanded) => {
      setExpanded(newExpanded ? panel : false);
      console.log('dddddddddd', op)
      setFilterOption(op);
    };
    const activeStyle = {
      backgroundColor: '#1976d2',
      color: 'white',
    };
    return (
    <div>
      <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1', emhasisList)}>
        <AccordionSummary className={expanded === 'panel1' ? 'active' : ''} aria-controls="panel1d-content" id="panel1d-header" style={expanded === 'panel1' ? activeStyle : {}} >
          <Typography>Eamhasis</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <SubSelect name={filterOption} />
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2', edgeList)}>
        <AccordionSummary className={expanded === 'panel2' ? 'active' : ''} aria-controls="panel2d-content" id="panel2d-header" style={expanded === 'panel2' ? activeStyle : {}} >
          <Typography>Edge</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          <SubSelect name={filterOption} />
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3', morphologicalList)}>
        <AccordionSummary className={expanded === 'panel3' ? 'active' : ''} aria-controls="panel3d-content" id="panel3d-header" style={expanded === 'panel3' ? activeStyle : {}} >
          <Typography>Morphological</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          <SubSelect name={filterOption} />
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4', kernelList)}>
        <AccordionSummary className={expanded === 'panel4' ? 'active' : ''} aria-controls="panel4d-content" id="panel4d-header" style={expanded === 'panel4' ? activeStyle : {}} >
          <Typography>Kernel</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <SubSelect name={filterOption} />
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5', leargeList)}>
        <AccordionSummary className={expanded === 'panel5' ? 'active' : ''} aria-controls="panel5d-content" id="panel5d-header" style={expanded === 'panel5' ? activeStyle : {}} >
          <Typography>Learge</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <SubSelect name={filterOption} />
          </Typography>
        </AccordionDetails>
      </Accordion>      
    </div>
    );
  }

  return (
    <TabItem title="Filter">
      <PageHeader setFilter={setFilter} currentID={1} />
      <div
        style={{ backgroundColor: 'white', fontSize: '12px', height: '20px' }}
      ></div>
      <SelectMenu />
      <Divider />
      <IconLabelButtons />
    </TabItem>
  );
};
export default Filter2D;
