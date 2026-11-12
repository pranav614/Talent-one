export type JobStatus = "Live" | "Draft";

export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  sector: string;
  description: string;
  status: JobStatus;
};

export const sectors = [
  "Engineering",
  "Finance",
  "Healthcare",
  "Technology",
  "Construction",
  "Human Resources",
];

export const jobTypes = ["Full-time", "Contract", "Permanent", "Part-time"];
