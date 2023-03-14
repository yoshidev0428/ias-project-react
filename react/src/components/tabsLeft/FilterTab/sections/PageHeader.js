import { Col, Row, Button } from 'react-bootstrap';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import CloseIcon from '@mui/icons-material/Close';
import { max } from 'lodash';
import TabItem from '@/components/custom/TabItem';
import SmallCard from '@/components/custom/SmallCard';

const PageHeader = (props) => {
  const setFilter = props.setFilter;
  const currentID = props.currentID;
  const items = ['menu', '2D', '3D'];
  const currentItem = items[currentID];
  const nextItem = items[Math.min(currentID + 1, 2)];
  const prevItem = items[Math.max(currentID - 1, 0)];
  const onClickFilterNext = (e) => {
    setFilter(nextItem);
  };
  const onClickFilterPrev = (e) => {
    setFilter(prevItem);
  };
  const onClickFilterMenu = (e) => {
    setFilter('menu');
  };
  console.log(currentItem, nextItem);
  return (
    <Row>
      <Col xs={8}>
        <div>
          <button
            style={{ padding: 0 }}
            className="btn btn-light btn-sm"
            name="2D"
            onClick={onClickFilterPrev}
          >
            <ArrowBackIosNewIcon />
          </button>
          {currentItem}
          <button
            style={{ padding: 0 }}
            className="btn btn-light btn-sm w-10"
            name="3D"
            onClick={onClickFilterNext}
          >
            <ArrowForwardIosIcon />
          </button>
        </div>
      </Col>
      <Col xs={4}>
        <button
          style={{ padding: 0 }}
          className="btn btn-light btn-sm w-20"
          name="2D"
          onClick={onClickFilterMenu}
        >
          <CloseIcon />
        </button>
      </Col>
    </Row>
  );
};

export default PageHeader;
