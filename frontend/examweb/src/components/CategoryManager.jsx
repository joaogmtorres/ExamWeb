import React, { useState } from "react"
import axios from "axios"

const CategoryManager = ({ units, categories, subtopics, setUnits, setCategories, setSubtopics }) => {
  const [newUnit, setNewUnit] = useState("")
  const [newCategory, setNewCategory] = useState({ name: "", unit: "" })
  const [newSubtopic, setNewSubtopic] = useState({ name: "", categories: [] })

  const addUnit = async (e) => {
    e.preventDefault()
    if (!newUnit.trim()) return

    try {
      const response = await axios.post("/api/units/", { name: newUnit })
      setUnits([...units, response.data])
      setNewUnit("")
    } catch (error) {
      console.error("Failed to add unit:", error)
    }
  }

  const addCategory = async (e) => {
    e.preventDefault()
    if (!newCategory.name.trim() || !newCategory.unit) return

    try {
      const response = await axios.post("/api/categories/", {
        name: newCategory.name,
        unit: parseInt(newCategory.unit),
      })
      setCategories([...categories, response.data])
      setNewCategory({ name: "", unit: "" })
    } catch (error) {
      console.error("Failed to add category:", error)
    }
  }

  const addSubtopic = async (e) => {
    e.preventDefault()
    if (!newSubtopic.name.trim()) return

    try {
      const response = await axios.post("/api/subtopics/", {
        name: newSubtopic.name,
        categories: newSubtopic.categories,
      })
      setSubtopics([...subtopics, response.data])
      setNewSubtopic({ name: "", categories: [] })
    } catch (error) {
      console.error("Failed to add subtopic:", error)
    }
  }

  const handleCategorySelection = (categoryId) => {
    const updated = newSubtopic.categories.includes(categoryId)
      ? newSubtopic.categories.filter((id) => id !== categoryId)
      : [...newSubtopic.categories, categoryId]

    setNewSubtopic({ ...newSubtopic, categories: updated })
  }

  return (
    <div>
      <h3 className="mb-4 text-warning">
        <span className="fas fa-cogs me-2"></span>
        Manage Categories
      </h3>

      <div className="row">
        {/* Unit Form */}
        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-header bg-secondary">
              <h5 className="card-title">Add Chemistry Unit</h5>
            </div>
            <div className="card-body">
              <form onSubmit={addUnit}>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="e.g., Unit 1"
                  value={newUnit}
                  onChange={(e) => setNewUnit(e.target.value)}
                />
                <button type="submit" className="btn btn-secondary">
                  <span className="fas fa-plus me-1"></span>Add Unit
                </button>
              </form>

              <div className="mt-3">
                <h6 className="fw-bold">Current Units:</h6>
                <div className="d-flex flex-wrap gap-1">
                  {units.map((unit) => (
                    <span key={unit.id} className="badge bg-secondary">{unit.name}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Form */}
        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-header bg-info">
              <h5 className="card-title">Add Category</h5>
            </div>
            <div className="card-body">
              <form onSubmit={addCategory}>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="e.g., Inorganic Chemistry"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                />
                <select
                  className="form-select mb-3"
                  value={newCategory.unit}
                  onChange={(e) => setNewCategory({ ...newCategory, unit: e.target.value })}
                >
                  <option value="">Select Unit</option>
                  {units.map((unit) => (
                    <option key={unit.id} value={unit.id}>{unit.name}</option>
                  ))}
                </select>
                <button type="submit" className="btn btn-info">
                  <span className="fas fa-plus me-1"></span>Add Category
                </button>
              </form>

              <div className="mt-3">
                <h6 className="fw-bold">Current Categories:</h6>
                <div className="d-flex flex-wrap gap-1">
                  {categories.map((category) => (
                    <span key={category.id} className="badge bg-info">{category.name}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subtopic Form */}
        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-header bg-warning">
              <h5 className="card-title">Add Subtopic</h5>
            </div>
            <div className="card-body">
              <form onSubmit={addSubtopic}>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="e.g., Enthalpy"
                  value={newSubtopic.name}
                  onChange={(e) => setNewSubtopic({ ...newSubtopic, name: e.target.value })}
                />

                <label className="form-label fw-bold">Select Categories:</label>
                <div className="mb-3">
                  {categories.map((cat) => (
                    <div key={cat.id} className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`cat-${cat.id}`}
                        checked={newSubtopic.categories.includes(cat.id)}
                        onChange={() => handleCategorySelection(cat.id)}
                      />
                      <label className="form-check-label" htmlFor={`cat-${cat.id}`}>
                        {cat.name}
                      </label>
                    </div>
                  ))}
                </div>

                <button type="submit" className="btn btn-warning">
                  <span className="fas fa-plus me-1"></span>Add Subtopic
                </button>
              </form>

              <div className="mt-3">
                <h6 className="fw-bold">Current Subtopics:</h6>
                <div className="d-flex flex-wrap gap-1">
                  {subtopics.map((s) => (
                    <span key={s.id} className="badge bg-warning text-dark">{s.name}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default CategoryManager
