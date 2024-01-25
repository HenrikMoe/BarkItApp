// Data source: https://open.toronto.ca/dataset/street-tree-data/

type RawTree = [string, number, number];

type Tree = {
  key: string;
  name: string;
  lat: number;
  lng: number;
};

const trees: RawTree[] = [

['East Bark Haven', 34.0129, -118.4158],
['Westside Paws Park', 34.0922, -118.2506],


];

const formatted: Tree[] = trees.map(([name, lat, lng]) => ({
  name,
  lat,
  lng,
  key: JSON.stringify({name, lat, lng})
}));

export default formatted;
