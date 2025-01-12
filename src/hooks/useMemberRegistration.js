// hooks/useMemberRegistration.js
import { useState } from 'react';
import { citiesList, getDistrictsForCity } from '../components/citiesData';

function useMemberRegistration() {
  const [cities] = useState(citiesList);
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateDistricts = (cityName) => {
    const districtsForCity = getDistrictsForCity(cityName);
    setDistricts(districtsForCity);
  };

  const registerMember = async (formData) => {
    setLoading(true);
    try {
      // تنفيذ منطق التسجيل هنا (مثل استدعاء API)
      // مثال:
      await fetch('/api/register', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (err) {
      setError('فشل التسجيل. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  return {
    cities,
    districts,
    loading,
    error,
    updateDistricts,
    registerMember,
  };
}

export default useMemberRegistration;
