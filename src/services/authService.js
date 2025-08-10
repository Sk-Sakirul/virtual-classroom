import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase.js";

class AuthService {
  async signUp(email, password, displayName, role = "student") {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = result.user;

      await updateProfile(user, { displayName });

      // Store additional user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        role: role,
        createdAt: new Date().toISOString(),
        isActive: true,
      });

      return {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        role: role,
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async signIn(email, password) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      // Get user role from Firestore
      const userDoc = await getDoc(doc(db, "users", user.uid));
      const userData = userDoc.exists() ? userDoc.data() : {};

      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || email,
        role: userData.role || "student",
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async signInWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if user exists in Firestore, if not create
      const userDoc = await getDoc(doc(db, "users", user.uid));
      let userData = {};

      if (!userDoc.exists()) {
        userData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          role: "student",
          createdAt: new Date().toISOString(),
          isActive: true,
        };
        await setDoc(doc(db, "users", user.uid), userData);
      } else {
        userData = userDoc.data();
      }

      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: userData.role || "student",
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async signOut() {
    try {
      await signOut(auth);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  getCurrentUser() {
    return auth.currentUser;
  }
}

export default new AuthService();

