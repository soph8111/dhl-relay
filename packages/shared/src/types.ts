export interface Runner {
  _id: string;
  firstName: string;
  lastName: string;
  alias?: string;
  age: number;
  gender: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
  imageUrl?: string;
}

export interface RunnerPosition {
  runnerId: string;
  lat: number;
  lng: number;
  timestamp?: number;
}

export interface Result {
  _id: string;
  year: number;
  runner: Runner;
  cutoff?: string;
  result?: string;
}
