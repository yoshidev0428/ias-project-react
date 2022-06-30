import {
    getChannelStats,
    loadOmeTiff,
    PictureInPictureViewer,
  } from '@hms-dbmi/viv';
import { useEffect, useState } from "react";
function getDefaultGlobalSelection(imageDims) {
  const globalIndices = imageDims.filter((dim) =>
    ["z", "t"].includes(dim.field)
  );
  const selection = {};
  globalIndices.forEach((dim) => {
    selection[dim.field] = Math.floor((dim.values.length || 0) / 2);
  });
  return selection;
}
function buildDefaultSelection(imageDims) {
  const selection = [];
  const globalSelection = getDefaultGlobalSelection(imageDims);
  // First non-global dimension with some sort of selectable values.
  const firstNonGlobalDimension = imageDims.filter(
    (dim) => !["z", "t"].includes(dim.field) && dim.values
  )[0];
  for (
    let i = 0;
    i < Math.min(4, firstNonGlobalDimension.values.length);
    i += 1
  ) {
    selection.push({
      [firstNonGlobalDimension.field]: i,
      ...globalSelection
    });
  }
  return selection;
}

const dataprops = {
    selections: [
      { z: 0, t: 0, c: 0 },
      { z: 0, t: 0, c: 1 },
      { z: 0, t: 0, c: 2 },
    ],
    colors: [
      [0, 0, 255],
      [0, 255, 0],
      [255, 0, 0],
    ],
    contrastLimits: [
      [0, 255],
      [0, 255],
      [0, 255],
    ],
    channelsVisible: [true, true, true],
  }

//   const url = 'http://localhost:8000/LuCa-7color_Scan1.ome.tif'; // OME-TIFF
  const url = 'http://localhost:8000/LiveDead2_Plate_R_p00_0_A01f00d0.TIF'; // OME-TIFF

export default function AvivatorViewer(props) {
    const [loader, setLoader]= useState(null);
    const [autoProps, setAutoProps] = useState(null);
    useEffect(() => {
        console.log("AvivatorViewer: ", props.source);
        if(props.source){
            console.log("2 AvivatorViewer: ", props.source);
            loadOmeTiff(url).then(setLoader);
        }
    }, [props.source]);
  
    // Viv exposes the getChannelStats to produce nice initial settings
    // so that users can have an "in focus" image immediately.
  
    async function computeProps(loader){
      if (!loader) return null;
      // Use lowest level of the image pyramid for calculating stats.
      const source = loader.data[loader.data.length - 1];
      const stats = await Promise.all(props.selections.map(async selection => {
        const raster = await source.getRaster({ selection });
        return getChannelStats(raster.data);
      }));
      // These are calculated bounds for the contrastLimits
      // that could be used for display purposes.
      // domains = stats.map(stat => stat.domain);
  
      // These are precalculated settings for the contrastLimits that
      // should render a good, "in focus" image initially.
      const contrastLimits = stats.map(stat => stat.contrastLimits);
      const newProps = { ...dataprops, contrastLimits };
      return newProps
    }
    
    useEffect(() => {
  
      computeProps(loader).then(setAutoProps)
      
    }, [loader])
  
    if (!loader || !autoProps) return null;
    return (
      <PictureInPictureViewer
        loader={loader.data}
        contrastLimits={autoProps.contrastLimits}
        colors={autoProps.colors}
        channelsVisible={autoProps.channelsVisible}
        selections={autoProps.selections}
        height={1080}
        width={1920}
      />
    );
}