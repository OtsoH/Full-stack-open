import type { CoursePart } from '../types';

interface PartProps {
  part: CoursePart;
}

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Part = ({ part }: PartProps) => {
    switch (part.kind) {
        case "basic":
            return (
                <div>
                    <h2>{part.name}</h2>
                    <p>Exercises: {part.exerciseCount}</p>
                    <p>Description: {part.description}</p>
                </div>
            );
        case "group":
            return (
                <div>
                    <h2>{part.name}</h2>
                    <p>Exercises: {part.exerciseCount}</p>
                    <p>Group projects: {part.groupProjectCount}</p>
                </div>
            );
        case "background":
            return (
                <div>
                    <h2>{part.name}</h2>
                    <p>Exercises: {part.exerciseCount}</p>
                    <p>Background material: <a href={part.backgroundMaterial}>{part.backgroundMaterial}</a></p>
                </div>
            );

        case "special":
            return (
                <div>
                    <h2>{part.name}</h2>
                    <p>Exercises: {part.exerciseCount}</p>
                    <p>Description: {part.description}</p>
                    <p>Requirements: {part.requirements.join(", ")}</p>
                </div>
            );
        default:
            return assertNever(part);
    }
}

export default Part;