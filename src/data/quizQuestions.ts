export interface QuizQuestion {
  id: string;
  question: string;
  image?: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizData {
  id: number;
  title: string;
  description: string;
  questions: QuizQuestion[];
  timeLimit: number; // in seconds
  xpReward: number;
  bonusXp: number;
}

export const quizzes: QuizData[] = [
  {
    id: 1,
    title: "Quick Fire - Prohibition Signs",
    description: "Identify prohibition signs under time pressure",
    timeLimit: 300,
    xpReward: 50,
    bonusXp: 25,
    questions: [
      {
        id: 'q1-1',
        question: 'What does this sign mean?',
        image: '/road-signs/No Parking.png',
        options: ['No Entry', 'No Parking', 'No Stopping', 'Road Closed'],
        correctAnswer: 1,
        explanation: 'This is a No Parking sign. Parking is not allowed in this area.'
      },
      {
        id: 'q1-2',
        question: 'What does this sign indicate?',
        image: '/road-signs/No Stopping.png',
        options: ['Parking allowed', 'No Stopping', 'Loading zone', 'Bus stop'],
        correctAnswer: 1,
        explanation: 'No Stopping sign means you cannot stop or stand, even temporarily.'
      },
      {
        id: 'q1-3',
        question: 'What does this sign prohibit?',
        image: '/road-signs/No U-turn.png',
        options: ['Left turns', 'U-turns', 'Right turns', 'All turns'],
        correctAnswer: 1,
        explanation: 'This sign specifically prohibits U-turns at this location.'
      },
      {
        id: 'q1-4',
        question: 'What action is forbidden here?',
        image: '/road-signs/No entry.png',
        options: ['Parking', 'Stopping', 'Entry', 'Passing'],
        correctAnswer: 2,
        explanation: 'No Entry sign means vehicles are not allowed to enter.'
      },
      {
        id: 'q1-5',
        question: 'What does this sign mean?',
        image: '/road-signs/Road Closed.png',
        options: ['Detour ahead', 'Road Closed', 'Construction zone', 'Slow down'],
        correctAnswer: 1,
        explanation: 'Road Closed indicates the road is not accessible.'
      },
      {
        id: 'q1-6',
        question: 'Which is more restrictive?',
        options: ['No Parking', 'No Stopping', 'Both equal', 'Neither'],
        correctAnswer: 1,
        explanation: 'No Stopping is more restrictive - you cannot even pause briefly.'
      },
      {
        id: 'q1-7',
        question: 'Can you drop off passengers in a No Stopping zone?',
        options: ['Yes, briefly', 'No', 'Only during day', 'Only at night'],
        correctAnswer: 1,
        explanation: 'No Stopping means absolutely no stopping for any reason.'
      },
      {
        id: 'q1-8',
        question: 'What color are prohibition signs typically?',
        options: ['Blue', 'Red and white', 'Yellow', 'Green'],
        correctAnswer: 1,
        explanation: 'Prohibition signs are typically red with white backgrounds.'
      },
      {
        id: 'q1-9',
        question: 'Can you make a U-turn at a No U-turn sign?',
        options: ['Yes, if clear', 'Yes, at night', 'No, never', 'Only on weekends'],
        correctAnswer: 2,
        explanation: 'No U-turn signs must always be obeyed.'
      },
      {
        id: 'q1-10',
        question: 'What should you do when seeing a No Entry sign?',
        options: ['Proceed slowly', 'Enter if empty', 'Do not enter', 'Honk first'],
        correctAnswer: 2,
        explanation: 'Never enter an area marked with a No Entry sign.'
      }
    ]
  },
  {
    id: 2,
    title: "Information Signs Master",
    description: "Test your knowledge of all information signs",
    timeLimit: 480,
    xpReward: 100,
    bonusXp: 50,
    questions: [
      {
        id: 'q2-1',
        question: 'What does this sign indicate?',
        image: '/road-signs/National road.png',
        options: ['Local road', 'National road', 'Private road', 'Toll road'],
        correctAnswer: 1,
        explanation: 'This indicates a National Road - a major highway.'
      },
      {
        id: 'q2-2',
        question: 'What type of road is this?',
        image: '/road-signs/Prefectural Road.png',
        options: ['National', 'Prefectural', 'Municipal', 'Private'],
        correctAnswer: 1,
        explanation: 'Prefectural roads connect cities within a prefecture.'
      },
      {
        id: 'q2-3',
        question: 'What color are information signs?',
        options: ['Red', 'Blue or green', 'Yellow', 'Orange'],
        correctAnswer: 1,
        explanation: 'Information signs are typically blue or green.'
      },
      {
        id: 'q2-4',
        question: 'What does this sign show?',
        image: '/road-signs/One-Way.png',
        options: ['No entry', 'One-way street', 'Two-way', 'Dead end'],
        correctAnswer: 1,
        explanation: 'One-Way sign indicates traffic flows in one direction only.'
      },
      {
        id: 'q2-5',
        question: 'National roads connect what?',
        options: ['Buildings', 'Different regions', 'Parking lots', 'Cities only'],
        correctAnswer: 1,
        explanation: 'National roads are major highways connecting different regions.'
      },
      {
        id: 'q2-6',
        question: 'Information signs provide guidance on:',
        options: ['Speed limits', 'Routes and destinations', 'Parking fees', 'Weather'],
        correctAnswer: 1,
        explanation: 'Information signs help with navigation and route planning.'
      },
      {
        id: 'q2-7',
        question: 'Can you drive the wrong way on a one-way street?',
        options: ['Yes, if careful', 'Only backing up', 'No, never', 'During emergencies'],
        correctAnswer: 2,
        explanation: 'Never drive against traffic on a one-way street.'
      },
      {
        id: 'q2-8',
        question: 'Which road type is more local?',
        options: ['National', 'Prefectural', 'Both same', 'Neither'],
        correctAnswer: 1,
        explanation: 'Prefectural roads are more regional/local than national highways.'
      },
      {
        id: 'q2-9',
        question: 'What shapes are information signs?',
        options: ['Circles', 'Triangles', 'Squares/rectangles', 'Octagons'],
        correctAnswer: 2,
        explanation: 'Information signs are typically square or rectangular.'
      },
      {
        id: 'q2-10',
        question: 'Are information signs mandatory?',
        options: ['Yes, always', 'No, advisory', 'Sometimes', 'Only in cities'],
        correctAnswer: 1,
        explanation: 'Information signs provide important guidance that should be followed.'
      },
      {
        id: 'q2-11',
        question: 'What do route markers help with?',
        options: ['Speed control', 'Navigation', 'Parking', 'Weather updates'],
        correctAnswer: 1,
        explanation: 'Route markers help drivers navigate and identify roads.'
      },
      {
        id: 'q2-12',
        question: 'Where are information signs commonly placed?',
        options: ['Intersections', 'Parking lots', 'Buildings', 'Sidewalks'],
        correctAnswer: 0,
        explanation: 'Information signs are placed at intersections for navigation.'
      },
      {
        id: 'q2-13',
        question: 'Do information signs show distances?',
        options: ['Never', 'Yes, often', 'Only in cities', 'Only on highways'],
        correctAnswer: 1,
        explanation: 'Information signs frequently include distance information.'
      },
      {
        id: 'q2-14',
        question: 'Are information signs illuminated at night?',
        options: ['Never', 'Sometimes', 'Always', 'Only in tunnels'],
        correctAnswer: 1,
        explanation: 'Many information signs are reflective or illuminated for night visibility.'
      },
      {
        id: 'q2-15',
        question: 'What language is on Japanese road signs?',
        options: ['English only', 'Japanese and English', 'Japanese only', 'Multiple languages'],
        correctAnswer: 1,
        explanation: 'Major signs often include both Japanese and English text.'
      }
    ]
  }
];

export const getQuizById = (id: number): QuizData | undefined => {
  return quizzes.find(quiz => quiz.id === id);
};
