import React from "react"
import axios from "axios"
import { useState, useEffect } from "react"
import Navigation from "./components/Navigation"
import PaperForm from "./components/PaperForm"
import QuestionForm from "./components/QuestionForm"
import PaperList from "./components/PaperList"
import CategoryManager from "./components/CategoryManager"
import "./App.css"

function App() {
  const [activeTab, setActiveTab] = useState("papers")
  const [papers, setPapers] = useState([])
  const [categories, setCategories] = useState([])
  const [units, setUnits] = useState([])
  const [subtopics, setSubtopics] = useState([])
  const [questions, setQuestions] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [unitsRes, categoriesRes, subtopicsRes, papersRes] = await Promise.all([
          axios.get("/api/units/"),
          axios.get("/api/categories/"),
          axios.get("/api/subtopics/"),
          axios.get("/api/papers/"),
        ])
        setUnits(Array.isArray(unitsRes.data) ? unitsRes.data : [])
        setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : [])
        setSubtopics(Array.isArray(subtopicsRes.data) ? subtopicsRes.data : [])
        setPapers(Array.isArray(papersRes.data) ? papersRes.data : [])
      } catch (error) {
        console.error("Erro ao carregar dados da API:", error)
      }
    }

    fetchData()
  }, [])

  const addPaper = async (paper) => {
    try {
      const response = await axios.post("/api/papers/", paper)
      setPapers([...papers, response.data])
    } catch (error) {
      console.error("Error adding paper:", error)
    }
  }

  const addQuestion = async (question) => {
    try {
      console.log("Dados da questão:", question)
      const response = await axios.post("/api/questions/", question)
      const addedQuestion = response.data
      const updatedPapers = papers.map((paper) => {
        if (paper.id === addedQuestion.original_paper) {
          return {
            ...paper,
            questions: [...(paper.questions || []), addedQuestion],
          }
        }
        return paper
      })
      setPapers(updatedPapers)
    } catch (error) {
      console.error("Erro ao adicionar questão:", error)
    }
  }

  // // const addUnit = async (unit) => {
  // //   try {
  // //     const response = await axios.post("/api/units/", unit)
  // //     setUnits([...units, response.data])
  // //   } catch (error) {
  // //     console.error("Erro ao adicionar unidade:", error)
  // //   }
  // // }

  // // const addCategory = async (category) => {
  // //   try {
  // //     const response = await axios.post("/api/categories/", category)
  // //     setCategories([...categories, response.data])
  // //   } catch (error) {
  // //     console.error("Erro ao adicionar categoria:", error)
  // //   }
  // // }

  // const addSubtopic = async (subtopic) => {
  //   try {
  //     const response = await axios.post("/api/subtopics/", subtopic)
  //     setSubtopics([...subtopics, response.data])
  //   } catch (error) {
  //     console.error("Erro ao adicionar subtópico:", error)
  //   }
  // }

  return (
    <div className="app">
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="container">
        <div className="content">
          {activeTab === "papers" && <PaperForm categories={categories} onAddPaper={addPaper} />}
          {activeTab === "questions" && (
            <QuestionForm
              papers={papers}
              categories={categories}
              subtopics={subtopics}
              onAddQuestion={addQuestion}
            />
          )}
          {activeTab === "list" && <PaperList papers={papers} />}
          {activeTab === "manage" && (
            <CategoryManager
              units={units}
              categories={categories}
              subtopics={subtopics}
              setUnits={setUnits}
              setCategories={setCategories}
              setSubtopics={setSubtopics}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default App
