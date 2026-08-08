// ======================================
// ECE Computer Center
// script.js - Part 3A
// ======================================

"use strict";

// ===============================
// Global Variables
// ===============================

let generatedOTP = null;
let otpVerified = false;
let currentNote = "";

// ===============================
// Mobile Menu
// ===============================

const mobileMenu = document.getElementById("mobileMenu");

function toggleMenu() {

    mobileMenu.classList.toggle("show");

}





function closeMenu() {

    mobileMenu.classList.remove("show");

}

// Close menu after clicking menu link

document.querySelectorAll(".mobile-menu a").forEach(link => {

    link.addEventListener("click", () => {

        closeMenu();

    });

});

// ===============================
// Register Popup
// ===============================

const registerBox = document.getElementById("registerBox");

function openRegister() {

    registerBox.style.display = "flex";

}

function closeRegister() {

    registerBox.style.display = "none";

}

// ===============================
// Login Popup
// ===============================

const loginBox = document.getElementById("loginBox");

function openLogin() {

    if (loginBox)
        loginBox.style.display = "flex";

}

function closeLogin() {

    if (loginBox)
        loginBox.style.display = "none";

}

// ===============================
// Note Popup
// ===============================

const noteBox = document.getElementById("noteBox");

function openNote(noteId) {

    currentNote = noteId;

    const user =
        localStorage.getItem("studentEmail");

    if (!user) {

        openRegister();

        return;

    }

    document.getElementById("noteInput").value =
        noteId;

    noteBox.style.display = "flex";

}

function closeNoteBox() {

    noteBox.style.display = "none";

}

// ===============================
// Open Notes
// ===============================

function checkNote() {

    const id =
        document.getElementById("noteInput")
        .value
        .trim()
        .toUpperCase();

    switch (id) {

        case "CF101":

            window.location.href =
                "notes/cf101.html";

            break;

        case "WD102":

            window.location.href =
                "notes/wd102.html";

            break;

        case "EX202":

            window.location.href =
                "notes/ex202.html";

            break;

        case "TP301":

            window.location.href =
                "notes/tp301.html";

            break;

        default:

            alert("Invalid Note ID ❌");

    }

}

// ===============================
// Search Notes
// ===============================

function searchNotes() {

    const keyword =
        document.getElementById("searchNote")
        .value
        .toLowerCase();

    document
        .querySelectorAll(".note-card")
        .forEach(card => {

            const text =
                card.innerText.toLowerCase();

            card.style.display =
                text.includes(keyword)
                ? "block"
                : "none";

        });

}

// ===============================
// Close Popup
// ===============================

window.onclick = function (event) {

    if (event.target === registerBox) {

        closeRegister();

    }

    if (event.target === noteBox) {

        closeNoteBox();

    }

    if (loginBox && event.target === loginBox) {

        closeLogin();

    }

};



// ===============================
// EMAILJS CONFIG
// ===============================

emailjs.init("9gGKHifZbvMCwAYEG");

// ===============================
// SEND OTP
// ===============================

function sendOTP() {

    const email = document
        .getElementById("studentEmail")
        .value
        .trim();

    if (email === "") {

        alert("Enter Email First ❌");
        return;

    }

    otpVerified = false;

    generatedOTP = Math.floor(
        100000 + Math.random() * 900000
    );

    emailjs.send(

        "service_zz2tol8",

        "template_jqb7mh9",

        {
            email: email,
            otp: generatedOTP
        }

    )

    .then(() => {

        alert("OTP Sent Successfully ✅");

    })

    .catch((error) => {

        console.error(error);

        alert("OTP Send Failed ❌");

    });

}

// ===============================
// VERIFY OTP
// ===============================

function verifyOTP() {

    const otp = document
        .getElementById("otpInput")
        .value
        .trim();

    if (otp === "") {

        alert("Enter OTP ❌");
        return;

    }

    if (generatedOTP === null) {

        alert("Please Send OTP First ❌");
        return;

    }

    if (otp === generatedOTP.toString()) {

        otpVerified = true;

        alert("OTP Verified Successfully ✅");

    } else {

        otpVerified = false;

        alert("Wrong OTP ❌");

    }

}

// ===============================
// CREATE ACCOUNT
// ===============================

async function createAccount() {

    const name = document
        .getElementById("studentName")
        .value
        .trim();

    const email = document
        .getElementById("studentEmail")
        .value
        .trim();

    const password = document
        .getElementById("studentPassword")
        .value;

    if (!name || !email || !password) {

        alert("Please fill all fields ❌");
        return;

    }

    if (!otpVerified) {

        alert("Please verify OTP first ❌");
        return;

    }

    try {

        const response = await fetch("/register", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                name,
                email,
                password

            })

        });

        const data = await response.json();

        if (data.success) {

            localStorage.setItem(
                "studentName",
                name
            );

            localStorage.setItem(
                "studentEmail",
                email
            );

            alert("Account Created Successfully ✅");

            closeRegister();

            if (currentNote !== "") {

                document.getElementById("noteInput").value = currentNote;

                noteBox.style.display = "flex";

            } else {

                window.location.href = "profile.html";

            }

        } else {

            alert(data.message);

        }

    }

    catch (error) {

        console.error(error);

        alert("Unable to connect to server ❌");

    }

}



