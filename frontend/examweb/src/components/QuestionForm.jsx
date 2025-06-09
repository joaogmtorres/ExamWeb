import React from "react"


import { useState } from "react"

const QuestionForm = ({ papers, categories, subtopics, onAddQuestion }) => {
  const [formData, setFormData] = useState({
    original_paper: "",
    category: "",
    subtopics: [],
    question_text: "",
    answer: "",
    question_type: "",
    difficulty_level: "",
  })

  const questionTypes = [
    { value: "MCQ", label: "Multiple Choice Question" },
    { value: "SAQ", label: "Short Answer Question" },
    { value: "LAQ", label: "Long Answer Question" },
    { value: "OTR", label: "Others" },
  ]

  const difficultyLevels = [
    { value: "1", label: "Very Easy" },
    { value: "2", label: "Easy" },
    { value: "3", label: "Medium" },
    { value: "4", label: "Hard" },
    { value: "5", label: "Very Hard" },
    { value: "6", label: "Extreme" },
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.original_paper || !formData.question_text || !formData.answer) {
      alert("Please fill in all required fields")
      return
    }

    onAddQuestion(formData)
    setFormData({
      original_paper: "",
      category: "",
      subtopics: [],
      question_text: "",
      answer: "",
      question_type: "",
      difficulty_level: "",
    })

    alert("Question added successfully!")
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubtopicChange = (subtopicId) => {
    const updatedSubtopics = formData.subtopics.includes(subtopicId)
      ? formData.subtopics.filter((id) => id !== subtopicId)
      : [...formData.subtopics, subtopicId]

    setFormData({
      ...formData,
      subtopics: updatedSubtopics,
    })
  }

  const getRelevantSubtopics = () => {
    if (!formData.category) return []
    return subtopics.filter((subtopic) => subtopic.categories.includes(Number.parseInt(formData.category)))
  }

  return (
    <div className="card">
      <div className="card-header bg-success">
        <h3 className="card-title">
          <span className="fas fa-question-circle me-2"></span>
          Add New Question
        </h3>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="original_paper" className="form-label">
                Select Exam <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                id="original_paper"
                name="original_paper"
                value={formData.original_paper}
                onChange={handleChange}
                required
              >
                <option value="">Choose an exam</option>
                {papers.map((paper) => (
                  <option key={paper.id} value={paper.id}>
                    {paper.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="category" className="form-label">
                Category <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {formData.category && (
            <div className="mb-3">
              <label className="form-label">Subtopics</label>
              <div className="row">
                {getRelevantSubtopics().map((subtopic) => (
                  <div key={subtopic.id} className="col-md-4 mb-2">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`subtopic-${subtopic.id}`}
                        checked={formData.subtopics.includes(subtopic.id)}
                        onChange={() => handleSubtopicChange(subtopic.id)}
                      />
                      <label className="form-check-label" htmlFor={`subtopic-${subtopic.id}`}>
                        {subtopic.name}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-3">
            <label htmlFor="question_text" className="form-label">
              Question Text <span className="text-danger">*</span>
            </label>
            <textarea
              className="form-control"
              id="question_text"
              name="question_text"
              rows="4"
              value={formData.question_text}
              onChange={handleChange}
              placeholder="Enter the chemistry question here..."
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="answer" className="form-label">
              Answer <span className="text-danger">*</span>
            </label>
            <textarea
              className="form-control"
              id="answer"
              name="answer"
              rows="3"
              value={formData.answer}
              onChange={handleChange}
              placeholder="Provide the correct answer and explanation"
              required
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="question_type" className="form-label">
                Question Type <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                id="question_type"
                name="question_type"
                value={formData.question_type}
                onChange={handleChange}
                required
              >
                <option value="">Select type</option>
                {questionTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="difficulty_level" className="form-label">
                Difficulty Level <span className="text-danger">*</span>
              </label>
              <select
                className="form-select"
                id="difficulty_level"
                name="difficulty_level"
                value={formData.difficulty_level}
                onChange={handleChange}
                required
              >
                <option value="">Select difficulty</option>
                {difficultyLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-success btn-lg">
              <span className="fas fa-plus me-2"></span>
              Add Question
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default QuestionForm
