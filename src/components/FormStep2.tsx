import React, { useState, useEffect } from 'react';
import type { StepProps } from '../types';
import { governmentDataService } from '../services/governmentAPI'; // Remove the .ts extension
import { countryAssessmentLevels } from '../utils/countryData';
import { StudyLevel, pointsSystem } from '../utils/studyLevels';
import { studyFields } from '../utils/studyFields';

// Add these interfaces to your types.ts or at the top of the file
interface ProgramFees {
  level: string;
  annualFee: number;
  duration: string;
}

const programFees: ProgramFees[] = [
  { level: 'Bachelor Degree', annualFee: 30000, duration: '3 years' },
  { level: 'Certificate III', annualFee: 15000, duration: '1 year' },
  { level: 'Certificate IV', annualFee: 8000, duration: '1 year' },
  { level: 'Diploma', annualFee: 20000, duration: '2 years' },
  { level: 'Advanced Diploma', annualFee: 25000, duration: '2 years' },
  { level: 'Master Degree', annualFee: 35000, duration: '2 years' },
  { level: 'PhD', annualFee: 40000, duration: '4 years' },
];

const LIVING_COSTS_PER_YEAR = 8000;
const BASE_FUNDS_LEVEL_2 = 25000;

// Add this constant at the top with your other constants
const ENGLISH_REQUIREMENTS = {
  BACHELOR: {
    IELTS: '6.5',
    TOEFL: '79',
    PTE: '58',
  },
  MASTER: {
    IELTS: '7.0',
    TOEFL: '94',
    PTE: '65',
  },
};

// Update the scoring constants at the top of your file
const SCORING = {
  COUNTRY_ASSESSMENT: {
    LEVEL_1: 20,
    LEVEL_2: 15,
    LEVEL_3: 10,
  },
  AGE: {
    OPTIMAL: 15, // 18-25 years
    GOOD: 10, // 26-30 years
    FAIR: 5, // 31-35 years
  },
  ENGLISH_PROFICIENCY: {
    NATIVE: 20,
    IELTS_7: 15,
    IELTS_6_5: 10,
    IELTS_6: 5,
  },
  FINANCIAL_CAPACITY: {
    EXCEEDS: 20, // More than required amount
    MEETS: 15, // Exactly meets requirement
    PARTIAL: 5, // Partially meets requirement
  },
  VISA_HISTORY: {
    CLEAN: 15,
    PREVIOUS_VISA: 10,
    NO_HISTORY: 5,
    REFUSED: -5, // Penalty for refused visa
  },
  HEALTH_INSURANCE: {
    VALID: 5, // Updated from 10 to 5 points
    NONE: 0,
  },
};

// Update the calculateTotalScore function
const calculateTotalScore = () => {
  let totalPoints = 0;

  // ... existing point calculations ...

  // Visa History Points
  switch (data.previousVisa) {
    case 'NO_VISA':
      totalPoints += SCORING.VISA_HISTORY.NO_HISTORY;
      break;
    case 'STUDENT_VISA':
    case 'TOURIST_VISA':
    case 'WORKING_VISA':
      totalPoints += SCORING.VISA_HISTORY.PREVIOUS_VISA;
      break;
    case 'VISA_REFUSED':
      totalPoints += SCORING.VISA_HISTORY.REFUSED; // This will subtract 5 points
      break;
  }

  // Health Insurance Points (updated to 5 points)
  if (data.healthInsurance) {
    totalPoints += SCORING.HEALTH_INSURANCE.VALID;
  }

  return Math.max(0, totalPoints); // Ensure total points don't go below 0
};