// ===============================
// LOGIN ACCOUNT
// ===============================

async function loginAccount() {

    const email = document
        .getElementById("loginEmail")
        .value
        .trim();

    const password = document
        .getElementById("loginPassword")
        .value;

    if (!email || !password) {

        alert("Enter Email & Password ❌");
        return;

    }

    try {

        const response = await fetch("/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                email,
                password

            })

        });

        const data = await response.json();

        if (data.success) {

            localStorage.setItem(
                "studentName",
                data.name
            );

            localStorage.setItem(
                "studentEmail",
                email
            );

            alert("Login Successful ✅");

            closeLogin();

            window.location.href = "profile.html";

        } else {

            alert(data.message || "Invalid Email or Password ❌");

        }

    }

    catch (error) {

        console.error(error);

        alert("Server Connection Error ❌");

    }

}

// ===============================
// FORGOT PASSWORD
// ===============================

async function forgotPassword() {

    const email = prompt(
        "Enter your registered email"
    );

    if (!email) return;

    try {

        const response = await fetch("/forgot-password", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                email

            })

        });

        const data = await response.json();

        alert(data.message);

    }

    catch (error) {

        console.error(error);

        alert("Server Error ❌");

    }

}

// ===============================
// LOGOUT
// ===============================

function logout() {

    if (confirm("Are you sure you want to logout?")) {

        localStorage.removeItem("studentName");
        localStorage.removeItem("studentEmail");

        window.location.href = "index.html";

    }

}

// ===============================
// AUTO LOGIN CHECK
// ===============================

window.addEventListener("load", () => {

    const email = localStorage.getItem("studentEmail");

    const profileName = document.getElementById("profileName");

    if (profileName && email) {

        profileName.innerText =
            localStorage.getItem("studentName");

    }

});

// ===============================
// OPEN PROFILE
// ===============================

function openProfile() {

    if (localStorage.getItem("studentEmail")) {

        window.location.href = "profile.html";

    } else {

        openLogin();

    }

}



// ===============================
// ECE Computer Center
// script.js - Part 3D
// ===============================

// ===============================
// TOAST MESSAGE
// ===============================

function showToast(message, type = "success") {

    let toast = document.createElement("div");

    toast.className = "toast " + type;

    toast.innerText = message;

    document.body.appendChild(toast);

    setTimeout(() => {

        toast.classList.add("show");

    }, 100);

    setTimeout(() => {

        toast.classList.remove("show");

        setTimeout(() => {

            toast.remove();

        }, 300);

    }, 3000);

}

// ===============================
// LOADING
// ===============================

function showLoading() {

    let loader = document.getElementById("loader");

    if (loader) {

        loader.style.display = "flex";

    }

}

function hideLoading() {

    let loader = document.getElementById("loader");

    if (loader) {

        loader.style.display = "none";

    }

}

// ===============================
// PROFILE
// ===============================

function loadProfile() {

    const name = localStorage.getItem("studentName");

    const email = localStorage.getItem("studentEmail");

    if (document.getElementById("profileName")) {

        document.getElementById("profileName").innerText =
            name || "Student";

    }

    if (document.getElementById("profileEmail")) {

        document.getElementById("profileEmail").innerText =
            email || "No Email";

    }

}

// ===============================
// SESSION CHECK
// ===============================

function checkSession() {

    const email =
        localStorage.getItem("studentEmail");

    if (!email &&
        window.location.pathname.includes("profile.html")) {

        alert("Please Login First");

        window.location.href = "index.html";

    }

}

// ===============================
// DARK MODE
// ===============================

function toggleDarkMode() {

    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {

        localStorage.setItem("theme", "dark");

    }

    else {

        localStorage.setItem("theme", "light");

    }

}

(function () {

    const theme = localStorage.getItem("theme");

    if (theme === "dark") {

        document.body.classList.add("dark-mode");

    }

})();

// ===============================
// SCROLL TO TOP
// ===============================

function scrollTopPage() {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


async function loadHomeCourses() {

    const courseGrid = document.getElementById("courseGrid");

    if (!courseGrid) return;

    try {

        const response = await fetch("/courses");

        const courses = await response.json();

        courseGrid.innerHTML = "";

        courses.forEach(course => {

            courseGrid.innerHTML += `
                <div class="course-card">
                    <div class="course-icon">💻</div>

                    <h3>${course.name}</h3>

                    <p>${course.description || ""}</p>

                    <p>Duration: ${course.duration}</p>

                    <p>Fees: ₹${course.fees}</p>

                    <button class="course-btn"
                        onclick="openRegister()">
                        Enroll Now
                    </button>
                </div>
            `;

        });

    } catch (error) {

        console.error(error);

        courseGrid.innerHTML =
            "<p>Unable to load courses ❌</p>";

    }
} 

// ===============================
// WINDOW LOAD
// ===============================

window.addEventListener("load", () => {

    hideLoading();

    checkSession();

    loadProfile();
    
    loadHomeCourses();

});


