import React from 'react';
import { FormStep1 } from './components/FormStep1';
import { FormStep2 } from './components/FormStep2';
import { FormStep3 } from './components/FormStep3';
import { useState } from 'react';
import type { VisaFormData } from './types';
import { Results } from './components/Results';

export default function App() {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState<VisaFormData>({
    age: 0,
    countryOfOrigin: '',
    intendedStudy: '',
    selectedField: '',
    hasRelatedStudy: false,
    priorStudyDetails: '',
    hasWorkExperience: false,
    workExperienceYears: 0,
    englishProficiency: '',
    englishTestScore: '',
    previousVisa: '',
    healthInsurance: false,
    financialStatus: '',
    studyPoints: 0,
  });
  const [showResults, setShowResults] = useState(false);

  function updateFields(fields: Partial<VisaFormData>) {
    setFormData((prev) => ({ ...prev, ...fields }));
  }

  const steps = [
    <FormStep1 key="step1" data={formData} updateFields={updateFields} />,
    <FormStep2 key="step2" data={formData} updateFields={updateFields} />,
    <FormStep3 key="step3" data={formData} updateFields={updateFields} />,
  ];

  function handleNext() {
    if (currentStepIndex === steps.length - 1) {
      // On last step, show results
      setShowResults(true);
    } else {
      setCurrentStepIndex((i) => i + 1);
    }
  }

  function handleBack() {
    setCurrentStepIndex((i) => i - 1);
  }

  function handleStartOver() {
    setShowResults(false);
    setCurrentStepIndex(0);
    setFormData({
      age: 0,
      countryOfOrigin: '',
      intendedStudy: '',
      selectedField: '',
      hasRelatedStudy: false,
      priorStudyDetails: '',
      hasWorkExperience: false,
      workExperienceYears: 0,
      englishProficiency: '',
      englishTestScore: '',
      previousVisa: '',
      healthInsurance: false,
      financialStatus: '',
      studyPoints: 0,
    });
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Results data={formData} />
          <div className="mt-6 text-center">
            <button
              onClick={handleStartOver}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Start New Assessment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full mx-auto bg-white rounded-lg shadow-md">
        <div className="p-8">
          {steps[currentStepIndex]}

          <div className="mt-6 flex justify-between">
            {currentStepIndex > 0 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              className={`px-4 py-2 ${
                currentStepIndex === steps.length - 1
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-blue-500 hover:bg-blue-600'
              } text-white rounded ${currentStepIndex === 0 ? 'ml-auto' : ''}`}
            >
              {currentStepIndex === steps.length - 1 ? 'Submit' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
