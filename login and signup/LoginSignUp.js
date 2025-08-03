import {getFirestore, doc, setDoc, getDoc} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyCAlGWOQoAYhk3yETmVLg1ro4Ez1BY3uv4",
  authDomain: "aba-bayanihan.firebaseapp.com",
  projectId: "aba-bayanihan",
  storageBucket: "aba-bayanihan.firebasestorage.app",
  messagingSenderId: "407997469518",
  appId: "1:407997469518:web:80f346343748696535041f"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app)


//notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    const styles = {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 25px',
        borderRadius: '10px',
        color: 'white',
        fontWeight: '600',
        zIndex: '10000',
        transform: 'translateX(400px)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
        backdropFilter: 'blur(10px)'
    };
    
    const typeStyles = {
        success: { background: 'linear-gradient(135deg, #4CAF50, #45a049)' },
        error: { background: 'linear-gradient(135deg, #f44336, #d32f2f)' },
        info: { background: 'linear-gradient(135deg, #2196F3, #1976D2)' }
    };
    
    Object.assign(notification.style, styles, typeStyles[type]);
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Basic validation function
function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}

async function SignIn() {
  const SignUser = document.getElementById("SignUser").value.trim();
  const SignEmail = document.getElementById("SignEmail").value.trim();
  const SignPass = document.getElementById("SignPass").value;
  const SignConfirmPass = document.getElementById("SignConfirmPass").value;

  // Basic validation
  if (!SignUser) return showNotification("Please enter a username", "error");
  if (SignUser.length < 3) return showNotification("Username must be at least 3 characters", "error");
  if (!SignEmail) return showNotification("Please enter an email address", "error");
  if (!validateEmail(SignEmail)) return showNotification("Please enter a valid email", "error");
  if (!SignPass) return showNotification("Please enter a password", "error");
  if (SignPass.length < 6) return showNotification("Password must be at least 6 characters", "error");
  if (SignPass !== SignConfirmPass) {
    showNotification("Passwords don't match!", "error");
    document.getElementById("wrongPass").style.display = "block";
    return;
  }

  try {
  // Check if username already exists
  const existingDoc = await getDoc(doc(db, "usernames", SignUser));
  if (existingDoc.exists()) {
    showNotification("Username already taken. Please choose another.", "error");
    return;
  }

  // Create user in Firebase Auth
  const userCredential = await createUserWithEmailAndPassword(auth, SignEmail, SignPass);
  console.log("✅ User created:", userCredential.user.uid);

  // Save email to Firestore under that username
  await setDoc(doc(db, "usernames", SignUser), { email: SignEmail });
  console.log("✅ Email stored in Firestore for:", SignUser);

  // Final UI feedback and redirect
  document.getElementById("wrongPass").style.display = "none";
  showNotification("Account created successfully! Welcome to Bayanihan!", "success");

  setTimeout(() => {
    window.location.href = "index.html";
  }, 1500);

} catch (error) {
  console.error("❌ Signup error:", error.code);

  if (error.code === "auth/email-already-in-use") {
    showNotification("This email is already registered. Please log in instead.", "error");
  } else if (error.code === "auth/invalid-email") {
    showNotification("That email is not valid. Please check your input.", "error");
  } else if (error.code === "auth/weak-password") {
    showNotification("Password is too weak. Please use at least 6 characters.", "error");
  } else {
    showNotification(error.message || "Signup failed. Please try again.", "error");
  }
}
}
window.SignIn = SignIn;
async function LogIn() {
  const loginInput = document.getElementById("LoginDet").value.trim();
  const password = document.getElementById("PassDet").value;

  const wrongPassMessage = document.getElementById("wrongPass");
  wrongPassMessage.style.display = "none";

  if (!loginInput || !password) {
    showNotification("Please enter both username/email and password.", "error");
    return;
  }

  let email = loginInput;

  try {
    const isEmail = loginInput.includes("@");

    if (!isEmail) {
      // Try to get email from Firestore using username
      const docRef = doc(db, "usernames", loginInput);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        email = docSnap.data().email;
      } else {
        // fake dummy email to avoid leaking username validity
        email = "fakeuser@example.com";
      }
    }

    // Try to sign in (will fail for fake email or wrong password)
    await signInWithEmailAndPassword(auth, email, password);
    showNotification("Login successful!", "success");
    // window.location.href = "dashboard.html";
  } catch (error) {
    // console.log("Login error code:", error.code);
    showNotification("Invalid login credentials.", "error");
    wrongPassMessage.style.display = "block";
    // Don't log the error — it could expose hints
    // console.error(error);
  }
}


window.LogIn = LogIn;