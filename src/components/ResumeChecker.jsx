import { useState } from 'react';
import './App.css';
import Spinner from './layout/Spinner';

function ResumeChecker() {
  const [jobDescription, setJobDescription] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const API_KEY = import.meta.env.VITE_API_KEY;

  const handleInputChange = (e) => {
    setJobDescription(e.target.value);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      alert('Please upload a valid PDF file.');
      e.target.value = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!jobDescription || !file) {
      alert('Please provide both job description and a PDF resume.');
      return;
    }

    setLoading(true);
    setResult('');

    const formData = new FormData();
    formData.append('job_description', jobDescription);
    formData.append('resume_file', file);

    try {
      const response = await fetch(`${BASE_URL}/services/rank-resume/`, {
        method: 'POST',
        headers: {
          'X-AUG-KEY': API_KEY,
        },
        body: formData,
      });

      const data = await response.json();
      if (data.status) {
        setResult(`Your resume matches the job description by ${data.data}.`);
      } else {
        setResult('There was an error processing your request.');
      }
    } catch (error) {
      setResult('An error occurred. Please try again.', error);
    } finally {
      setLoading(false);
      setJobDescription('');
      setFile(null);
    }
  };

  return (
    <div className="container">
      <h1>Resume Checker</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter job description"
          value={jobDescription}
          onChange={handleInputChange}
          required
        />
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          required
        />
        <button type="submit">Check Resume</button>
      </form>
      {loading ? <Spinner /> : result && <p>{result}</p>}
    </div>
  );
}

export default ResumeChecker;
