import React from 'react';
import { getDocumentRequirements, countryAssessmentLevels } from '../utils/countryData';
import type { StepProps } from '../types';

export function FormStep1({ data, updateFields }: StepProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Age</label>
        <input
          type="number"
          value={data.age || ''}
          onChange={e => updateFields({ age: parseInt(e.target.value) })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          min="15"
          max="99"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Country of Origin
        </label>
        <select
          value={data.countryOfOrigin}
          onChange={e => updateFields({ countryOfOrigin: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select a country</option>
          {Object.entries(countryAssessmentLevels)
            .sort((a, b) => a[1].name.localeCompare(b[1].name))
            .map(([code, { name, level }]) => (
              <option key={code} value={code}>
                {name} (Assessment Level {level})
              </option>
            ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Current Education Level
        </label>
        <select
          value={data.educationLevel}
          onChange={e => updateFields({ educationLevel: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select education level</option>
          <option value="HIGH_SCHOOL">High School</option>
          <option value="BACHELORS">Bachelor's Degree</option>
          <option value="MASTERS">Master's Degree</option>
          <option value="PHD">PhD</option>
        </select>
      </div>

      {data.countryOfOrigin && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800 mb-2">
            Required Documents for {countryAssessmentLevels[data.countryOfOrigin]?.name}
          </h4>
          <ul className="list-disc list-inside text-sm text-blue-700 space-y-1">
            {getDocumentRequirements(data.countryOfOrigin).map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}