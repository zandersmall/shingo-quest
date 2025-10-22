export interface RoadSign {
  id: string;
  name: string;
  imagePath: string;
  category: 'information' | 'prohibition' | 'warning' | 'regulation';
}

export const roadSigns: RoadSign[] = [
  {
    id: 'national-road',
    name: 'National Road',
    imagePath: '/road-signs/National road.png',
    category: 'information'
  },
  {
    id: 'prefectural-road',
    name: 'Prefectural Road',
    imagePath: '/road-signs/Prefectural Road.png',
    category: 'information'
  },
  {
    id: 'one-way',
    name: 'One-Way',
    imagePath: '/road-signs/One-Way.png',
    category: 'regulation'
  },
  {
    id: 'no-parking',
    name: 'No Parking',
    imagePath: '/road-signs/No Parking.png',
    category: 'prohibition'
  },
  {
    id: 'no-stopping',
    name: 'No Stopping',
    imagePath: '/road-signs/No Stopping.png',
    category: 'prohibition'
  },
  {
    id: 'no-u-turn',
    name: 'No U-turn',
    imagePath: '/road-signs/No U-turn.png',
    category: 'prohibition'
  },
  {
    id: 'no-entry',
    name: 'No Entry',
    imagePath: '/road-signs/No entry.png',
    category: 'prohibition'
  },
  {
    id: 'road-closed',
    name: 'Road Closed',
    imagePath: '/road-signs/Road Closed.png',
    category: 'prohibition'
  },
  {
    id: 'stop',
    name: 'Stop',
    imagePath: '/road-signs/Stop.png',
    category: 'regulation'
  },
  {
    id: 'speed-limit',
    name: 'Speed Limit',
    imagePath: '/road-signs/Speed Limit.png',
    category: 'regulation'
  },
  {
    id: 'designated-directions',
    name: 'Only Designated Directions Permitted',
    imagePath: '/road-signs/Only Designated Directions Permitted.png',
    category: 'regulation'
  },
  {
    id: 'scooters',
    name: 'Scooters',
    imagePath: '/road-signs/Scooters.png',
    category: 'warning'
  }
];

export const getSignsByCategory = (category: RoadSign['category']) => {
  return roadSigns.filter(sign => sign.category === category);
};
