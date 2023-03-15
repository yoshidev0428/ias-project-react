import { useState } from 'react';
import FilterMenu from './sections/FilterMenu';
import Filter2D from './sections/Filter2D';
import Filter3D from './sections/Filter3D';

export default function FilterTab() {
  const [st, setSt] = useState('menu');
  const setFilter = (value) => {
    setSt(value);
  };
  const renderPanel = () => {
    if (st === 'menu') return <FilterMenu setFilter={setFilter} />;
    else if (st === '2D') return <Filter2D setFilter={setFilter} />;
    else if (st === '3D') return <Filter3D setFilter={setFilter} />;
  };
  return <>{renderPanel()}</>;
}
