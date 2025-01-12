// pages/ActivityManagementPage.js
import React, { useState, useEffect } from 'react';
import useManageActivities from '../hooks/useManageActivities';
import '../App.css';

function ActivityManagementPage() {
  // حالة النموذج والبحث
  const [searchTerm, setSearchTerm] = useState('');
  const [recordsPerPage, setRecordsPerPage] = useState(20);
  const [activityForm, setActivityForm] = useState({
    name: '',
    description: '',
    points: '',
    participantsCount: ''
  });

  // حالة التحقق من صحة النموذج
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // استدعاء hook إدارة الأنشطة
  const {
    activities,
    selectedActivity,
    setSelectedActivity,
    addActivity,
    updateActivity,
    deleteActivity,
    fetchActivities,
    exportToExcel
  } = useManageActivities(recordsPerPage, searchTerm);

  // التحقق من صحة النموذج
  const validateForm = () => {
    const errors = {};
    if (!activityForm.name.trim()) {
      errors.name = 'اسم النشاط مطلوب';
    }
    if (!activityForm.description.trim()) {
      errors.description = 'وصف النشاط مطلوب';
    }
    if (!activityForm.points) {
      errors.points = 'عدد النقاط مطلوب';
    } else if (Number(activityForm.points) < 0) {
      errors.points = 'عدد النقاط يجب أن يكون أكبر من أو يساوي صفر';
    }
    if (!activityForm.participantsCount) {
      errors.participantsCount = 'عدد المشتركين مطلوب';
    } else if (Number(activityForm.participantsCount) < 0) {
      errors.participantsCount = 'عدد المشتركين يجب أن يكون أكبر من أو يساوي صفر';
    }
    return errors;
  };

  // معالجة تغيير المدخلات
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setActivityForm(prev => ({
      ...prev,
      [name]: value
    }));
    // مسح رسالة الخطأ عند الكتابة
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // معالجة تقديم النموذج
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // التحقق من صحة النموذج
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      setIsSubmitting(false);
      return;
    }

    try {
      if (selectedActivity) {
        await updateActivity(selectedActivity.id, activityForm);
        alert('تم تحديث النشاط بنجاح');
      } else {
        await addActivity(activityForm);
        alert('تم إضافة النشاط بنجاح');
      }
      clearForm();
    } catch (error) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // تفريغ النموذج
  const clearForm = () => {
    setActivityForm({
      name: '',
      description: '',
      points: '',
      participantsCount: ''
    });
    setSelectedActivity(null);
    setFormErrors({});
  };

  // معالجة التعديل
  const handleEdit = (activity) => {
    setSelectedActivity(activity);
    setActivityForm({
      name: activity.name,
      description: activity.description,
      points: activity.points.toString(),
      participantsCount: activity.participantsCount.toString()
    });
    setFormErrors({});
  };

  // معالجة الحذف
  const handleDelete = async (activityId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا النشاط؟')) {
      try {
        await deleteActivity(activityId);
        alert('تم حذف النشاط بنجاح');
      } catch (error) {
        alert(error.message);
      }
    }
  };

  // معالجة التصدير إلى Excel
  const handleExportToExcel = async () => {
    try {
      if (activities.length === 0) {
        alert('لا توجد بيانات للتصدير');
        return;
      }
      await exportToExcel();
    } catch (error) {
      alert('حدث خطأ أثناء تصدير البيانات: ' + error.message);
    }
  };

  return (
    <div className="container">
      <h1 className="page-title">إدارة الأنشطة</h1>

      {/* نموذج إضافة/تعديل النشاط */}
      <div className="activity-form card">
        <h2>{selectedActivity ? 'تعديل نشاط' : 'إضافة نشاط جديد'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>اسم النشاط:</label>
            <input
              type="text"
              name="name"
              value={activityForm.name}
              onChange={handleInputChange}
              className={`form-control ${formErrors.name ? 'error' : ''}`}
              placeholder="أدخل اسم النشاط"
            />
            {formErrors.name && <span className="error-message">{formErrors.name}</span>}
          </div>

          <div className="form-group">
            <label>وصف النشاط:</label>
            <textarea
              name="description"
              value={activityForm.description}
              onChange={handleInputChange}
              className={`form-control ${formErrors.description ? 'error' : ''}`}
              rows="3"
              placeholder="أدخل وصف النشاط"
            />
            {formErrors.description && <span className="error-message">{formErrors.description}</span>}
          </div>

          <div className="form-row">
            <div className="form-group half-width">
              <label>عدد النقاط:</label>
              <input
                type="number"
                name="points"
                value={activityForm.points}
                onChange={handleInputChange}
                min="0"
                className={`form-control ${formErrors.points ? 'error' : ''}`}
                placeholder="أدخل عدد النقاط"
              />
              {formErrors.points && <span className="error-message">{formErrors.points}</span>}
            </div>

            <div className="form-group half-width">
              <label>عدد المشتركين:</label>
              <input
                type="number"
                name="participantsCount"
                value={activityForm.participantsCount}
                onChange={handleInputChange}
                min="0"
                className={`form-control ${formErrors.participantsCount ? 'error' : ''}`}
                placeholder="أدخل عدد المشتركين"
              />
              {formErrors.participantsCount && <span className="error-message">{formErrors.participantsCount}</span>}
            </div>
          </div>

          <div className="form-buttons">
            <button 
              type="submit" 
              className="primary-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'جاري الحفظ...' : selectedActivity ? 'تحديث النشاط' : 'إضافة النشاط'}
            </button>
            <button 
              type="button" 
              onClick={clearForm} 
              className="secondary-button"
              disabled={isSubmitting}
            >
              إعادة تعيين
            </button>
          </div>
        </form>
      </div>

      {/* شريط البحث وأدوات الإدارة */}
      <div className="search-toolbar">
        <div className="tools-group">
          <h3>إجمالي عدد الأنشطة: {activities.length}</h3>
          <button 
            onClick={handleExportToExcel} 
            className="export-button"
            disabled={activities.length === 0}
          >
            تصدير Excel
          </button>
        </div>
        <div className="search-box">
          <input
            type="text"
            placeholder="بحث باسم النشاط"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button onClick={() => fetchActivities()} className="search-button">
            بحث
          </button>
        </div>
        <select
          value={recordsPerPage}
          onChange={(e) => setRecordsPerPage(Number(e.target.value))}
          className="records-per-page"
        >
          <option value={20}>20 سجل</option>
          <option value={50}>50 سجل</option>
        </select>
      </div>

     
    {/* جدول الأنشطة */}
<div className="table-container">
  {activities.length > 0 ? (
    <table className="activities-table">
      <thead>
        <tr>
          <th className="narrow-column">اسم النشاط</th>
          <th className="wide-column">الوصف</th>
          <th className="narrow-column">النقاط</th>
          <th className="narrow-column">عدد المشتركين</th>
          <th className="narrow-column">تاريخ الإنشاء</th>
          <th className="narrow-column">الإجراءات</th>
        </tr>
      </thead>
      <tbody>
        {activities.map((activity) => (
          <tr key={activity.id}>
            <td>{activity.name}</td>
            <td className="description-cell wide-column">
              {activity.description}
            </td>
            <td className="number-cell">{activity.points}</td>
            <td className="number-cell">{activity.participantsCount}</td>
            <td className="date-cell">{activity.createdAt}</td>
            <td className="actions-cell">
              <button
                onClick={() => handleEdit(activity)}
                className="edit-button"
              >
                تعديل
              </button>
              <button
                onClick={() => handleDelete(activity.id)}
                className="delete-button"
              >
                حذف
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <div className="no-data">
      {searchTerm ? 'لا توجد نتائج للبحث' : 'لا توجد أنشطة مضافة'}
    </div>
  )}
</div>
    </div>
  );
}

export default ActivityManagementPage;