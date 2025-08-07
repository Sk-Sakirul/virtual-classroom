import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth"
import { auth } from "./firebase"

// export const authService = {
//     login: async (email, password) => {
//         const userCredential = await signInWithEmailAndPassword(auth, EmailAuthCredential, password);
//         return {user: userCredential.user, role: "student"}
//     },
//     register: async (email, password, role) => {
//         const userCredential = await createUserWithEmailAndPassword(auth, email, password);
//         return {user: userCredential.user, role};
//     },
//     logout: async () => {
//         await signOut(auth);
//     }
// }

export const authService = {
  login: async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    return {
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || "",
      },
      role: "student", 
    };
  },

  register: async (email, password, role) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    return {
      user: {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || "",
      },
      role,
    };
  },

  logout: async () => {
    await signOut(auth);
  },
};
