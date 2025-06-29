import React, { useState } from 'react';
import { MapPin, Calendar, AlertTriangle, FileText, Plus, Loader } from 'lucide-react';
import { createSignal } from '../lib/supabase';

interface AddSignalFormProps {
  onSignalAdded?: () => void;
}

const AddSignalForm: React.FC<AddSignalFormProps> = ({ onSignalAdded }) => {
  const [formData, setFormData] = useState({
    type: 'Cough',
    location: '',
    latitude: '',
    longitude: '',
    severity: 'medium',
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const signalTypes = [
    'Cough',
    'Fever',
    'Respiratory',
    'Wastewater',
    'Pharmacy',
    'Environmental',
    'Acoustic',
    'Other'
  ];

  const severityLevels = [
    { value: 'low', label: 'Low', color: 'text-green-600' },
    { value: 'medium', label: 'Medium', color: 'text-yellow-600' },
    { value: 'high', label: 'High', color: 'text-red-600' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      // Validate required fields
      if (!formData.location.trim()) {
        setError('Location is required');
        setIsLoading(false);
        return;
      }

      // Prepare signal data
      const signalData = {
        type: formData.type,
        location: formData.location.trim(),
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        severity: formData.severity,
        notes: formData.notes.trim() || null,
        timestamp: new Date().toISOString()
      };

      // Create signal in database
      const { data, error: createError } = await createSignal(signalData);

      if (createError) {
        setError(createError.message || 'Failed to create signal');
        return;
      }

      // Success
      setSuccess('Signal added successfully!');
      
      // Reset form
      setFormData({
        type: 'Cough',
        location: '',
        latitude: '',
        longitude: '',
        severity: 'medium',
        notes: ''
      });

      // Notify parent component
      if (onSignalAdded) {
        onSignalAdded();
      }

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);

    } catch (err) {
      console.error('Error creating signal:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationSuggestion = (suggestion: string) => {
    setFormData(prev => ({ ...prev, location: suggestion }));
  };

  const locationSuggestions = [
    'Mumbai, Andheri West',
    'Delhi, Central District',
    'Bangalore, Tech Corridor',
    'Chennai, T. Nagar',
    'Kolkata, Salt Lake',
    'Hyderabad, HITEC City',
    'Pune, Koregaon Park',
    'Ahmedabad, Satellite'
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
          <Plus className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Add New Signal</h2>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-700 text-sm">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Signal Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
              <AlertTriangle className="inline h-4 w-4 mr-2" />
              Signal Type *
            </label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {signalTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Severity */}
          <div>
            <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-2">
              Severity Level *
            </label>
            <select
              id="severity"
              name="severity"
              value={formData.severity}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {severityLevels.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            <MapPin className="inline h-4 w-4 mr-2" />
            Location *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Mumbai, Andheri West"
          />
          
          {/* Location Suggestions */}
          <div className="mt-2">
            <p className="text-xs text-gray-500 mb-2">Quick suggestions:</p>
            <div className="flex flex-wrap gap-2">
              {locationSuggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleLocationSuggestion(suggestion)}
                  className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Coordinates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-2">
              Latitude (Optional)
            </label>
            <input
              type="number"
              id="latitude"
              name="latitude"
              value={formData.latitude}
              onChange={handleInputChange}
              step="any"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 19.1136"
            />
          </div>

          <div>
            <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-2">
              Longitude (Optional)
            </label>
            <input
              type="number"
              id="longitude"
              name="longitude"
              value={formData.longitude}
              onChange={handleInputChange}
              step="any"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 72.8697"
            />
          </div>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            <FileText className="inline h-4 w-4 mr-2" />
            Additional Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Any additional information about this signal..."
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoading ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                <span>Adding Signal...</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                <span>Add Signal</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">Signal Guidelines</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Signals are automatically processed for cluster detection</li>
          <li>• 5+ signals in the same location within 24h create an event</li>
          <li>• High severity signals trigger immediate alerts</li>
          <li>• All data is anonymized and used for population-level insights only</li>
        </ul>
      </div>
    </div>
  );
};

export default AddSignalForm;