import { WorkExperience } from './work-experience.model';

export interface profile {
  _id: string;
  userId: string;
  name: string;
  designation: string;
  profilePicture: string;
  age: number;
  profileSummary: string;
  workExperiences: WorkExperience[];
}
