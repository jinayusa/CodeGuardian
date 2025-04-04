import React from "react";

const AnalysisResults = ({ data }) => {
  const { quality_issues, security_issues, ethics_issues } = data;
  
  const badgeColors = {
    "Style": "bg-amber-100 text-amber-800 border-amber-200",
    "Convention": "bg-orange-100 text-orange-800 border-orange-200",
    "Security": "bg-red-100 text-red-800 border-red-200",
    "Bias": "bg-purple-100 text-purple-800 border-purple-200",
    "Privacy": "bg-blue-100 text-blue-800 border-blue-200"
  };
  
  const severityColors = {
    high: "text-red-600",
    medium: "text-orange-500",
    low: "text-yellow-500"
  };

  const renderIssues = (issues, title, iconClass) => {
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1 mb-6">
        <div className={`p-4 flex items-center ${title.toLowerCase().includes('quality') ? 'bg-amber-50' : 
                                                title.toLowerCase().includes('security') ? 'bg-red-50' : 'bg-indigo-50'}`}>
          <div className={`p-2 rounded-full mr-3 ${title.toLowerCase().includes('quality') ? 'bg-amber-100' : 
                                                   title.toLowerCase().includes('security') ? 'bg-red-100' : 'bg-indigo-100'}`}>
            <i className={`${iconClass} text-lg ${title.toLowerCase().includes('quality') ? 'text-amber-600' : 
                                                  title.toLowerCase().includes('security') ? 'text-red-600' : 'text-indigo-600'}`}></i>
          </div>
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <span className="ml-auto bg-white rounded-full px-3 py-1 text-sm font-medium shadow-sm">
            {issues.length} {issues.length === 1 ? 'issue' : 'issues'}
          </span>
        </div>
        <div className="p-4">
          {issues.length === 0 ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                <i className="fas fa-check text-green-500 text-2xl"></i>
              </div>
              <p className="text-gray-600 font-medium">No issues found. Great job!</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {issues.map((issue, idx) => (
                <li key={idx} className="py-3 transition-colors duration-200 hover:bg-gray-50">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-1">
                      <div className={`w-2 h-2 rounded-full ${idx % 3 === 0 ? 'bg-red-500' : idx % 3 === 1 ? 'bg-orange-500' : 'bg-yellow-500'}`}></div>
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center mb-1">
                        {issue.type && (
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badgeColors[issue.type] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                            {issue.type}
                          </span>
                        )}
                        {issue.line && (
                          <span className="ml-2 text-xs text-gray-500">
                            Line {issue.line}
                          </span>
                        )}
                        <span className={`ml-auto text-xs font-medium ${idx % 3 === 0 ? severityColors.high : idx % 3 === 1 ? severityColors.medium : severityColors.low}`}>
                          {idx % 3 === 0 ? 'High' : idx % 3 === 1 ? 'Medium' : 'Low'}
                        </span>
                      </div>
                      <p className="text-gray-700">{issue.message}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col space-y-6">
      {renderIssues(quality_issues, "Code Quality Issues", "fas fa-code")}
      {renderIssues(security_issues, "Security Issues", "fas fa-shield-alt")}
      {renderIssues(ethics_issues, "Ethics Issues", "fas fa-balance-scale")}
    </div>
  );
};

export default AnalysisResults;