import { useState } from 'react';
import type { NewDiary, Weather, Visibility } from '../types';

interface DiaryFormProps {
  onSubmit: (newDiary: NewDiary) => void;
  error?: string;
}

const DiaryForm = ({ onSubmit, error }: DiaryFormProps) => {
  const [date, setDate] = useState('');
  const [weather, setWeather] = useState<Weather>('sunny');
  const [visibility, setVisibility] = useState<Visibility>('great');
  const [comment, setComment] = useState('');
  const weatherOptions: Weather[] = ['sunny', 'rainy', 'cloudy', 'stormy', 'windy'];
  const visibilityOptions: Visibility[] = ['great', 'good', 'ok', 'poor'];


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newDiary: NewDiary = {
      date,
      weather,
      visibility,
      comment: comment || 'No comment'
    };

    console.log('Sending to backend:', newDiary);
    onSubmit(newDiary);

    setDate('');
    setWeather('sunny');
    setVisibility('great');
    setComment('');
  };

  return (
    <div>
      <h2>Add new entry</h2>
      {error && (
        <div style={{
          color: 'red',
          backgroundColor: '#5c5b5bff',
          padding: '1rem',
          marginBottom: '1rem',
          borderRadius: '4px',
          border: '1px solid red'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div>
          date
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div>
          <fieldset>
            Visibility
            {visibilityOptions.map((option) => (
              <div key={option}>
                <label>
                  <input
                    type="radio"
                    name="visibility"
                    value={option}
                    checked={visibility === option}
                    onChange={(e) => setVisibility(e.target.value as Visibility)}
                  />
                  {option}
                </label>
              </div>
            ))}
          </fieldset>
        </div>

        <div>
          <fieldset>
            Weather
            {weatherOptions.map((option) => (
              <div key={option}>
                <label>
                  <input
                    type="radio"
                    name="weather"
                    value={option}
                    checked={weather === option}
                    onChange={(e) => setWeather(e.target.value as Weather)}
                  />
                  {option}
                </label>
              </div>
            ))}
          </fieldset>
        </div>

        <div>
          comment
          <input
            type="text"
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <button type="submit">add</button>
      </form>
    </div>
  );
};

export default DiaryForm;