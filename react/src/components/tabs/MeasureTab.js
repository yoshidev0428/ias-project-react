import React, { useState } from 'react';
import Divider from '@mui/material/Divider';
import Pagination from '@mui/material/Pagination';
import TabItem from "../custom/TabItem";
import FirstPage from "./contents/measure/FirstPage";
import SecondPage from "./contents/measure/SecondPage";
import ThirdPage from "./contents/measure/ThirdPage";

export default function MeasureTab () {
  const [page, setPage] = useState(1);
  const handleChange = (event, value) => {
    setPage(value);
  };
  return (
    <>
      <TabItem title="Measure">
        <div className="pa-3 text-center" >
          <Pagination count={3} page={page} onChange={handleChange}/>
        </div>
        <Divider className="mb-2"/>
        {page == 1 && <FirstPage/>}
        {page == 2 && <SecondPage/>}
        {page == 3 && <ThirdPage/>}
      </TabItem>
    </>
  );
};
