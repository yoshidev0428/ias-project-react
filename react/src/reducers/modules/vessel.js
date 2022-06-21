const DEFAULT_PARAMS = {
  currentVesselType: "Well",
};

const initState = {
  ...DEFAULT_PARAMS,
}

//action redux
const vessel = (state = initState, action)  =>{
  switch (action.type) {
    case "vessel_setCurrentVesselType":
      state.currentVesselType = action.payload;
      break;
    default:
      break;
  }
  return {...state}
};

export default vessel;