export const PositionTabs = {
  images: 'images',
  tiling: 'tiling',
  metadata: 'metadata',
  naming: 'naming',
  groups: 'groups',
};

export const PositionTabLabels = {
  [PositionTabs.images]: 'Images',
  [PositionTabs.tiling]: 'Tiling',
  [PositionTabs.metadata]: 'Metadata',
  [PositionTabs.naming]: 'Naming & Files',
  [PositionTabs.groups]: 'Groups',
};

export const METADATA_COLUMNS = [
  { field: 'id', headerName: 'ID', width: 40 },
  {
    field: 'Name',
    headerName: 'Name',
    width: 200,
  },
  {
    field: 'DimensionOrder',
    headerName: 'DimensionOrder',
    width: 100,
  },
  {
    field: 'SizeX',
    headerName: 'SizeX',
    width: 80,
  },
  {
    field: 'SizeY',
    headerName: 'SizeY',
    width: 80,
  },
  {
    field: 'SizeZ',
    headerName: 'SizeZ',
    width: 80,
  },
  {
    field: 'SizeC',
    headerName: 'SizeC',
    width: 80,
  },
  {
    field: 'SizeT',
    headerName: 'SizeT',
    width: 80,
  },
  {
    field: 'Type',
    headerName: 'Type',
    width: 80,
  },
];
