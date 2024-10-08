import React, { useState } from 'react';
import Header from './Header';
import SemiCircleProgressBar from "react-progressbar-semicircle";
import './Results.css';
import { utils, writeFile } from 'xlsx';

const jobDescription = "Software Engineer";

const dummyData = [
    { id: 1, name: "John Doe", role: "Software Developer", skills: { jobSkills: 33, softSkills: 99, education: 91 }, resume: "resume1.pdf", date: "2024-09-25", forensic: false },
    { id: 2, name: "Jane Smith", role: "Software Developer", skills: { jobSkills: 50, softSkills: 80, education: 97 }, resume: "resume2.pdf", date: "2024-09-24", forensic: true },
    { id: 3, name: "Emily Johnson", role: "Data Scientist", skills: { jobSkills: 75, softSkills: 85, education: 92 }, resume: "resume3.pdf", date: "2024-09-23", forensic: true },
    { id: 4, name: "Michael Brown", role: "Project Manager", skills: { jobSkills: 60, softSkills: 90, education: 89 }, resume: "resume4.pdf", date: "2024-09-22", forensic: true },
    { id: 5, name: "Sarah Davis", role: "UX/UI Designer", skills: { jobSkills: 80, softSkills: 70, education: 94 }, resume: "resume5.pdf", date: "2024-09-21", forensic: false },
    { id: 6, name: "David Wilson", role: "DevOps Engineer", skills: { jobSkills: 78, softSkills: 88, education: 90 }, resume: "resume6.pdf", date: "2024-09-20", forensic: true },
    { id: 7, name: "Laura Martinez", role: "Business Analyst", skills: { jobSkills: 65, softSkills: 75, education: 91 }, resume: "resume7.pdf", date: "2024-09-19", forensic: false },
    { id: 8, name: "James Taylor", role: "System Administrator", skills: { jobSkills: 70, softSkills: 78, education: 93 }, resume: "resume8.pdf", date: "2024-09-18", forensic: true },
    { id: 9, name: "Olivia Lee", role: "Marketing Specialist", skills: { jobSkills: 68, softSkills: 82, education: 95 }, resume: "resume9.pdf", date: "2024-09-17", forensic: true },
    { id: 10, name: "William Clark", role: "Network Engineer", skills: { jobSkills: 72, softSkills: 80, education: 88 }, resume: "resume10.pdf", date: "2024-09-16", forensic: true }
];

