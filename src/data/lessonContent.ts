export interface LessonSlide {
  type: 'intro' | 'content' | 'sign' | 'quiz' | 'complete';
  title?: string;
  content?: string;
  signImage?: string;
  signName?: string;
  signMeaning?: string;
  quizQuestion?: string;
  quizOptions?: string[];
  quizCorrect?: number;
}

export interface LessonData {
  id: number;
  title: string;
  description: string;
  xp: number;
  slides: LessonSlide[];
}

export const lessons: LessonData[] = [
  {
    id: 1,
    title: "Basic Information Signs",
    description: "Learn essential road classification and route markers",
    xp: 100,
    slides: [
      {
        type: 'intro',
        title: 'Welcome to Basic Information Signs',
        content: 'Information signs provide guidance about routes, destinations, and road classifications. They are typically blue or green in color and help drivers navigate effectively.'
      },
      {
        type: 'sign',
        signImage: '/road-signs/National road.png',
        signName: 'National Road',
        signMeaning: 'Indicates a national route number. These are major highways that connect different regions of Japan.'
      },
      {
        type: 'sign',
        signImage: '/road-signs/Prefectural Road.png',
        signName: 'Prefectural Road',
        signMeaning: 'Indicates a prefectural (regional) route. These roads connect cities and towns within a prefecture.'
      },
      {
        type: 'quiz',
        quizQuestion: 'What color are information signs typically?',
        quizOptions: ['Red', 'Blue or Green', 'Yellow', 'White'],
        quizCorrect: 1
      },
      {
        type: 'quiz',
        quizQuestion: 'What does a National Road sign indicate?',
        quizOptions: [
          'A local street',
          'A parking area',
          'A major highway connecting regions',
          'A private road'
        ],
        quizCorrect: 2
      },
      {
        type: 'complete',
        title: 'Lesson Complete!',
        content: 'You have successfully learned about basic information signs. Practice these signs to master them!'
      }
    ]
  },
  {
    id: 2,
    title: "Prohibition Signs",
    description: "Master signs that restrict specific actions",
    xp: 150,
    slides: [
      {
        type: 'intro',
        title: 'Understanding Prohibition Signs',
        content: 'Prohibition signs indicate actions that are not allowed. They are typically red with white backgrounds and must be obeyed to ensure safety and legal compliance.'
      },
      {
        type: 'sign',
        signImage: '/road-signs/No Parking.png',
        signName: 'No Parking',
        signMeaning: 'Parking is prohibited in this area. Violators may be towed or fined.'
      },
      {
        type: 'sign',
        signImage: '/road-signs/No Stopping.png',
        signName: 'No Stopping',
        signMeaning: 'Stopping or standing is prohibited. More restrictive than no parking - you cannot even pause briefly.'
      },
      {
        type: 'sign',
        signImage: '/road-signs/No U-turn.png',
        signName: 'No U-turn',
        signMeaning: 'U-turns are not permitted at this location. Continue forward to find a legal turning point.'
      },
      {
        type: 'sign',
        signImage: '/road-signs/No entry.png',
        signName: 'No Entry',
        signMeaning: 'Entry is prohibited for all vehicles. Usually indicates one-way streets or restricted areas.'
      },
      {
        type: 'quiz',
        quizQuestion: 'Which sign is more restrictive?',
        quizOptions: ['No Parking', 'No Stopping', 'Both are the same', 'Neither restricts anything'],
        quizCorrect: 1
      },
      {
        type: 'quiz',
        quizQuestion: 'What should you do when you see a No Entry sign?',
        quizOptions: [
          'Proceed with caution',
          'Enter only if no traffic',
          'Do not enter at all',
          'Enter during daytime only'
        ],
        quizCorrect: 2
      },
      {
        type: 'complete',
        title: 'Excellent Work!',
        content: 'You now understand the key prohibition signs. Remember to always obey these signs for safety!'
      }
    ]
  },
  {
    id: 3,
    title: "Warning Signs",
    description: "Recognize hazard alerts and caution indicators",
    xp: 200,
    slides: [
      {
        type: 'intro',
        title: 'Warning Signs for Safety',
        content: 'Warning signs alert drivers to potential hazards ahead. They are typically yellow or orange with black symbols and require increased caution.'
      },
      {
        type: 'sign',
        signImage: '/road-signs/Scooters.png',
        signName: 'Scooters/Motorcycles',
        signMeaning: 'Watch for motorcycles and scooters in this area. Common near motorcycle parking or popular riding routes.'
      },
      {
        type: 'quiz',
        quizQuestion: 'What color are warning signs typically?',
        quizOptions: ['Red', 'Blue', 'Yellow or Orange', 'Green'],
        quizCorrect: 2
      },
      {
        type: 'complete',
        title: 'Great Progress!',
        content: 'Warning signs are crucial for defensive driving. Stay alert when you see them!'
      }
    ]
  }
];

export const getLessonById = (id: number): LessonData | undefined => {
  return lessons.find(lesson => lesson.id === id);
};
