import React from "react"

import { useState } from "react"

const PaperForm = ({ categories, onAddPaper }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date_of_creation: "",
    main_subject: "",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title || !formData.main_subject) {
      alert("Please fill in all required fields")
      return
    }

    onAddPaper(formData)
    setFormData({
      title: "",
      description: "",
      date_of_creation: "",
      main_subject: "",
    })

    alert("Exam added successfully!")
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="card">
      <div className="card-header bg-primary">
        <h3 className="card-title">
          <span className="fas fa-plus-circle me-2"></span>
          Add New Exam
        </h3>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Exam Title <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Organic Chemistry Midterm 2024"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              className="form-control"
              id="description"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the exam content and objectives"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="date_of_creation" className="form-label">
              Creation Date <span className="text-danger">*</span>
            </label>
            <input
              type="date"
              className="form-control"
              id="date_of_creation"
              name="date_of_creation"
              value={formData.date_of_creation}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="main_subject" className="form-label">
              Main Subject <span className="text-danger">*</span>
            </label>
            <select
              className="form-select"
              id="main_subject"
              name="main_subject"
              value={formData.main_subject}
              onChange={handleChange}
              required
            >
              <option value="">Select a chemistry category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="d-grid">
            <button type="submit" className="btn btn-primary btn-lg">
              <span className="fas fa-save me-2"></span>
              Create Exam
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PaperForm
