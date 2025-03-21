# Blood Pressure Expert System

## Overview
The **Blood Pressure Expert System** is a machine learning-based web application designed to predict an individual's **blood pressure stage** and **possibility of heart disease** using various health parameters. The system also provides **personalized recommendations** for precautions, diet, exercises, and information about diseases linked to each blood pressure stage.

## Features
- **Heart Disease Prediction:** Uses ML to determine the likelihood of heart disease based on features like fasting sugar level, serum cholesterol, resting blood pressure, max heart rate, chest pain type, etc.
- **Blood Pressure Stage Prediction:** Categorizes blood pressure into:
  - Hypotension (Stage 1 & 2)
  - Normal
  - Prehypertension
  - Hypertension (Stage 1, 2, & 3)
  - Hypertensive Crisis
- **Personalized Recommendations:** Based on the predicted stage, users receive:
  - **Precautions**
  - **Diet Plans**
  - **Exercise Routines**
  - **Symptoms**
  - **Prone Diseases** (clickable links redirect to MedlinePlus for more details)
- **User-Friendly UI:**
  - **React.js with Bootstrap for responsive design**
  - **Interactive form** with information tooltips for each input field
  - **Clear display of predictions and recommendations**

## Tech Stack
### Frontend:
- React.js
- React Bootstrap

### Backend:
- Python (Flask for API handling)
- Machine Learning Model for predictions

## Installation & Setup
### Prerequisites
- **Node.js** and **npm** installed
- **Python (3.x)** installed
- **Virtual environment (venv)** setup in the backend

### Steps to Run the Project
#### 1. Clone the Repository
```sh
 git clone https://github.com/your-username/bp-expert-system.git
 cd bp-expert-system
```

#### 2. Backend Setup (Flask + ML Model)
```sh
 cd server
 python -m venv myenv  # Create a virtual environment
 source myenv/bin/activate  # (Linux/macOS)
 myenv\Scripts\activate  # (Windows)
 pip install -r requirements.txt  # Install dependencies
 python server.py  # Start the Flask server
```

#### 3. Frontend Setup (React.js)
```sh
 cd client
 npm install  # Install dependencies
 npm run dev  # Start the React frontend
```

## Usage
1. Open the web app in a browser.
2. Fill out the form with required health details.
3. Click submit to receive predictions and recommendations.
4. Click on disease names for more information on MedlinePlus.

### Some images of the system
- Home
  ![image](https://github.com/user-attachments/assets/596b246d-05c0-41f2-887c-75f34c76252d)

- Entering Details
  ![image](https://github.com/user-attachments/assets/ac9567df-9909-4047-aed9-83597ae6f5e7)

- Prediction
  ![image](https://github.com/user-attachments/assets/30a9ab8b-ca30-45d4-b390-809b44697455)
