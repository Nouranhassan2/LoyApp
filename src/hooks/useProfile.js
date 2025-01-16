// hooks/useProfile.js
import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const useProfile = (currentUser) => {
  const [profile, setProfile] = useState(null);
  const [referralLinks, setReferralLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentUser) {
      fetchProfile();
      fetchReferralLinks(currentUser.uid); // Fetch referral links
    }
  }, [currentUser]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        setProfile(userDoc.data());
      }
    } catch (err) {
      setError('حدث خطأ أثناء جلب البيانات');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReferralLinks = async (memberId) => {
    try {
      setLoading(true);
      const referralLinksRef = collection(db, 'referralLinks');
      const q = query(referralLinksRef, where('memberId', '==', memberId));
      const snapshot = await getDocs(q);

      const links = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setReferralLinks(links);
    } catch (err) {
      setError('حدث خطأ أثناء جلب روابط الإحالة');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updatedData) => {
    try {
      setLoading(true);
      await updateDoc(doc(db, 'users', currentUser.uid), updatedData);
      await fetchProfile();
      return true;
    } catch (err) {
      setError('حدث خطأ أثناء تحديث البيانات');
      console.error(err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    referralLinks,
    loading,
    error,
    updateProfile,
    refreshProfile: fetchProfile,
  };
};

export default useProfile;
