export interface WorkExperience {
  _id: string;
  startDate: Date;
  endDate?: Date | null;
  current: boolean;
  jobTitle: string;
  company: string;
  jobDescription: string;
}
