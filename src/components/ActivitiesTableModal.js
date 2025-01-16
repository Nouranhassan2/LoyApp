import React from 'react';

const ActivitiesTableModal = ({ activities, onClose }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <h2>تفاصيل الأنشطة</h2>
      <table>
        <thead>
          <tr>
            <th>اسم النشاط</th>
            <th>وصف النشاط</th>
            <th>عدد النقاط</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {activities.length > 0 ? (
            activities.map(activity => (
              <tr key={activity.id}>
                <td>{activity.name}</td>
                <td>{activity.description}</td>
                <td>{activity.points}</td>
                <td>
                  <button 
                    onClick={() => console.log(`Subscribed to ${activity.id}`)} 
                    className="subscribe-button"
                  >
                    اشتراك
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">لا توجد أنشطة متاحة</td>
            </tr>
          )}
        </tbody>
      </table>
      <button onClick={onClose} className="close-button">إغلاق</button>
    </div>
  </div>
);

export default ActivitiesTableModal;
