import { useAuth } from '../context/AuthContext';
import { auth, db } from '../firebaseConfig';
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';

const useLogin = () => {
  const { setCurrentUser } = useAuth();

  // تسجيل الدخول بالبريد الإلكتروني وكلمة المرور
  const handleLogin = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // جلب بيانات المستخدم من Firestore وتحديث currentUser
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setCurrentUser({ uid: user.uid, email: user.email, ...userData });
      } else {
        // إذا لم يكن للمستخدم بيانات في Firestore
        setCurrentUser({ uid: user.uid, email: user.email });
      }
    } catch (error) {
      console.error('Error in handleLogin:', error);
      throw error;
    }
  };

  // تسجيل مستخدم جديد
  const handleRegister = async (username, email, password, phoneNumber) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // إضافة بيانات المستخدم إلى Firestore
      const userData = {
        id: user.uid,
        name: username,
        email: user.email,
        role: 'member',
        isActive: true,
        createdAt: Timestamp.now(),
        points: 0,
        referralCode: '',
        phoneNumber: phoneNumber || '',
        city: '',
        district: '',
        birthDate: null,
        joinDate: Timestamp.now(),
        membershipLevel: 'bronze',
      };

      await setDoc(doc(db, 'users', user.uid), userData);

      // تحديث currentUser
      setCurrentUser({ uid: user.uid, ...userData });
    } catch (error) {
      console.error('Error in handleRegister:', error);
      throw error;
    }
  };

  // استعادة كلمة المرور
  const handleForgotPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Error in handleForgotPassword:', error);
      throw error;
    }
  };

  // تسجيل الدخول باستخدام جوجل
  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // جلب بيانات المستخدم من Firestore
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        // إذا لم يكن موجودًا، أضفه مع دور 'member' وتأكد من أن الحقل 'name' موجود
        const userData = {
          id: user.uid,
          name: user.displayName || user.email || 'مستخدم بدون اسم',
          email: user.email || '',
          role: 'member',
          isActive: true,
          createdAt: Timestamp.now(),
          points: 0,
          referralCode: '',
          phoneNumber: user.phoneNumber || '',
          city: '',
          district: '',
          birthDate: null,
          joinDate: Timestamp.now(),
          membershipLevel: 'bronze',
        };
        await setDoc(docRef, userData);
        setCurrentUser({ uid: user.uid, ...userData });
      } else {
        // المستخدم موجود، تحديث currentUser
        const userData = docSnap.data();
        setCurrentUser({ uid: user.uid, ...userData });
      }
    } catch (error) {
      console.error('Error during Google Sign-In:', error);
      throw error;
    }
  };

  return {
    handleLogin,
    handleRegister,
    handleForgotPassword,
    handleGoogleSignIn,
  };
};

export default useLogin;
