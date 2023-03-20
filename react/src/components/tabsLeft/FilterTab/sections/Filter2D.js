import React from 'react';
import { useState } from 'react';
import TabItem from '@/components/custom/TabItem';
import SmallCard from '@/components/custom/SmallCard';
import PageHeader from './PageHeader';
import Divider from '@mui/material/Divider';
import ListGroup from 'react-bootstrap/ListGroup';
import Tab from 'react-bootstrap/Tab';
import { Col, Row } from 'react-bootstrap';
import PropTypes from 'prop-types';
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
  const setPasses = useChannelsStore((state) => state.setPasses);

  const options = Options(3);
  const filterList = Object.keys(options);
  const emhasisList = filterList.slice(0, 12);
  const edgeList = filterList.slice(12, 22);
  const morphologicalList = filterList.slice(22, 29);
  const kernelList = filterList.slice(29, 33);
  const leargeList = filterList.slice(33, 37);

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
  const FilterApply = () => {};
  const GetKernel = (props) => {
    const [item, _radioName, radio] = props.content;
    setFilter2D(item, 3);
    const handleSet = (event) => {
      const kernelSize = parseInt(event.target.value);
      setFilter2D(item, 3 + 2 * kernelSize);
    };
    return (
      <FormControl>
        {/* <FormLabel id="demo-radio-buttons-group-label" style={{ height: '35px' }}>
                {radioName}
            </FormLabel> */}
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          defaultValue="0"
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
    const inputNumKeys = Object.keys(inputNum);

    const InputNum = (props) => {
      const [inputLabel] = props.content;
      return (
        <div className="topInput">
          <TextField
            id="outlined-number"
            label={inputLabel}
            type="number"
            value={formData[inputLabel]}
            name={inputLabel}
            onChange={onChangeInput}
            InputLabelProps={{
              shrink: true,
            }}
            style={{ paddingTop: '5px' }}
          />
        </div>
      );
    };

    const [formData, setFormData] = useState(inputNum);
    const onChangeInput = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
      setPasses(e.target.value);
    };

    return (
      <>
        <Row>
          <Col xs={12} style={{ display: 'flex', justifyContent: 'center' }}>
            <GetKernel content={[item, radioName, radio]} />
          </Col>
        </Row>
        {inputNumKeys.map((item, index) => (
          <InputNum content={[item, index, '5px']} />
        ))}
      </>
    );
    // }, [click]); // eslint-disable-line react-hooks/exhaustive-deps
  };

  const SubSelect = (props) => {
    const filterNames = props.name;
    const [selectedValue, setSelectedValue] = useState('Low_pass');

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
              height: '20px',
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
            >
              Learge
            </ListGroup.Item>
          </ListGroup>
          <div style={{ backgroundColor: 'white', height: '10px' }}></div>
          <Tab.Content>
            <Tab.Pane eventKey="link1">
              <SubSelect name={emhasisList} />
            </Tab.Pane>
            <Tab.Pane eventKey="link2">
              <SubSelect name={edgeList} />
            </Tab.Pane>
            <Tab.Pane eventKey="link3">
              <SubSelect name={morphologicalList} />
            </Tab.Pane>
            <Tab.Pane eventKey="link4">
              <SubSelect name={kernelList} />
            </Tab.Pane>
            <Tab.Pane eventKey="link5">
              <SubSelect name={leargeList} />
            </Tab.Pane>
          </Tab.Content>
        </Tab.Container>
        {/* </SmallCard> */}
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
