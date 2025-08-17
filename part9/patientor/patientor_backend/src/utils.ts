import { NewPatient } from './types';
import { NewPatientSchema } from './types';

const toNewPatient = (object: unknown): NewPatient => {
  return NewPatientSchema.parse(object);
};

export default toNewPatient;