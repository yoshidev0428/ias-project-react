export const VESSEL_TYPES = ["Slide", "WellPlate", "Dish", "Wafer"];

export const VESSELS = [
    [
        { id: 1, type: "Slide", count: 1, title: "Single" },
        { id: 2, type: "Slide", count: 2, title: "Double" },
        { id: 3, type: "Slide", count: 4, title: "Quarter" }
    ],
    [
        { id: 4, type: "Dish", size: 35, title: "35" },
        { id: 5, type: "Dish", size: 60, title: "60" },
        { id: 6, type: "Dish", size: 100, title: "100" }
    ],
    [
        { id: 7, type: "WellPlate", rows: 2, cols: 2, title: "4", showName: true },
        { id: 8, type: "WellPlate", rows: 2, cols: 3, title: "6", showName: true },
        { id: 9, type: "WellPlate", rows: 3, cols: 4, title: "12", showName: true },
        { id: 10, type: "WellPlate", rows: 4, cols: 6, title: "24", showName: true },
        { id: 11, type: "WellPlate", rows: 6, cols: 8, title: "48", showName: true },
        { id: 12, type: "WellPlate", rows: 8, cols: 12, title: "96", showName: true },
        { id: 13, type: "WellPlate", rows: 16, cols: 24, title: "384", showName: true }
    ],
    [
        { id: 14, type: "Wafer", size: 150, title: "150" },
        { id: 15, type: "Wafer", size: 200, title: "200" },
        { id: 16, type: "Wafer", size: 300, title: "300" }
    ]
];

export const getVesselById = (id) => {
    for (let v of VESSELS) {
        for (let one of v) {
            if (one.id === id) {
                return one;
            }
        }
    }

    return {};
};
