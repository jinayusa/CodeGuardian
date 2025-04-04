import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function App() {
  const [file, setFile] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Mock data for demonstration purposes
  const mockResults = {
    quality_issues: [
      { type: "Style", message: "Line too long (103 characters)", line: 42 },
      { type: "Convention", message: "Missing docstring in public function", line: 28 },
      { type: "Style", message: "Variable name 'x' does not conform to snake_case naming style", line: 15 }
    ],
    security_issues: [
      { type: "Security", message: "Possible SQL injection vulnerability", line: 67 },
      { type: "Security", message: "Use of eval() function may lead to arbitrary code execution", line: 89 }
    ],
    ethics_issues: [
      { type: "Bias", message: "Gender-specific language detected", line: 124 },
      { type: "Privacy", message: "Potential PII handling without proper safeguards", line: 203 }
    ]
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    
    setLoading(true);
    
    // Simulate API call with timeout for demonstration
    setTimeout(() => {
      setResults(mockResults);
      setLoading(false);
    }, 1500);
  };

  const handleDownload = () => {
    if (!results) return;
    const blob = new Blob([JSON.stringify(results, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "analysis_report.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const badgeColors = {
    "Style": "bg-amber-100 text-amber-800 border-amber-200",
    "Convention": "bg-orange-100 text-orange-800 border-orange-200",
    "Security": "bg-red-100 text-red-800 border-red-200",
    "Bias": "bg-purple-100 text-purple-800 border-purple-200",
    "Privacy": "bg-blue-100 text-blue-800 border-blue-200"
  };

  const pieColors = ["#F59E0B", "#EF4444", "#6366F1"];
  const severityColors = {
    high: "text-red-600",
    medium: "text-orange-500",
    low: "text-yellow-500"
  };

  const issueCounts = results ? [
    { name: "Code Quality", value: results.quality_issues.length },
    { name: "Security", value: results.security_issues.length },
    { name: "Ethical", value: results.ethics_issues.length },
  ] : [];

  const totalIssues = results ? 
    results.quality_issues.length + 
    results.security_issues.length + 
    results.ethics_issues.length : 0;

  const renderIssues = (issues, title, iconClass) => {
    if (activeTab !== 'all' && activeTab !== title.toLowerCase()) return null;
    
    return (
      <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
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
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-600 text-white p-2 rounded-lg shadow-lg">
                <i className="fas fa-shield-alt text-xl"></i>
              </div>
              <h1 className="ml-3 text-3xl font-extrabold text-gray-900 tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  CodeGuardian
                </span>
              </h1>
            </div>
            <div className="mt-2 md:mt-0 flex items-center">
              <div className="text-sm font-medium text-gray-500 mr-6">
                <span className="text-gray-900">Last scan:</span> Today at 14:35
              </div>
              <div className="relative inline-block rounded-full bg-green-100 p-1">
                <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-green-500"></div>
                <i className="fas fa-user-circle text-green-600 text-lg"></i>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content - using flex-grow to fill available space */}
      <main  style={{ width: "100vw" }} className="px-4 sm:px-6 lg:px-8 py-8">
        {/* File Upload Section */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="flex-1 w-full">
              <label 
                htmlFor="file-upload" 
                className="flex items-center justify-center w-full h-20 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-blue-500 focus:outline-none"
              >
                <span className="flex items-center space-x-2">
                  <i className="fas fa-upload text-blue-500"></i>
                  <span className="font-medium text-gray-600">
                    {file ? `Selected: ${file.name}` : "Drop Python file or click to browse"}
                  </span>
                </span>
                <input 
                  id="file-upload" 
                  name="file-upload" 
                  type="file" 
                  className="hidden" 
                  accept=".py"
                  onChange={handleFileChange}
                />
              </label>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={handleAnalyze} 
                className={`px-6 py-3 text-white font-medium rounded-lg shadow transition-all duration-300 ${loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'}`}
                disabled={loading || !file}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <i className="fas fa-code-branch mr-2"></i>
                    Analyze Code
                  </span>
                )}
              </button>
              
              {results && (
                <button 
                  onClick={handleDownload} 
                  className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-700 transition-all duration-300 hover:shadow-lg"
                >
                  <span className="flex items-center">
                    <i className="fas fa-download mr-2"></i>
                    Download Report
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Results Section */}
        {results && (
          <>
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-md p-4 mb-6">
              <div className="flex overflow-x-auto space-x-1">
                <button 
                  onClick={() => setActiveTab('all')}
                  className={`px-4 py-2 font-medium rounded-lg transition ${
                    activeTab === 'all' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  All Issues ({totalIssues})
                </button>
                <button 
                  onClick={() => setActiveTab('quality')}
                  className={`px-4 py-2 font-medium rounded-lg transition ${
                    activeTab === 'quality' 
                      ? 'bg-amber-100 text-amber-800' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Quality ({results.quality_issues.length})
                </button>
                <button 
                  onClick={() => setActiveTab('security')}
                  className={`px-4 py-2 font-medium rounded-lg transition ${
                    activeTab === 'security' 
                      ? 'bg-red-100 text-red-800' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Security ({results.security_issues.length})
                </button>
                <button 
                  onClick={() => setActiveTab('ethical')}
                  className={`px-4 py-2 font-medium rounded-lg transition ${
                    activeTab === 'ethical' 
                      ? 'bg-indigo-100 text-indigo-800' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Ethical ({results.ethics_issues.length})
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Chart Column */}
              {(activeTab === 'all') && (
                <div className="md:col-span-1">
                  <div className="bg-white rounded-xl shadow-md p-6 h-auto">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Issue Distribution</h2>
                    <div className="flex justify-center items-center h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie 
                            data={issueCounts} 
                            dataKey="value" 
                            nameKey="name" 
                            cx="50%" 
                            cy="50%" 
                            outerRadius={80} 
                            innerRadius={40}
                            label={(entry) => entry.name}
                            paddingAngle={2}
                          >
                            {issueCounts.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={pieColors[index]} />
                            ))}
                          </Pie>
                          <Tooltip formatter={(value) => [`${value} issues`, null]} />
                          <Legend verticalAlign="bottom" height={36} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-4">
                      {issueCounts.map((count, idx) => (
                        <div key={idx} className="bg-gray-50 rounded-lg p-2 text-center">
                          <div className="text-2xl font-bold text-gray-800">{count.value}</div>
                          <div className="text-xs text-gray-500">{count.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Issues Column */}
              <div className={`${activeTab === 'all' ? 'md:col-span-2' : 'md:col-span-3'} space-y-6`}>
                {renderIssues(results.quality_issues, "Code Quality Issues", "fas fa-code")}
                {renderIssues(results.security_issues, "Security Issues", "fas fa-shield-alt")}
                {renderIssues(results.ethics_issues, "Ethical Issues", "fas fa-balance-scale")}
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {!results && !loading && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 mb-6">
              <i className="fas fa-code text-blue-600 text-3xl"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Ready to Analyze Your Code</h2>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              Upload a Python file to identify code quality issues, security vulnerabilities, and ethical concerns.
            </p>
            <div className="flex justify-center">
              <button 
                onClick={() => document.getElementById('file-upload').click()}
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow hover:bg-blue-700 transition-all duration-300 hover:shadow-lg"
              >
                <span className="flex items-center">
                  <i className="fas fa-upload mr-2"></i>
                  Upload Python File
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 mb-6">
              <svg className="animate-spin h-12 w-12 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Analyzing Your Code</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              We're scanning your code for quality issues, security vulnerabilities, and ethical concerns. This may take a moment...
            </p>
            <div className="max-w-md mx-auto mt-6 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="animate-pulse h-full bg-blue-600 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
        )}
      </main>

      {/* Footer - fixed at bottom */}
      <footer className="bg-white border-t border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-gray-500 text-sm">
              © 2025 CodeGuardian. All rights reserved.
            </div>
            <div className="mt-2 md:mt-0">
              <div className="flex space-x-4">
                <a href="#" className="text-gray-500 hover:text-blue-600">
                  <i className="fab fa-github"></i>
                </a>
                <a href="#" className="text-gray-500 hover:text-blue-600">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-gray-500 hover:text-blue-600">
                  <i className="fas fa-envelope"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}