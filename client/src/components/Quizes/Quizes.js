import React, { useEffect, useState } from "react"
import Quiz from "./Quiz/Quiz"
import { useDispatch, useSelector } from "react-redux"
import { useHistory, useLocation } from "react-router-dom"
import { getPublicQuizes } from "../../actions/quiz"
import styles from "./quizes.module.css"
import ChipInput from "material-ui-chip-input"
import {
  AppBar,
  TextField,
  Button,
  Paper,
} from "@material-ui/core"
import useStyles from "./styles"
import { getQuizesBySearch } from "../../actions/quiz"

function Quizes() {
  const classes = useStyles()
  const dispatch = useDispatch()
  const history = useHistory()
  useEffect(() => {
    dispatch(getPublicQuizes())
  }, [dispatch])
  const { quizes } = useSelector((state) => state.quiz)
  const isLanguageEnglish = useSelector((state) => state.language.isEnglish)

  const [search, setSearch] = useState("")
  const [tags, setTags] = useState([])

  const searchPost = () => {
    if(search==="" && tags.length===0){
      dispatch(getPublicQuizes())
    }

    if (search.trim() || tags) {
      dispatch(getQuizesBySearch({ search, tags: tags.join(",") }))
      history.push(
        `/quizes/search?searchQuery=${search || "none"}&tags=${tags.join(",")}`
      )}
  }

  const handleKeyPress = (e) => {
    if (e.keyCode === 13) {
      searchPost()
    }
  }

  const handleAddChip = (tag) => setTags([...tags, tag])

  const handleDeleteChip = (chipToDelete) =>
    setTags(tags.filter((tag) => tag !== chipToDelete))

  return (
    <div className={styles["quizes-list"]}>
      <AppBar
        className={classes.appBarSearch}
        position="static"
        color="inherit"
      >
        <TextField
          onKeyDown={handleKeyPress}
          name="search"
          variant="outlined"
          label={
            isLanguageEnglish
              ? "Search quizes by name"
              : "Szukaj quizów po nazwie"
          }
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ChipInput
          style={{ margin: "10px 0" }}
          value={tags}
          onAdd={(chip) => handleAddChip(chip)}
          onDelete={(chip) => handleDeleteChip(chip)}
          label={
            isLanguageEnglish
              ? "Search quizes by tags"
              : "Szukaj quizów po kategoriach"
          }
          variant="outlined"
        />
        <Button
          onClick={searchPost}
          className={classes.searchButton}
          variant="contained"
          color="primary"
        >
          {isLanguageEnglish
            ? "Search"
            : "Szukaj"}
        </Button>
      </AppBar>
      {quizes.map((quiz) => (
        <Quiz key={quiz._id} quiz={quiz} />
      ))}
    </div>
  )
}

export default Quizes
