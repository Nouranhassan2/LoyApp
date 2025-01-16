// pages/ProfilePage.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import useProfile from '../hooks/useProfile';

function ProfilePage() {
  const { currentUser } = useAuth();
  const { profile, referralLinks, loading, error, updateProfile } = useProfile(currentUser);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  const handleEdit = () => {
    setFormData({
      name: profile.name,
      phoneNumber: profile.phoneNumber,
      address: profile.address,
    });
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await updateProfile(formData);
    if (success) {
      setIsEditing(false);
    }
  };

  if (loading) {
    return <div className="loading">جاري التحميل...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="container">
      <div className="profile-page">
        <h1>الملف الشخصي</h1>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="profile-form">
            <div className="form-group">
              <label>الاسم</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>رقم الهاتف</label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>العنوان</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="form-buttons">
              <button type="submit" className="primary-button">حفظ</button>
              <button 
                type="button" 
                onClick={() => setIsEditing(false)}
                className="secondary-button"
              >
                إلغاء
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-details">
            <div className="profile-header">
              <div className="profile-info">
                <h2>{profile.name}</h2>
                <span className="member-level">{profile.membershipLevel}</span>
              </div>
              <button onClick={handleEdit} className="edit-button">
                تعديل البيانات
              </button>
            </div>

            <div className="profile-stats">
              <div className="stat-item">
                <span className="stat-label">النقاط</span>
                <span className="stat-value">{profile.points}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">كود الإحالة</span>
                <span className="stat-value">{profile.referralCode}</span>
              </div>
            </div>

            <div className="profile-section">
              <h3>معلومات الاتصال</h3>
              <div className="info-item">
                <span className="info-label">البريد الإلكتروني</span>
                <span className="info-value">{profile.email}</span>
              </div>
              <div className="info-item">
                <span className="info-label">رقم الهاتف</span>
                <span className="info-value">{profile.phoneNumber || 'غير محدد'}</span>
              </div>
              <div className="info-item">
                <span className="info-label">العنوان</span>
                <span className="info-value">{profile.address || 'غير محدد'}</span>
              </div>
            </div>
            <div className="profile-section">
  <h3>روابط الإحالة</h3>
  {referralLinks.length > 0 ? (
    <ul>
      {referralLinks.map((link) => (
        <li key={link.id}>
          <strong>اسم المشروع:</strong> {link.projectName || 'غير متوفر'} <br />
          <strong>رابط الإحالة:</strong>{' '}
          <a href={link.referralLink} target="_blank" rel="noopener noreferrer">
            {link.referralLink}
          </a>
        </li>
      ))}
    </ul>
  ) : (
    <p>لا توجد روابط إحالة.</p>
  )}
</div>

          </div>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;