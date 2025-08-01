var SignUser, SignEmail, SignPass, SignConfirmPass;

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

function SignIn() {
    SignUser = document.getElementById("SignUser").value.trim();
    SignEmail = document.getElementById("SignEmail").value.trim();
    SignPass = document.getElementById("SignPass").value;
    SignConfirmPass = document.getElementById("SignConfirmPass").value;

    // Basic validation with notifications
    if (!SignUser) {
        showNotification("Please enter a username", "error");
        return;
    }
    
    if (SignUser.length < 3) {
        showNotification("Username must be at least 3 characters long", "error");
        return;
    }
    
    if (!SignEmail) {
        showNotification("Please enter an email address", "error");
        return;
    }
    
    if (!validateEmail(SignEmail)) {
        showNotification("Please enter a valid email address", "error");
        return;
    }
    
    if (!SignPass) {
        showNotification("Please enter a password", "error");
        return;
    }
    
    if (SignPass.length < 6) {
        showNotification("Password must be at least 6 characters long", "error");
        return;
    }
    
    if (SignPass !== SignConfirmPass) {
        showNotification("Passwords don't match!", "error");
        document.getElementById("wrongPass").style.display = "block";
        return;
    }

    const user = {
        CuserName: SignUser,
        email: SignEmail,
        Cpassword: SignPass,
    };

    localStorage.setItem("user", JSON.stringify(user));

    document.getElementById("wrongPass").style.display = "none";
    showNotification("Account created successfully! Welcome to Bayanihan!", "success");
    
    // Delay redirect to show success message
    setTimeout(() => {
        window.location.href = "index.html";
    }, 1500);
}

function LogIn() {
    var username = document.getElementById("LoginDet").value.trim();
    var password = document.getElementById("PassDet").value;

    // Basic validation with notifications
    if (!username) {
        showNotification("Please enter your username or email", "error");
        return;
    }
    
    if (!password) {
        showNotification("Please enter your password", "error");
        return;
    }

    const userData = JSON.parse(localStorage.getItem("user"));

    if (!userData) {
        showNotification("No account found. Please sign up first!", "error");
        return;
    }

    if (
        userData &&
        (userData.CuserName === username || userData.email === username) &&
        userData.Cpassword === password
    ) {
        document.getElementById("wrongPass").style.display = "none";
        showNotification("Welcome back! Logging you in...", "success");
        
        // Delay redirect to show success message
        setTimeout(() => {
            // Redirect to main application or dashboard
            window.location.href = "dashboard.html"; // still on production
        }, 1500);
    } else {
        document.getElementById("wrongPass").style.display = "block";
        showNotification("Invalid username/email or password!", "error");
    }
}