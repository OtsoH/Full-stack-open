import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Patient, Entry } from "../types";
import axios from "axios";
import { apiBaseUrl } from "../constants";
import { Typography, Paper, CircularProgress, List, ListItem } from "@mui/material";

const PatientPage = () => {
  const { id } = useParams<{ id: string }>();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const { data } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
        setPatient(data);
      } catch (error) {
        setError("Could not fetch patient data");
      } finally {
        setLoading(false);
      }
    };
    void fetchPatient();
  }, [id]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!patient) return null;

  return (
    <Paper style={{ padding: "2em", marginTop: "2em" }}>
      <Typography variant="h4">{patient.name}</Typography>
      <Typography>Gender: {patient.gender}</Typography>
      <Typography>SSN: {patient.ssn}</Typography>
      <Typography>Occupation: {patient.occupation}</Typography>
      <Typography variant="h6" style={{ marginTop: "1em" }}>Entries</Typography>
      {patient.entries.length === 0 ? (
        <Typography>No entries</Typography>
      ) : (
        <List>
          {patient.entries.map((entry: Entry) => (
            <ListItem key={entry.id} alignItems="flex-start" style={{ flexDirection: "column", alignItems: "flex-start" }}>
              <Typography variant="subtitle1">{entry.date}</Typography>
              <Typography variant="body1">{entry.description}</Typography>
              {entry.diagnosisCodes && entry.diagnosisCodes.length > 0 && (
                <Typography variant="body2">
                  Diagnoses: {entry.diagnosisCodes.join(", ")}
                </Typography>
              )}
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default PatientPage;