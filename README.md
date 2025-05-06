# Welcome to Proxypakki

Contrary to what the name might suggest, Proxypakki is a highly secure and robust attendance recording and tracking application. It's not just reliable —> it's flexible, efficient, and user-friendly.

Using biometric verification, geo-fencing, and other advanced methods, Proxypakki ensures that proxy attendance is virtually impossible. The app also boasts an intuitive UI, a well-structured backend, and seamless data flow.

## 👨‍💻 Contributors

1. Ayushmaan Kumar
2. KLN Sai Aditya
3. Hammad Malik

---

## 🎯 The Flow

There are two primary actors in the app:
**1. Student**
**2. Faculty**

If and when a class is initiated by the faculty, students receive a notification. Upon clicking it, they are redirected to the **Location Verification** page. Here, their real-time location is matched with the coordinates defined in `location.jsx`. Once verified, the app prompts **Biometric Verification** to confirm identity. Only after passing *both* checkpoints is the student officially marked **Present.

---

## 🧑‍🎓 Students

Students shall register using their official college email ID. Once in, they can:

* View **Ongoing Classes** in real time
* Access detailed attendance records in **Course Analytics**

### 📍 Current Class

Whenever a class is live, students can access it via the *Current Class* section. The process:

1. Notification click → Location verification (`location.jsx`)
2. Biometric scan
3. Attendance marked upon successful validation

### 📊 Course Analytics

A breakdown of attendance data for all enrolled courses:

1. Total hours conducted
2. Hours attended
3. Hours missed
4. Attendance percentage

Simple. Informative. Transparent.

---

## 👨‍🏫 Faculty

Faculty members shall register using their institutional email ID and shall predefine the courses they are to instruct via the "Your Courses" section. Once configured, they may then proceed to:

* Start and manage classes
* Monitor attendance in real time
* Export comprehensive reports

### ▶️ Start Class

Upon clicking "Start Class," the faculty fills in:

* **Course Name**
* **Session Type**

  * Class (1.5 hours)
  * Tutorial (1 hour)
  * Lab (2 hours)
* **Batch**

Once submitted, a notification is dispatched—via email and app—to all students in the selected batch.

### 🔎 Current Class

Displays the Present/Absent status of each student for the ongoing class. An export option allows you to generate a real-time attendance report.

### 📥 Attendance Report

Offers detailed attendance statistics across all courses, with an option to export in `.csv` or `.xlsx` format.

### 📚 Your Courses

This section allows the instructor to define courses for the current semester. These presets simplify class creation.

---

## 🔐 Anti-Proxy Measures

1. **Geo-fencing Accuracy**
   Ensures students are physically within the designated classroom area before marking attendance.

2. **Biometric Verification**
   Confirms that the right individual—not just the right phone—is present.

3. **Device Lock-in**
   Only one attendance entry is allowed per device per session. Attempting to log out and mark for another account triggers a security alert.

---

Now that you're familiar with Proxypakki's robust feature set, it’s time to try it out for yourself. 


## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.


Thank you !!
Made **with** love ❤️❤️ and **for** credits 🪙.
