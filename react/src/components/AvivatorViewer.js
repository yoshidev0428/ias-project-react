import { useEffect, useState } from "react";
import GeoTIFF, { fromUrl, fromUrls, fromArrayBuffer, fromBlob } from 'geotiff';


export default function AvivatorViewer(props) {
    
  useEffect(() => {
    const script = document.createElement('script');
  
    script.src = "https://cdn.jsdelivr.net/npm/plotty";
    script.async = true;
  
    document.body.appendChild(script);
  
    return () => {
      document.body.removeChild(script);
    }
  }, []);
  
    // useEffect(() => {
    //   const plotData = async () => {
    //     const tiff = await fromUrl(props.source.urlOrFile);
    //     const image = await tiff.getImage();
    //     const data = await image.readRasters();
    
    //     const canvas = document.getElementById("plot");
    //     const plot = new plotty.plot({
    //       canvas,
    //       data: data[0],
    //       width: image.getWidth(),
    //       height: image.getHeight(),
    //       domain: [0, 256],
    //       colorScale: "viridis"
    //     });
    //     plot.render();
    //   }

    //   plotData().catch(console.error);

    
    // },[props.source])

    return (
      <canvas id="plot" width={100} height={100}></canvas>
    );
}