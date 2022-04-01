import React from 'react';
import {
  useLocation,
} from 'react-router-dom';
import { ThemeProvider, createTheme } from '@material-ui/core/styles';
import { grey } from '@material-ui/core/colors';

import sources from './source-info';
import Avivator from './Avivator';
import { getNameFromUrl } from './utils';

const darkTheme = createTheme({
  palette: {
    type: 'dark',
    primary: grey,
    secondary: grey
  },
  props: {
    MuiButtonBase: {
      disableRipple: true
    }
  }
});

function getRandomSource() {
  return sources[Math.floor(Math.random() * sources.length)];
}

// https://reactrouter.com/web/example/query-parameters
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function RoutedAvivator(props) {
  // const query = useQuery();
  // const url = query.get('image_url');
  // const {
  //   routeProps: { history }
  // } = props;
  // if (url) {
  //   const urlSrouce = {
  //     urlOrFile: url,
  //     description: getNameFromUrl(url)
  //   };
  //   return (
  //     <ThemeProvider theme={darkTheme}>
  //       <Avivator source={urlSrouce} history={history} />
  //     </ThemeProvider>
  //   );
  // }
  // const source = getRandomSource();
  // const source ={
  //   urlOrFile:"https://viv-demo.storage.googleapis.com/Vanderbilt-Spraggins-Kidney-MxIF.ome.tif",
  //   // urlOrFile:"https://viv-demo.storage.googleapis.com/12448_G1HR_Mesh003.ome.tif",
  //   description:"OME-TIFF Covid-19 Primary Gut Epithelial Stem Cells"
  // }
  const source = '';
  const history=[];
  return (
    <ThemeProvider theme={darkTheme}>
      <Avivator source={source} isDemoImage />
    </ThemeProvider>
  );
}
