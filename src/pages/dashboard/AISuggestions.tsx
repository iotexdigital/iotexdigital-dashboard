import React, { useState } from 'react';
import { useDashboard } from '../../contexts/DashboardContext';
import { 
  Brain, 
  TrendingUp, 
  Zap, 
  Settings, 
  Clock,
  DollarSign,
  ChevronRight,
  Filter,
  Star
} from 'lucide-react';

const categoryIcons = {
  energy: Zap,
  maintenance: Settings,
  performance: TrendingUp,
  optimization: Brain,
};

const categoryColors = {
  energy: 'text-yellow-400 bg-yellow-400/20',
  maintenance: 'text-blue-400 bg-blue-400/20',
  performance: 'text-green-400 bg-green-400/20',
  optimization: 'text-purple-400 bg-purple-400/20',
};

const impactColors = {
  high: 'text-green-400 bg-green-400/20',
  medium: 'text-yellow-400 bg-yellow-400/20',
  low: 'text-blue-400 bg-blue-400/20',
};

export function AISuggestions() {
  const { aiSuggestions } = useDashboard();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedImpact, setSelectedImpact] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'savings' | 'impact'>('priority');

  const filteredSuggestions = aiSuggestions
    .filter(suggestion => {
      const matchesCategory = selectedCategory === 'all' || suggestion.category === selectedCategory;
      const matchesImpact = selectedImpact === 'all' || suggestion.impact === selectedImpact;
      return matchesCategory && matchesImpact;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'priority':
          return b.priority - a.priority;
        case 'savings':
          return b.estimatedSavings - a.estimatedSavings;
        case 'impact':
          const impactOrder = { high: 3, medium: 2, low: 1 };
          return impactOrder[b.impact] - impactOrder[a.impact];
        default:
          return 0;
      }
    });

  const totalSavings = aiSuggestions.reduce((sum, suggestion) => sum + suggestion.estimatedSavings, 0);
  const highImpactCount = aiSuggestions.filter(s => s.impact === 'high').length;
  const categories = [...new Set(aiSuggestions.map(s => s.category))];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">AI Optimization Suggestions</h1>
          <p className="text-gray-400 mt-1">AI-powered recommendations to improve operational efficiency</p>
        </div>
        <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 rounded-lg px-4 py-2">
          <Brain className="w-5 h-5 text-purple-400" />
          <span className="text-purple-400 font-medium">AI Analysis Active</span>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-400 text-sm font-medium">Potential Savings</p>
              <p className="text-2xl font-bold text-white">${totalSavings.toLocaleString()}</p>
              <p className="text-green-400 text-sm">Per year if implemented</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500/10 to-violet-500/10 border border-purple-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-400 text-sm font-medium">High Impact</p>
              <p className="text-2xl font-bold text-white">{highImpactCount}</p>
              <p className="text-purple-400 text-sm">Recommendations available</p>
            </div>
            <Star className="w-8 h-8 text-purple-400" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-400 text-sm font-medium">Total Suggestions</p>
              <p className="text-2xl font-bold text-white">{aiSuggestions.length}</p>
              <p className="text-blue-400 text-sm">AI-generated insights</p>
            </div>
            <Brain className="w-8 h-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Filters and sorting */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                <option value="all">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={selectedImpact}
              onChange={(e) => setSelectedImpact(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="all">All Impact Levels</option>
              <option value="high">High Impact</option>
              <option value="medium">Medium Impact</option>
              <option value="low">Low Impact</option>
            </select>
          </div>

          <div className="flex items-center space-x-2 lg:ml-auto">
            <span className="text-gray-400 text-sm">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              <option value="priority">Priority</option>
              <option value="savings">Potential Savings</option>
              <option value="impact">Impact Level</option>
            </select>
          </div>
        </div>
      </div>

      {/* Suggestions list */}
      <div className="space-y-4">
        {filteredSuggestions.length === 0 ? (
          <div className="text-center py-12">
            <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No suggestions found</h3>
            <p className="text-gray-400">Try adjusting your filters or check back later for new AI insights.</p>
          </div>
        ) : (
          filteredSuggestions.map((suggestion) => {
            const CategoryIcon = categoryIcons[suggestion.category];
            const categoryColorClass = categoryColors[suggestion.category];
            const impactColorClass = impactColors[suggestion.impact];
            
            return (
              <div
                key={suggestion.id}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all duration-200 group"
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${categoryColorClass}`}>
                        <CategoryIcon className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-yellow-400 transition-colors">
                        {suggestion.title}
                      </h3>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${impactColorClass}`}>
                        {suggestion.impact.toUpperCase()} IMPACT
                      </div>
                      <div className="px-2 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300">
                        {suggestion.category.toUpperCase()}
                      </div>
                    </div>

                    <p className="text-gray-300 mb-4 leading-relaxed">{suggestion.description}</p>

                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 font-medium">
                          ${suggestion.estimatedSavings.toLocaleString()} annual savings
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400">
                          {suggestion.implementationTime} to implement
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400">
                          Priority: {suggestion.priority}/10
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right-side actions */}
                  <div className="flex flex-col items-start lg:items-end gap-3">
                    <button className="flex items-center justify-center space-x-2 w-full lg:w-auto px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-gray-900 rounded-lg font-medium hover:from-yellow-300 hover:to-yellow-500 transition-all duration-200">
                      <span>View Details</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                    
                    <div className="text-left lg:text-right">
                      <div className="text-2xl font-bold text-white">
                        ${(suggestion.estimatedSavings / 12).toFixed(0)}
                      </div>
                      <div className="text-sm text-gray-400">per month</div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
