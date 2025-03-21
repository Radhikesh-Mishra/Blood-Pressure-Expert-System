import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./BPForm.css"; // Custom CSS for extra styling
import { Info } from 'lucide-react';

const BPForm = () => {
  const [formData, setFormData] = useState({});
  const [result, setResult] = useState(null);
  const [infoVisible, setInfoVisible] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? (checked ? 1 : 0) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:5000/predict", formData);
      console.log("API Response:", response.data); // Log the response before updating state
      setResult(response.data);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleReset = () => {
    setFormData({});
    setResult(null);
  };

  const toggleInfo = (field) => {
    setInfoVisible((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-lg sticky-top">
        <div className="container">
          <a className="navbar-brand fw-bold" href="/">Blood Pressure Expert</a>
        </div>
      </nav>

      <div className="container py-4 d-flex flex-column align-items-center">
        {result ? (
          <div className="card p-4 shadow-lg w-100" style={{ maxWidth: "600px" }}>
            <h2 className="text-primary text-center">Prediction Result</h2>
            <p><strong>BP Stage:</strong> {result?.bp_stage || "N/A"}</p>
            <p>
              <strong>Heart Disease Prediction:</strong>{" "}
              {result?.prediction === 1
                ? "There might be some risks. It’s best to consult a doctor for a check-up."
                : "You are doing well! Keep maintaining a healthy lifestyle." || "N/A"}
            </p>

            <h3>Recommendations:</h3>
            <p>{result?.bp_info?.Recommendations || "No recommendations available"}</p>

            <h3>Symptoms:</h3>
            <ul>
              {result?.bp_info?.Symptoms?.length > 0 ? (
                result.bp_info.Symptoms.map((item, index) => <li key={index}>{item}</li>)
              ) : (
                <li>No symptoms recorded</li>
              )}
            </ul>

            <h3>Prone Diseases:</h3>
            <ul>
              {result?.bp_info?.["Prone Diseases"]?.length > 0 ? (
                result.bp_info["Prone Diseases"].map((item, index) => (
                  <li key={index}>
                    <a
                      href={`https://medlineplus.gov/${item.toLowerCase().replace(/\s+/g, '')}.html`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item}
                    </a>

                  </li>
                ))
              ) : (
                <li>No major risk detected</li>
              )}
            </ul>


            <h3>Precautions:</h3>
            <ul>
              {result?.bp_info?.Precautions?.length > 0 ? (
                result.bp_info.Precautions.map((item, index) => <li key={index}>{item}</li>)
              ) : (
                <li>No specific precautions suggested</li>
              )}
            </ul>

            <h3>Diet:</h3>
            <ul>
              {result?.bp_info?.Diet?.length > 0 ? (
                result.bp_info.Diet.map((item, index) => <li key={index}>{item}</li>)
              ) : (
                <li>No diet recommendations available</li>
              )}
            </ul>

            <h3>Exercises:</h3>
            <ul>
              {result?.bp_info?.Exercises?.length > 0 ? (
                result.bp_info.Exercises.map((item, index) => <li key={index}>{item}</li>)
              ) : (
                <li>No exercise recommendations available</li>
              )}
            </ul>

            <button onClick={handleReset} className="btn btn-primary mt-3 w-100">Reset</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card p-4 shadow-lg w-100" style={{ maxWidth: "600px" }}>
            <h2 className="text-primary mb-3 text-center">Enter Your Details</h2>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Age:</label>
                <input type="number" name="age" className="form-control" onChange={handleChange} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Gender:</label>
                <select name="gender" className="form-select" onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="0">Male</option>
                  <option value="1">Female</option>
                </select>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Systolic Blood Pressure (SBP):
                  <Info className="ms-2 text-info cursor-pointer" size={18} onClick={() => toggleInfo("sbp")} />
                  {infoVisible.sbp && <small className="text-muted"> The pressure in your arteries when your heart beats (higher number in BP readings).</small>}
                </label>
                <input type="number" name="sbp" className="form-control" onChange={handleChange} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Diastolic Blood Pressure (DBP):
                  <Info className="ms-2 text-info cursor-pointer" size={18} onClick={() => toggleInfo("dbp")} />
                  {infoVisible.dbp && <small className="text-muted"> The pressure in your arteries when your heart is at rest between beats (lower number in BP readings).</small>}
                </label>
                <input type="number" name="dbp" className="form-control" onChange={handleChange} required />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Chest Pain Type:</label>
                <select name="chestpain" className="form-select" onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="0">No chest pain(Type 0)</option>
                  <option value="1">Non-Anginal Pain (Type 1)</option>
                  <option value="2">Atypical Angina (Type 2)</option>
                  <option value="3">Typical Angina (Type 3) </option>
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Resting BP:
                  <Info className="ms-2 text-info cursor-pointer" size={18} onClick={() => toggleInfo("restingbp")} />
                  {infoVisible.restingbp && <small className="text-muted"> The blood pressure measured when a person is at rest, used as a baseline.</small>}
                </label>
                <input type="number" name="restingBP" className="form-control" onChange={handleChange} required />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Serum Cholesterol:
                  <Info className="ms-2 text-info cursor-pointer" size={18} onClick={() => toggleInfo("serumCholestrol")} />
                  {infoVisible.serumCholestrol && <small className="text-muted"> The total amount of cholesterol in your blood.</small>}
                </label>
                <input type="number" name="serumcholestrol" className="form-control" onChange={handleChange} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Fasting Blood Sugar:
                  <Info className="ms-2 text-info cursor-pointer" size={18} onClick={() => toggleInfo("fbs")} />
                  {infoVisible.fbs && <small className="text-muted"> Blood sugar level after fasting for at least 8 hours, used to check diabetes risk.</small>}
                </label>
                <select name="fastingbloodsugar" className="form-select" onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Max Heart Rate:
                  <Info className="ms-2 text-info cursor-pointer" size={18} onClick={() => toggleInfo("mhr")} />
                  {infoVisible.mhr && <small className="text-muted"> The highest number of beats per minute your heart can achieve during intense activity.</small>}
                </label>
                <input type="number" name="maxheartrate" className="form-control" onChange={handleChange} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Exercise Induced Angina:
                  <Info className="ms-2 text-info cursor-pointer" size={18} onClick={() => toggleInfo("eir")} />
                  {infoVisible.eir && <small className="text-muted"> Chest pain triggered by physical activity, indicating potential heart disease.</small>}
                </label>
                <select name="exerciseangia" className="form-select" onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="1">Yes</option>
                  <option value="0">No</option>
                </select>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Oldpeak:
                  <Info className="ms-2 text-info cursor-pointer" size={18} onClick={() => toggleInfo("oldpeak")} />
                  {infoVisible.oldpeak && <small className="text-muted"> ST depression in ECG readings, showing heart stress due to reduced blood flow.</small>}
                </label>
                <input type="number" step="0.1" name="oldpeak" className="form-control" onChange={handleChange} required />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Number of Major Vessels:
                  <Info className="ms-2 text-info cursor-pointer" size={18} onClick={() => toggleInfo("nomv")} />
                  {infoVisible.nomv && <small className="text-muted"> Count of large coronary arteries colored by contrast in a test, indicating blockages.</small>}
                </label>
                <select name="noofmajorvessels" className="form-select" onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>
            </div>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Slope:
                  <Info className="ms-2 text-info cursor-pointer" size={18} onClick={() => toggleInfo("slope")} />
                  {infoVisible.slope && <small className="text-muted"> The pattern of ST segment changes in an ECG, helping assess heart conditions.</small>}
                </label>
                <select name="slope" className="form-select" onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="1">Upsloping</option>
                  <option value="2">Flat</option>
                  <option value="3">Downsloping</option>
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Resting ECG:
                  <Info className="ms-2 text-info cursor-pointer" size={18} onClick={() => toggleInfo("recg")} />
                  {infoVisible.recg && <small className="text-muted"> An electrocardiogram taken while resting to detect heart abnormalities.</small>}
                </label>
                <select name="restingrelectro" className="form-select" onChange={handleChange} required>
                  <option value="">Select</option>
                  <option value="0">Normal</option>
                  <option value="1">ST-T wave abnormality</option>
                  <option value="2">Left ventricular hypertrophy</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-success w-100">Predict</button>
          </form>
        )}
      </div>
    </div>

  );
};

export default BPForm;
