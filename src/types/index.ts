export interface WorkoutRecord {
  type: string;
  sourceName: string;
  sourceVersion: string;
  device: string;
  unit: string;
  creationDate: string;
  startDate: string;
  endDate: string;
  value: number;
}