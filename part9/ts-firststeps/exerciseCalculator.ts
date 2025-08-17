interface ExerciseResult {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

interface ExerciseValues {
  target: number;
  dailyExercises: number[];
}

const parseExerciseArguments = (args: string[]): ExerciseValues => {
  if (args.length < 4) throw new Error('Not enough arguments');

  const target = Number(args[2]);
    if (isNaN(target)) {
      throw new Error('Provided target was not a number!');
    }

  const dailyExercises: number[] = [];
    for (let i = 3; i < args.length; i++) {
        const value = Number(args[i]);
        if (isNaN(value)) {
        throw new Error(`Provided value '${args[i]}' is not a number!`);
        }
        dailyExercises.push(value);
    }

    return {
      target,
      dailyExercises
    };
  };

export const calculateExercise = (dailyExercises: number[], target: number): ExerciseResult => {
  const periodLength = dailyExercises.length;
  const trainingDays = dailyExercises.filter(day => day > 0).length;
  const average = dailyExercises.reduce((a, b) => a + b, 0) / periodLength;

  const success = average >= target;
  const rating = success ? 3 : average > 1 ? 2 : 1;
  const ratingDescription = success ? 'Great job!'
  : average > 1 ? 'Not bad, but could be better.'
  : 'You need to try harder!';

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average
  };
};

if (require.main === module) {
  try {
    const { target, dailyExercises } = parseExerciseArguments(process.argv);
    console.log(calculateExercise(dailyExercises, target));
  } catch (error: unknown) {
    let errorMessage = 'Something bad happened.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    console.log(errorMessage);
  }
}