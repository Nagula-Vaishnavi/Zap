import React, { useState } from 'react';
import { ClipLoader } from 'react-spinners';
import './ProjectForm.css';

interface TeamMember {
  name: string;
  rollNumber: string;
  gender: string;
}

interface ProjectResult {
  resultImages?: string[];
  codeOutput?: string;
  aiGeneratedContent?: string | boolean;
}

const ProjectForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    projectDescription: '',
    projectCode: '',
    department: '',
    mainProfessor: '',
    mainProfessor_designation: '',
    professorDepartment: '',
    secondaryProfessor: '',
    secondaryProfessor_designation: '',
    course: '',
    teamMembers: [{ name: '', rollNumber: '', gender: 'Male' }] as TeamMember[],
    result: {
      resultImages: [] as string[],
      codeOutput: '',
      aiGeneratedContent: false
    } as ProjectResult
  });

  const handleTeamMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    const updatedMembers = [...formData.teamMembers];
    updatedMembers[index][field] = value;
    setFormData({ ...formData, teamMembers: updatedMembers });
  };

  const addTeamMember = () => {
    setFormData({
      ...formData,
      teamMembers: [...formData.teamMembers, { name: '', rollNumber: '', gender: 'Male' }]
    });
  };

  const removeTeamMember = (index: number) => {
    if (formData.teamMembers.length > 1) {
      const updatedMembers = formData.teamMembers.filter((_, i) => i !== index);
      setFormData({ ...formData, teamMembers: updatedMembers });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to generate report: ${response.statusText} - ${errorText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'project-report.docx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

    } catch (error) {
      console.error("Error generating report:", error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="project-form-container">
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-content">
            <ClipLoader size={60} color={"#4A90E2"} loading={true} />
            <p>Generating your document...</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="project-form">
        <h2>Project Details</h2>
        
        <div className="form-group">
          <label>Project Description:</label>
          <textarea
            value={formData.projectDescription}
            onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
            required
            rows={4}
          />
        </div>

        <div className="form-group">
          <label>Project Code:</label>
          <textarea
            value={formData.projectCode}
            onChange={(e) => setFormData({ ...formData, projectCode: e.target.value })}
            required
            rows={6}
          />
        </div>

        <div className="form-group">
          <label>Department:</label>
          <input
            type="text"
            value={formData.department}
            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Course:</label>
          <input
            type="text"
            value={formData.course}
            onChange={(e) => setFormData({ ...formData, course: e.target.value })}
            required
          />
        </div>

        <h3>Professor Details</h3>

        <div className="form-group">
          <label>Main Professor Name:</label>
          <input
            type="text"
            value={formData.mainProfessor}
            onChange={(e) => setFormData({ ...formData, mainProfessor: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Main Professor Designation:</label>
          <input
            type="text"
            value={formData.mainProfessor_designation}
            onChange={(e) => setFormData({ ...formData, mainProfessor_designation: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Professor Department:</label>
          <input
            type="text"
            value={formData.professorDepartment}
            onChange={(e) => setFormData({ ...formData, professorDepartment: e.target.value })}
            required
          />
        </div>

        <div className="form-group">
          <label>Secondary Professor Name (Optional):</label>
          <input
            type="text"
            value={formData.secondaryProfessor}
            onChange={(e) => setFormData({ ...formData, secondaryProfessor: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Secondary Professor Designation (Optional):</label>
          <input
            type="text"
            value={formData.secondaryProfessor_designation}
            onChange={(e) => setFormData({ ...formData, secondaryProfessor_designation: e.target.value })}
          />
        </div>

        <h3>Team Members</h3>

        {formData.teamMembers.map((member, index) => (
          <div key={index} className="team-member">
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                value={member.name}
                onChange={(e) => handleTeamMemberChange(index, 'name', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Roll Number:</label>
              <input
                type="text"
                value={member.rollNumber}
                onChange={(e) => handleTeamMemberChange(index, 'rollNumber', e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Gender:</label>
              <select
                value={member.gender}
                onChange={(e) => handleTeamMemberChange(index, 'gender', e.target.value)}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {formData.teamMembers.length > 1 && (
              <button type="button" onClick={() => removeTeamMember(index)} className="remove-btn">
                Remove
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={addTeamMember} className="add-btn">
          Add Team Member
        </button>

        <h3>Results (Optional)</h3>

        <div className="form-group">
          <label>Code Output:</label>
          <textarea
            value={formData.result.codeOutput}
            onChange={(e) => setFormData({ 
              ...formData, 
              result: { ...formData.result, codeOutput: e.target.value } 
            })}
            rows={4}
          />
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={formData.result.aiGeneratedContent === true}
              onChange={(e) => setFormData({ 
                ...formData, 
                result: { ...formData.result, aiGeneratedContent: e.target.checked } 
              })}
            />
            Generate AI Analysis
          </label>
        </div>

        <button type="submit" className="submit-btn" disabled={isLoading}>
          Generate Report
        </button>
      </form>
    </div>
  );
};

export default ProjectForm; 