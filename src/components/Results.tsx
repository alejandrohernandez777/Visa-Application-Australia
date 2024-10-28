import React from 'react';
import { AlertCircle, CheckCircle, Info, DollarSign } from 'lucide-react';
import type { ResultsProps } from '../types';
import {
  getCountryRiskScore,
  getFinancialRequirements,
  getDocumentRequirements,
  countryAssessmentLevels,
} from '../utils/countryData';

export function Results({ data }: ResultsProps) {
  // Define the calculation function inside the component
  const calculateScore = () => {
    let score = 0;
    let details: {
      category: string;
      score: number;
      maxScore: number;
      notes?: string[];
    }[] = [];

    // Country Assessment (max 20 points)
    const countryScore = data.countryOfOrigin ? 15 : 0;
    score += countryScore;
    details.push({
      category: 'Country Assessment',
      score: countryScore,
      maxScore: 20,
      notes: data.countryOfOrigin ? [`Country: ${data.countryOfOrigin}`] : [],
    });

    // Study & Experience (max 30 points)
    let studyScore = 0;
    if (data.hasRelatedStudy) studyScore += 15;
    if (data.hasWorkExperience && data.workExperienceYears) {
      studyScore += Math.min(data.workExperienceYears * 2, 15);
    }
    score += studyScore;
    details.push({
      category: 'Study & Experience',
      score: studyScore,
      maxScore: 30,
    });

    // English Proficiency (max 20 points)
    let englishScore = 0;
    if (data.englishProficiency === 'NATIVE') englishScore = 20;
    else if (data.englishProficiency === 'IELTS' && data.englishTestScore) {
      const testScore = Number(data.englishTestScore);
      if (testScore >= 7.0) englishScore = 15;
      else if (testScore >= 6.5) englishScore = 10;
      else if (testScore >= 6.0) englishScore = 5;
    }
    score += englishScore;
    details.push({
      category: 'English Proficiency',
      score: englishScore,
      maxScore: 20,
    });

    // Financial Capacity (max 20 points)
    let financialScore = 0;
    switch (data.financialStatus) {
      case 'SUFFICIENT':
        financialScore = 20;
        break;
      case 'SCHOLARSHIP':
        financialScore = 20;
        break;
      case 'LOAN':
        financialScore = 15;
        break;
      case 'PARTIAL':
        financialScore = 10;
        break;
    }
    score += financialScore;
    details.push({
      category: 'Financial Capacity',
      score: financialScore,
      maxScore: 20,
    });

    // Health Insurance (max 5 points)
    const healthScore = data.healthInsurance ? 5 : 0;
    score += healthScore;
    details.push({
      category: 'Health Insurance',
      score: healthScore,
      maxScore: 5,
    });

    return { score: Math.min(score, 100), details };
  };

  // Calculate the score
  const { score, details } = calculateScore();
  const { baseAmount, additionalFunds } = getFinancialRequirements(
    data.countryOfOrigin
  );

  return (
    <div className="space-y-8">
      {/* Scoring Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Visa Eligibility Score</h2>
          <div className="flex items-center text-red-500">
            <AlertCircle className="w-4 h-4 mr-1" />
            {score >= 80
              ? 'High Chance'
              : score >= 60
              ? 'Moderate Chance'
              : 'Low Chance'}
          </div>
        </div>

        {/* Overall Score */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-1">
            <span>Overall Score</span>
            <span>{score}/100 points</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-red-500 h-2.5 rounded-full"
              style={{ width: `${score}%` }}
            />
          </div>
        </div>

        {/* Individual Categories */}
        <div className="space-y-4">
          {details.map((detail, index) => (
            <div key={index}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">{detail.category}</span>
                <span>
                  {detail.score}/{detail.maxScore} points
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{
                    width: `${(detail.score / detail.maxScore) * 100}%`,
                  }}
                />
              </div>
              {detail.notes && detail.notes.length > 0 && (
                <ul className="mt-1 text-sm text-gray-600 ml-2">
                  {detail.notes.map((note, noteIndex) => (
                    <li key={noteIndex}>• {note}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Required Documentation */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Required Documentation</h3>
        <div className="space-y-3">
          {getDocumentRequirements(data.countryOfOrigin).map((req, index) => (
            <div key={index} className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-gray-700">{req}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Financial Requirements */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <DollarSign className="w-5 h-5 mr-2" />
          Financial Requirements
        </h3>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Based on your country's assessment level (
            {countryAssessmentLevels[data.countryOfOrigin]?.level}), you need to
            demonstrate:
          </p>
          <ul className="space-y-2">
            <li className="flex items-center text-sm">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
              Base funds: AUD {baseAmount.toLocaleString()}
            </li>
            <li className="flex items-center text-sm">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
              Living costs: AUD {additionalFunds.toLocaleString()} per year
            </li>
          </ul>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Info className="w-5 h-5 mr-2" />
          Recommendations to Improve Your Application
        </h3>
        <div className="space-y-4">
          {score < 80 && (
            <div className="space-y-3">
              {details.find((d) => d.category === 'English Proficiency')
                ?.score === 0 && (
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Improve English Proficiency</p>
                    <p className="text-sm text-gray-600">
                      Consider taking an IELTS test or improving your score to
                      at least 6.5
                    </p>
                  </div>
                </div>
              )}

              {!data.healthInsurance && (
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Obtain Health Insurance</p>
                    <p className="text-sm text-gray-600">
                      Having valid health insurance will improve your chances
                    </p>
                  </div>
                </div>
              )}

              {!data.hasRelatedStudy && (
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Consider Related Studies</p>
                    <p className="text-sm text-gray-600">
                      Taking courses related to your intended field of study can
                      strengthen your application
                    </p>
                  </div>
                </div>
              )}

              {data.financialStatus !== 'SUFFICIENT' && (
                <div className="flex items-start">
                  <Info className="w-5 h-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium">Strengthen Financial Position</p>
                    <p className="text-sm text-gray-600">
                      Consider securing additional funds or obtaining a
                      scholarship
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {score >= 80 && (
            <div className="flex items-start">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Strong Application</p>
                <p className="text-sm text-gray-600">
                  Your profile shows a strong likelihood of visa approval.
                  Ensure all your documentation is properly prepared.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Start New Assessment Button */}
      <div className="text-center">
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          Start New Assessment
        </button>
      </div>
    </div>
  );
}
