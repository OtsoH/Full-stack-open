import type { CoursePart } from '../types'

interface TotalProps {
  courseParts: CoursePart[];
}

const Total = ({ courseParts }: TotalProps) => {
  const totalExercises = courseParts.reduce((sum, part) => sum + part.exerciseCount, 0);
  return (
    <p>
      Number of exercises {totalExercises}
    </p>
  );
};

export default Total;
