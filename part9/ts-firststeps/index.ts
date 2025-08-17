import express from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercise } from './exerciseCalculator';
const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const { height, weight } = req.query;

  if (!height || !weight) {
    return res.status(400).json({
      error: "malformatted parameters"
    });
  }

  if (isNaN(Number(height)) || isNaN(Number(weight)) || Number(height) <= 0 || Number(weight) <= 0) {
    return res.status(400).json({
      error: "malformatted parameters"
    });
  }

  try {
    const bmi = calculateBmi(Number(height), Number(weight));
    return res.json({
      weight: Number(weight),
      height: Number(height),
      bmi: bmi
    });
  }

  catch {
    return res.status(400).json({
      error: "malformatted parameters"
    });
  }
});

app.post('/exercises', (req, res) => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  /* eslint-disable @typescript-eslint/no-unsafe-assignment */
  /* eslint-disable @typescript-eslint/no-unsafe-member-access */
  const body: any = req.body;

  if (!body.daily_exercises || body.target === undefined) {
    return res.status(400).json({
      error: "parameters missing"
    });
  }

  if (!Array.isArray(body.daily_exercises)) {
    return res.status(400).json({
      error: "malformatted parameters"
    });
  }

  const target = Number(body.target);
  if (isNaN(target)) {
    return res.status(400).json({
      error: "malformatted parameters"
    });
  }

  const dailyExercises: number[] = [];
  for (const exercise of body.daily_exercises) {
    const exerciseNumber = Number(exercise);
    if (isNaN(exerciseNumber)) {
      return res.status(400).json({
        error: "malformatted parameters"
      });
    }
    dailyExercises.push(exerciseNumber);
  }

  try {
    const result = calculateExercise(dailyExercises, target);
    return res.json(result);
  } catch {
    return res.status(400).json({
      error: "malformatted parameters"
    });
  }
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});