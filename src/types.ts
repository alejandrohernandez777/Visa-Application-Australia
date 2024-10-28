export interface VisaFormData {
  age: number;
  countryOfOrigin: string;
  intendedStudy: string;
  selectedField: string;
  hasRelatedStudy: boolean;
  priorStudyDetails: string;
  hasWorkExperience: boolean;
  workExperienceYears: number;
  englishProficiency: string;
  englishTestScore: string;
  previousVisa: string;
  healthInsurance: boolean;
  financialStatus: string;
  studyPoints: number;
}

export interface StepProps {
  data: VisaFormData;
  updateFields: (fields: Partial<VisaFormData>) => void;
}

export interface ResultsProps {
  data: VisaFormData;
}
