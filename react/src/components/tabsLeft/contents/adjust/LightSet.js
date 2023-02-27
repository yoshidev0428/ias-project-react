import SmallCard from "../../../custom/SmallCard";
import CustomButton from "../../../custom/CustomButton";
import { mdiCog, mdiHdr } from "@mdi/js";
import { Image } from "react-bootstrap";
import IconButton from "@mui/material/IconButton";
import Icon from "@mdi/react";
import { COLORS } from "../../../constant/constants";
export default function LightSet() {
  const select1 = () => {
    console.log("Select-1");
  };
  const select2 = () => {
    console.log("Select-2");
  };
  const select3 = () => {
    console.log("Select-3");
  };
  const select4 = () => {
    console.log("Select-4");
  };
  return (
    <div className="">
      <SmallCard title="Light Set">
        <IconButton
          className="mb-1"
          // style = {{minWidth:"16px", height:props.label ? '38px' : '28px', color:'#009688'}}
          style={{
            width: "40px",
            height: "25px",
            color: "#212529",
            padding: "0 4px",
          }}
          onClick={select1}
          size="large"
        >
          <div className="" style={{ width: "100%" }}>
            <Image
              style={{ margin: "0 auto", width: "100%", height: "100%" }}
              src={require("../../../../assets/images/auto.png")}
              alt="no image"
            />
          </div>
        </IconButton>
        <IconButton
          className="mb-1"
          // style = {{minWidth:"16px", height:props.label ? '38px' : '28px', color:'#009688'}}
          style={{
            minWidth: "25px",
            height: "22px",
            color: "#212529",
            padding: 0,
          }}
          onClick={select2}
          size="large"
        >
          <div className="" style={{ height: "100%", display: "flex" }}>
            <Image
              style={{ margin: "0 auto", width: "100%", height: "100%" }}
              src={require("../../../../assets/images/average.png")}
              alt="no image"
            />
          </div>
        </IconButton>
        <div
          className="custom-button"
          onClick={select3}
          style={{
            height: "22px",
            color: `${COLORS.LIGHT_CYAN}`,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "40px",
          }}
        >
          <div className="d-flex m-auto" style={{ justifyContent: "center", width: "100%" }}>
            <Icon path={mdiHdr} color={COLORS.LIGHT_CYAN} style={{width: "100%"}}/>
          </div>
        </div>
        {/* <CustomButton
          icon={mdiHdr}
          label=""
          click={select3}
        /> */}
        <CustomButton icon={mdiCog} label="" click={select4} />
      </SmallCard>
    </div>
  );
}