// Update the points display to show the breakdown
const PointsBreakdown = () => (
  <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
    <h4 className="font-medium text-gray-900 mb-3">Points Summary</h4>
    <div className="space-y-2 text-sm">
      {/* Show visa history impact */}
      {data.previousVisa === 'VISA_REFUSED' && (
        <div className="flex justify-between text-red-600">
          <span>Visa Refusal Impact:</span>
          <span>-5 points</span>
        </div>
      )}

      {/* Show health insurance points */}
      {data.healthInsurance && (
        <div className="flex justify-between">
          <span>Health Insurance:</span>
          <span>5 points</span>
        </div>
      )}

      {/* Total Points */}
      <div className="flex justify-between font-medium text-gray-900 pt-2 border-t">
        <span>Total Points:</span>
        <span>{calculateTotalScore()}/100 points</span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${
            calculateTotalScore() >= 70 ? 'bg-green-600' : 'bg-yellow-400'
          }`}
          style={{ width: `${calculateTotalScore()}%` }}
        />
      </div>
    </div>
  </div>
);

export function FormStep2({ data, updateFields }: StepProps) {
  // Basic state initialization
  const [selectedProgram, setSelectedProgram] = useState(
    data.intendedStudy || ''
  );
  const [selectedField, setSelectedField] = useState(data.selectedField || '');

  // Study and Work Experience state
  const [hasRelatedStudy, setHasRelatedStudy] = useState<boolean | null>(null);
  const [priorStudyDetails, setPriorStudyDetails] = useState('');
  const [hasWorkExperience, setHasWorkExperience] = useState(false);
  const [workExperienceYears, setWorkExperienceYears] = useState(0);

  // Program selection options
  const programOptions = [
    { level: 'Certificate III', annualFee: 15000, duration: '1' },
    { level: 'Certificate IV', annualFee: 18000, duration: '1' },
    { level: 'Diploma', annualFee: 20000, duration: '2' },
    { level: 'Advanced Diploma', annualFee: 25000, duration: '2' },
    { level: 'Bachelor', annualFee: 30000, duration: '3' },
    { level: 'Master', annualFee: 35000, duration: '2' },
    { level: 'PhD', annualFee: 40000, duration: '4' },
  ];

  // Study fields
  const studyFields = [
    'Information Technology',
    'Business',
    'Engineering',
    'Health Sciences',
    'Arts and Design',
    'Education',
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-center mb-8">
        Australian Student Visa Eligibility Calculator
      </h1>

      {/* Progress indicator */}
      <div className="mb-8">
        <p className="text-sm text-gray-600 mb-2">Step 2 of 3</p>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full"
            style={{ width: '66.66%' }}
          />
        </div>
      </div>

      {/* Program Selection */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          Select Your Program
        </h3>
        <select
          value={data.intendedStudy || ''}
          onChange={(e) => updateFields({ intendedStudy: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select a program</option>
          {programOptions.map((program) => (
            <option key={program.level} value={program.level}>
              {program.level}
            </option>
          ))}
        </select>
      </div>

      {/* Field of Study */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          Field of Study
        </h3>
        <select
          value={data.selectedField || ''}
          onChange={(e) => updateFields({ selectedField: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select a field</option>
          {studyFields.map((field) => (
            <option key={field} value={field}>
              {field}
            </option>
          ))}
        </select>
      </div>

      {/* Previous Study */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          Have you previously studied in this or related fields?
        </h3>
        <div className="space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="hasRelatedStudy"
              checked={data.hasRelatedStudy === true}
              onChange={() => updateFields({ hasRelatedStudy: true })}
              className="form-radio"
            />
            <span className="ml-2">Yes</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="hasRelatedStudy"
              checked={data.hasRelatedStudy === false}
              onChange={() => updateFields({ hasRelatedStudy: false })}
              className="form-radio"
            />
            <span className="ml-2">No</span>
          </label>
        </div>
      </div>

      {/* English Proficiency */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          English Proficiency
        </h3>
        <select
          value={data.englishProficiency || ''}
          onChange={(e) => updateFields({ englishProficiency: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select your English level</option>
          <option value="NATIVE">Native English Speaker</option>
          <option value="IELTS">IELTS</option>
          <option value="TOEFL">TOEFL</option>
          <option value="PTE">PTE Academic</option>
        </select>

        {data.englishProficiency && data.englishProficiency !== 'NATIVE' && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
              Test Score
            </label>
            <input
              type="number"
              step="0.5"
              value={data.englishTestScore || ''}
              onChange={(e) =>
                updateFields({ englishTestScore: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      {/* Visa History */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          Previous Visa History
        </h3>
        <select
          value={data.previousVisa || ''}
          onChange={(e) => updateFields({ previousVisa: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select visa history</option>
          <option value="NO_VISA">No previous visa</option>
          <option value="STUDENT_VISA">Previous student visa</option>
          <option value="TOURIST_VISA">Previous tourist visa</option>
          <option value="WORKING_VISA">Previous working visa</option>
          <option value="VISA_REFUSED">Previous visa refused</option>
        </select>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <button
          type="button"
          onClick={() => {
            /* handle previous */
          }}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={() => {
            /* handle next */
          }}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Next
        </button>
      </div>
    </div>
  );
}
