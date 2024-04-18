export interface WorkExperience {
  startDate: Date;
  endDate?: Date | null;
  current: boolean;
  jobTitle: string;
  company: string;
  jobDescription: string;
}
