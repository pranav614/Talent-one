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

export const sampleJobs: Job[] = [
  {
    id: "electrical-engineer",
    title: "Senior Electrical Engineer",
    company: "Northstar Energy",
    location: "Canberra",
    type: "Full-time",
    sector: "Engineering",
    description:
      "Lead practical engineering projects with a collaborative team delivering reliable energy infrastructure.",
    status: "Live",
  },
  {
    id: "finance-partner",
    title: "Finance Business Partner",
    company: "Harbour Group",
    location: "Sydney",
    type: "Contract",
    sector: "Finance",
    description:
      "Partner with business leaders to turn clear financial insight into confident decisions.",
    status: "Live",
  },
  {
    id: "registered-nurse",
    title: "Registered Nurse",
    company: "Evergreen Health",
    location: "Melbourne",
    type: "Permanent",
    sector: "Healthcare",
    description:
      "Join a supportive clinical team focused on thoughtful, person-centred care.",
    status: "Live",
  },
  {
    id: "software-developer",
    title: "Software Developer",
    company: "Brightworks",
    location: "Remote",
    type: "Full-time",
    sector: "Technology",
    description:
      "Build accessible digital products with a small, experienced product team.",
    status: "Live",
  },
  {
    id: "project-manager",
    title: "Project Manager",
    company: "Civic Build Co.",
    location: "Brisbane",
    type: "Contract",
    sector: "Construction",
    description:
      "Coordinate a growing portfolio of projects from planning through delivery.",
    status: "Live",
  },
  {
    id: "people-advisor",
    title: "People & Culture Advisor",
    company: "Fieldstone",
    location: "Sydney",
    type: "Part-time",
    sector: "Human Resources",
    description:
      "Help a people-first organisation build positive, practical workplace experiences.",
    status: "Draft",
  },
];
