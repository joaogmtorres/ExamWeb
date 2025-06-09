import React from "react"


const PaperList = ({ papers }) => {
  const getDifficultyBadge = (level) => {
    const badges = {
      1: "success",
      2: "info",
      3: "warning",
      4: "danger",
      5: "dark",
      6: "danger",
    }
    return badges[level] || "secondary"
  }

  const getDifficultyText = (level) => {
    const texts = {
      1: "Very Easy",
      2: "Easy",
      3: "Medium",
      4: "Hard",
      5: "Very Hard",
      6: "Extreme",
    }
    return texts[level] || "Unknown"
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="text-primary">
          <span className="fas fa-list me-2"></span>
          Chemistry Exams ({papers.length})
        </h3>
      </div>

      {papers.length === 0 ? (
        <div className="alert alert-info text-center">
          <span className="fas fa-info-circle me-2"></span>
          No exams created yet. Start by adding your first chemistry exam!
        </div>
      ) : (
        <div className="row">
          {papers.map((paper) => (
            <div key={paper.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                <div className="card-header bg-info">
                  <h5 className="card-title">{paper.title}</h5>
                </div>
                <div className="card-body">
                  <p className="text-muted">{paper.description || "No description provided"}</p>
                  <div className="mb-2">
                    <small className="text-muted">
                      <span className="fas fa-calendar me-1"></span>
                      Created: {paper.date_of_creation}
                    </small>
                  </div>
                  <div className="mb-3">
                    <span className="badge bg-primary">
                      <span className="fas fa-question-circle me-1"></span>
                      {paper.questions?.length || 0} Questions
                    </span>
                  </div>

                  {paper.questions && paper.questions.length > 0 && (
                    <div>
                      <h6 className="fw-bold">Questions:</h6>
                      <div className="list-group list-group-flush">
                        {paper.questions.slice(0, 3).map((question, index) => (
                          <div key={index} className="list-group-item">
                            <div className="d-flex justify-content-between align-items-start">
                              <small className="text-truncate me-2">
                                {question.question_text?.substring(0, 50)}...
                              </small>
                              <span className={`badge bg-${getDifficultyBadge(question.difficulty_level)}`}>
                                {getDifficultyText(question.difficulty_level)}
                              </span>
                            </div>
                          </div>
                        ))}
                        {paper.questions.length > 3 && (
                          <div className="list-group-item text-center">
                            <small className="text-muted">+{paper.questions.length - 3} more questions</small>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default PaperList