const ResultsPage = ({ setIsLoggedIn, setUsername, setAccessKey, remainingCredits }) => {
    const [viewType, setViewType] = useState('cards');
    const [sortOption, setSortOption] = useState('');
    const [forensicFilter, setForensicFilter] = useState('all');

    const handleViewChange = (view) => {
        setViewType(view);
    };

    const calculateOverallFit = (skills) => {
        return ((skills.jobSkills + skills.softSkills + skills.education) / 3).toFixed(0);
    };

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    const sortedData = [...dummyData].sort((a, b) => {
        if (sortOption === 'skills-high') return calculateOverallFit(b.skills) - calculateOverallFit(a.skills);
        if (sortOption === 'skills-low') return calculateOverallFit(a.skills) - calculateOverallFit(b.skills);
        return 0;
    });

    const filteredData = sortedData.filter((item) => {
        if (forensicFilter === 'good') return item.forensic === true;
        return true; // Show all resumes by default
    });

    const handleForensicFilter = (filter) => {
        setForensicFilter(filter);
    };

    // Function to download table data as an Excel file
    const downloadExcel = () => {
        const dataToExport = filteredData.map(item => ({
            Name: item.name,
            Role: jobDescription,
            JobSkills: `${item.skills.jobSkills}%`,
            SoftSkills: `${item.skills.softSkills}%`,
            Education: `${item.skills.education}%`,
            OverallFit: `${calculateOverallFit(item.skills)}%`
        }));
        
        const worksheet = utils.json_to_sheet(dataToExport);
        const workbook = utils.book_new();
        utils.book_append_sheet(workbook, worksheet, "Job Match Results");
        writeFile(workbook, "job_match_results.xlsx");
    };

    return (
        <>
            <Header setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} setAccessKey={setAccessKey} remainingCredits={remainingCredits} />
            <div className="results-page-container">
                <main className="results-page-content">
                    <div className="results-page-view-toggle">
                        <h3>Job Description Selected: <span style={{ color: "#672024", fontWeight: "600" }}>{jobDescription}</span></h3>
                        <button onClick={() => handleViewChange('cards')} className="results-page-toggle-button">Show as Cards</button>
                        <button onClick={() => handleViewChange('table')} className="results-page-toggle-button">Show as Table</button>

                        <select onChange={handleSortChange} className="sort-dropdown">
                            <option value="">Sort by</option>
                            <option value="skills-high">Overall Fit: High to Low</option>
                            <option value="skills-low">Overall Fit: Low to High</option>
                        </select>

                        <h3>Resume Forensics Filter: </h3>
                        <button onClick={() => handleForensicFilter('all')} className="results-page-toggle-button">All Resumes</button>
                        <button onClick={() => handleForensicFilter('good')} className="results-page-toggle-button" disabled={filteredData.filter(item => item.forensic).length === 0}>Good Resumes</button>
                    </div>

                    {viewType === 'cards' && (
                        <div className="results-page-cards-container">
                            {filteredData.map((item) => (
                                <div key={item.id} className="role-match-card">
                                    <h3>{item.name}</h3>
                                    <p style={{ fontWeight: "700", marginBottom: "10px" }}>{jobDescription}</p>
                                    <p style={{ fontSize: "0.9rem" }}>This is a detailed analysis of how much fit this candidate is for the role.</p>

                                    <div className="progress-bar-container">
                                        <SemiCircleProgressBar
                                            percentage={calculateOverallFit(item.skills)}
                                            showPercentValue
                                            stroke="#672024"
                                            background="#e0e0e0"
                                            strokeWidth={20}
                                            diameter={200}
                                        />
                                    </div>

                                    <p className="value-basis">% Value calculated based on</p>

                                    <ul className="criteria-list">
                                        <li className="criteria-item job-skills">
                                            <span>Job Skills</span>
                                            <span><span className="dot job-skills"></span> {item.skills.jobSkills}%</span>
                                        </li>
                                        <li className="criteria-item soft-skills">
                                            <span>Soft Skills</span>
                                            <span><span className="dot soft-skills"></span> {item.skills.softSkills}%</span>
                                        </li>
                                        <li className="criteria-item education">
                                            <span>Education</span>
                                            <span><span className="dot education"></span> {item.skills.education}%</span>
                                        </li>
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Button to download table data */}
                    {viewType === 'table' && (
                            <button onClick={downloadExcel} className="results-table-download-button">Download Table as Excel</button>
                        )}

                    {viewType === 'table' && (
                        
                        <table className="results-page-table">
                            <thead>
                                <tr>
                                    <th className="results-page-table-header">Name</th>
                                    <th className="results-page-table-header">Role</th>
                                    <th className="results-page-table-header">Job Skills</th>
                                    <th className="results-page-table-header">Soft Skills</th>
                                    <th className="results-page-table-header">Education</th>
                                    <th className="results-page-table-header">Overall Fit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.map((item) => (
                                    <tr key={item.id}>
                                        <td className="results-page-table-cell">{item.name}</td>
                                        <td className="results-page-table-cell">{jobDescription}</td>
                                        <td className="results-page-table-cell">{item.skills.jobSkills}%</td>
                                        <td className="results-page-table-cell">{item.skills.softSkills}%</td>
                                        <td className="results-page-table-cell">{item.skills.education}%</td>
                                        <td className="results-page-table-cell">{calculateOverallFit(item.skills)}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </main>
            </div>
            <footer className="footer">
                <p>MayaMaya Lite - A MayaMaya Product</p>
            </footer>
        </>
    );
};

export default ResultsPage;
