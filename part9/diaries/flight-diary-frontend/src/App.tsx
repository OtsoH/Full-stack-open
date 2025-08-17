import type { Diary, NewDiary } from './types';
import { getAllDiaries, createDiary } from './services/diaryService';
import { useState, useEffect } from 'react';
import DiaryForm from './components/DiaryForm';
import axios from 'axios';

const App = () => {
  const [diaries, setDiaries] = useState<Diary[]>([]);
  const [submitError, setSubmitError] = useState<string>('');

  useEffect(() => {
    getAllDiaries().then(data => {
      setDiaries(data)
    })
  }, [])

  const handleAddDiary = async (newDiary: NewDiary) => {
    try {
      setSubmitError('');
      const createdDiary = await createDiary(newDiary);
      setDiaries([...diaries, createdDiary]);
    } catch (error) {
      console.error('Error adding diary:', error);

      if (axios.isAxiosError(error)) {
        if (error.response) {
          const message = error.response.data?.error || error.response.data?.message || 'Unknown server error';
          setSubmitError(`Server error (${error.response.status}): ${message}`);
        } else if (error.request) {
          setSubmitError('Network error: Could not connect to server. Make sure backend is running.');
        } else {
          setSubmitError(`Request error: ${error.message}`);
        }
      } else {
        setSubmitError(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  return (
      <div>
        <h1>Flight Diary</h1>
        <DiaryForm onSubmit={handleAddDiary} error={submitError} />
        <h2>Diary Entries ({diaries.length})</h2>
        <ul>
          {diaries.map(diary => (
            <li key={diary.id}>
              <strong>{diary.date}</strong>
              <p>weather: {diary.weather}</p>
              <p>visibility: {diary.visibility}</p>
              <p>comment: {diary.comment ? diary.comment : 'No comment'}</p>
            </li>
          ))}
        </ul>
      </div>
  )
}

export default App;
