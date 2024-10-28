import React from 'react';
import { getDocumentRequirements, countryAssessmentLevels } from '../utils/countryData';
import type { StepProps } from '../types';

export function FormStep1({ data, updateFields }: StepProps) {
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    if (!data.age) newErrors.age = 'Age is required';
    if (!data.countryOfOrigin) newErrors.countryOfOrigin = 'Please select a country';
    if (!data.educationLevel) newErrors.educationLevel = 'Please select education level';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      localStorage.setItem('step1Data', JSON.stringify(data));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Age</label>
        <input
          type="number"
          value={data.age || ''}
          onChange={e => updateFields({ age: parseInt(e.target.value) })}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.age ? 'border-red-500' : ''}`}
          min="15"
          max="99"
        />
        {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Country of Origin
        </label>
        <select
          value={data.countryOfOrigin}
          onChange={e => updateFields({ countryOfOrigin: e.target.value })}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.countryOfOrigin ? 'border-red-500' : ''}`}
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
        {errors.countryOfOrigin && <p className="text-red-500 text-xs mt-1">{errors.countryOfOrigin}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Current Education Level
        </label>
        <select
          value={data.educationLevel}
          onChange={e => updateFields({ educationLevel: e.target.value })}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.educationLevel ? 'border-red-500' : ''}`}
        >
          <option value="">Select education level</option>
          <option value="HIGH_SCHOOL">High School</option>
          <option value="BACHELORS">Bachelor's Degree</option>
          <option value="MASTERS">Master's Degree</option>
          <option value="PHD">PhD</option>
        </select>
        {errors.educationLevel && <p className="text-red-500 text-xs mt-1">{errors.educationLevel}</p>}
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
