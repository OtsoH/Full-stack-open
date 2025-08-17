import patients from '../data/patients';
import { Patient, NonSensitivePatient, NewPatient } from '../types';
import {v1 as uuid } from 'uuid';

const getEntries = (): NonSensitivePatient[] => {
  return patients.map(({ ssn: _, ...rest }) => rest);
};

const getPatientById = (id: string): Patient | undefined => {
  return patients.find(patient => patient.id === id);
};

const getSensitiveEntries = (): Patient[] => {
  return patients;
};

const addPatient = (entry: NewPatient): Patient => {
  const newPatient = {
    id: uuid(),
    entries: [],
    ...entry
  };

  patients.push(newPatient);
  return newPatient;
};

export default {
  getSensitiveEntries,
  getEntries,
  getPatientById,
  addPatient
};