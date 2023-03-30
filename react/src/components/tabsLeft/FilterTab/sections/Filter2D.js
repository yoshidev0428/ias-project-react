import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import TabItem from '@/components/custom/TabItem';
import SmallCard from '@/components/custom/SmallCard';
import PageHeader from './PageHeader';
import Divider from '@mui/material/Divider';
import ListGroup from 'react-bootstrap/ListGroup';
import Tab from 'react-bootstrap/Tab';
import SuperResolution from './SuperResolution';
import { Col, Row } from 'react-bootstrap';
import Draggable from 'react-draggable';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { styled } from '@mui/material/styles';
import MuiInput from '@mui/material/Input';
import Paper from '@mui/material/Paper';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';
import NativeSelect from '@mui/material/NativeSelect';
import PreviewIcon from '@mui/icons-material/Preview';
import CheckIcon from '@mui/icons-material/Check';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { mdiPagePrevious, mdiPageNext, mdiCheck, mdiCamera } from '@mdi/js';
import Icon from '@mdi/react';
import TextField from '@mui/material/TextField';
import { useChannelsStore } from '@/state';
// import { DeblurMethods } from '@/viv/constants/enums';
import { Options } from '@/constants/filterOptions';

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
      // <Stack direction="row" spacing={2} style={{position:'absolute', top:'650px', width:'100%'}}>
      //   <Button variant="outlined" startIcon={<PreviewIcon />}>
      //     Preview
      //   </Button>
      //   <Button variant="flat" endIcon={<CheckIcon />}>
      //     Apply
      //   </Button>
      // </Stack>
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

  const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  };

  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  const FilterApply = () => {
    console.log('xxxxxxx');
  };
  const GetKernel = (props) => {
    const [item, radioName, radio] = props.content;
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
        if (kernelSize===0) {
          setFilter2D('Gauss', 3);
        } else if (kernelSize===1) {
          setFilter2D('Gauss', 5);
        } else if (kernelSize===2) {
          setFilter2D('Gauss', 7);
        } else if (kernelSize===3) {
          setFilter2D('High_pass', 3);
        } else if (kernelSize===4) {
          setFilter2D('High_pass', 5);
        } else if (kernelSize===5) {
          setFilter2D('High_pass', 7);
        } else if (kernelSize===6) {
          setFilter2D('Horizontal_edge', 3);
        } else if (kernelSize===7) {
          setFilter2D('Vertical_edge', 3);
        }
         
      } else if (item === 'Morphological') {
        const kernelSize = parseInt(event.target.value);
        setSelectedIndex(kernelSize);
        if (kernelSize===0) {
          setFilter2D('Open', 3);
        } else if (kernelSize===1) {
          setFilter2D('Close', 3);
        } else if (kernelSize===2) {
          setFilter2D('Erode', 4);
        } else if (kernelSize===3) {
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
    useEffect(()=>{
      setFormData(inputNum)
    }, [inputNum])

    const inputNumKeys = Object.keys(inputNum);
    const InputNum = (props) => {
      const [inputLabel, index, pad] = props.content;
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
            onChange={(e) => onChangeInput(e.target.name, e.target.value, index)}
            // onChange={onChangeInput(index)}
            InputLabelProps={{
              shrink: true,
            }}
            style={{ paddingTop: '5px',paddingBottom: '10px', width: '100%'}}
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
            <GetKernel content={[item, radioName, radio]} />
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
    useEffect(()=>{
      setSelectedValue(firstName);
    }, [firstName])
    
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

    const [filterOption, setFilterOption] = useState(emhasisList);
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <Tab.Container id="list-group-tabs-example" defaultActiveKey="link1">
          <ListGroup>
            <ListGroup.Item
              style={{
                paddingTop: '1px',
                paddingBottom: '1px',
                whiteSpace: 'nowrap',
              }}
              action
              eventKey="link1"
              onClick={() => setFilterOption(emhasisList)}
            >
              Eamhasis
            </ListGroup.Item>
            <ListGroup.Item
              style={{
                paddingTop: '1px',
                paddingBottom: '1px',
                whiteSpace: 'nowrap',
              }}
              action
              eventKey="link2"
              onClick={() => setFilterOption(edgeList)}
            >
              Edge
            </ListGroup.Item>
            <ListGroup.Item
              style={{
                paddingTop: '1px',
                paddingBottom: '1px',
                whiteSpace: 'nowrap',
              }}
              action
              eventKey="link3"
              onClick={() => setFilterOption(morphologicalList)}
            >
              Morphological
            </ListGroup.Item>
            <ListGroup.Item
              style={{
                paddingTop: '1px',
                paddingBottom: '1px',
                whiteSpace: 'nowrap',
              }}
              action
              eventKey="link4"
              onClick={() => setFilterOption(kernelList)}
            >
              Kernel
            </ListGroup.Item>
            <ListGroup.Item
              style={{
                paddingTop: '1px',
                paddingBottom: '1px',
                whiteSpace: 'nowrap',
              }}
              action
              eventKey="link5"
              onClick={() => setFilterOption(leargeList)}
            >
              Learge
            </ListGroup.Item>
          </ListGroup>
          <div style={{ backgroundColor: 'white', height: '10px' }}></div>
          <SubSelect name={filterOption} />
        </Tab.Container>
      </div>
    );
  };

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
