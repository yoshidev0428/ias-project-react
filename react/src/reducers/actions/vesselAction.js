export const SET_VESSEL_TYPE = "SET_VESSEL_TYPE";

export const setVesselType = (vesselType) => ({
    type: SET_VESSEL_TYPE,
    payload: vesselType
})
export const initView = () => ({
    type: "INIT_VIEW"
})
export const setNullView = () => ({
    type: "SET_NULL_VIEW"
})

