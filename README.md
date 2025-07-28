Smart Grow 🌱

> A modern indoor plant app integrating AI, ML, and IoT technologies into a unified Flutter application. 



Overview

Smart Grow is designed to revolutionize smart gardening by combining:

ML‑powered plant health monitoring: Diagnose plant conditions using TensorFlow Lite models.

AI‑based growth prediction: Forecast optimal growth timelines and conditions.

IoT integration: Automate watering, lighting, and environmental controls using connected sensors.

User‑friendly Flutter interface: Cross‑platform mobile and web support with live telemetry and alerts. 



---

🚀 Features

1. Plant Disease Detection

Use your device camera to capture plant images. The embedded TFLite model classifies diseases like tomato mold, gray leaf spot, rust, early blight, leaf scorch, and mosaic virus. 

2. Farm Management Dashboard

Organize planting & harvesting data via Cloud Firestore. Visualize metrics and timelines. 

3. IoT Telemetry Monitoring

Monitor real‑time sensor readings: soil moisture, humidity, pH, salinity, temperature. Trigger alerts automatically using Firebase Cloud Functions. 

4. Weather & News Updates

Integrates News API for agricultural insights and OpenWeather API for local farm weather conditions. 


---

🧠 Tech Stack

Layer	Technologies

Flutter App	Dart, Flutter Web, Flutter Mobile
State Management	Bloc, Provider
Backend Services	Firebase Auth, Firestore, Realtime DB, Cloud Functions, Cloud Messaging
ML Model	Google Cloud AutoML Vision trained TFLite model
Sensor Simulation	Device simulator broadcasting to Realtime Database


Packages used include provider, flutter_bloc, fl_chart, and getwidget. 


---

🔧 Setup & Installation

1. Clone the repo

git clone https://github.com/AtharvaIngle/Smart-Grow.git
cd Smart-Grow


2. Configure Firebase

Create a new Firebase project.

Add Android/iOS/web apps and download google-services.json or GoogleService‑Info.plist.

Enable Authentication, Firestore, Realtime Database, Cloud Functions, Cloud Messaging.

Replace the sample config file in android/, ios/, or web/.



3. Run IoT Simulator (optional)

Use the included device simulator to send fake telemetry to Realtime DB.



4. Deploy Cloud Functions

Navigate to the functions/ directory (if available) or the separate Farmassist Firebase repository.



5. Install dependencies and run

flutter pub get
flutter run


6. (Optional) Train your own ML model using AutoML Vision by following Google’s quickstart resources. 




---

📂 Repository Structure

.
├── android/             # Android app code
├── ios/                 # iOS app code
├── web/                 # Flutter web entry
├── lib/
│   ├── bloc/            # State management
│   ├── data/            # Models & services
│   ├── ui/              # Screens & widgets
│   └── utils/           # Utility functions
├── test/                # Unit & integration tests
├── model.tflite         # Deployed plant disease model
├── pubspec.yaml
└── README.md
