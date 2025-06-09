import React from "react"

const Navigation = ({ activeTab, setActiveTab }) => {
  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <a className="navbar-brand" href="#">
            <span className="fas fa-flask me-2"></span>
            ExamWeb
          </a>

          <div className="navbar-nav">
            <button
              className={`nav-button ${activeTab === "papers" ? "active" : ""}`}
              onClick={() => setActiveTab("papers")}
            >
              Add Exam
            </button>
            <button
              className={`nav-button ${activeTab === "questions" ? "active" : ""}`}
              onClick={() => setActiveTab("questions")}
            >
              Add Questions
            </button>
            <button
              className={`nav-button ${activeTab === "list" ? "active" : ""}`}
              onClick={() => setActiveTab("list")}
            >
              View Exams
            </button>
            <button
              className={`nav-button ${activeTab === "manage" ? "active" : ""}`}
              onClick={() => setActiveTab("manage")}
            >
              Manage Categories
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
