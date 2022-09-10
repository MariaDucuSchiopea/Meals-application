import React, { useContext, useEffect, useState } from 'react'

const AppContext = React.createContext()

import axios from 'axios'

const allMealsUrl = 'https://www.themealdb.com/api/json/v1/1/search.php?s='
const randomMealUrl = 'https://www.themealdb.com/api/json/v1/1/random.php'

const getFavoritesFromLocalStorage = () => {
    let fav = localStorage.getItem('favoritesStorage');
    if (fav) {
      fav = JSON.parse(localStorage.getItem('favoritesStorage'))
    } else {
      fav = []
    }
    return fav
  }

const AppProvider = ({ children }) => {
  const [loading, setLoading] = useState(false)
  const [meals, setMeals] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedMeal, setSelectedMeal] = useState(null)
  const [favorites, setFavorites] = useState(getFavoritesFromLocalStorage());

  const fetchMeals = async (url) => {
    setLoading(true)
    try {
      const { data } = await axios.get(url)
      if (data.meals) {
        setMeals(data.meals)
      } else {
        setMeals([])
      }
    } catch (error) {
      console.log('Eroare', error.response)
    }
    setLoading(false)
  }
  const fetchRandomMeal = () => {
    fetchMeals(randomMealUrl)
  }

  useEffect(() => {
    fetchMeals(`${allMealsUrl}c`)
  }, [])


  useEffect(() => {
    if (!searchTerm) return
    fetchMeals(`${allMealsUrl}${searchTerm}`)
  }, [searchTerm])

  const selectMeal = (idMeal, favoriteMeal) => {
    let meal;
    if (favoriteMeal) {
      meal = favorites.find((meal) => meal.idMeal === idMeal);
    } else {
      meal = meals.find((meal) => meal.idMeal === idMeal);
    }



    setSelectedMeal(meal);
    setShowModal(true)
    console.log("modal", showModal)
  }

  const closeModal = () => {
    setShowModal(false)
  }

  const addToFavorites = (idMeal) => {
    const alreadyFavorite = favorites.find((meal) => meal.idMeal === idMeal);
    if (alreadyFavorite) return
    const meal = meals.find((meal) => meal.idMeal === idMeal);
    const updatedFavorites = [...favorites, meal]
    setFavorites(updatedFavorites)
    localStorage.setItem('favoritesStorage', JSON.stringify(updatedFavorites))
  }

  const removeFromFavorites = (idMeal) => {
    console.log(idMeal)
    const updatedFavorites = favorites.filter((meal) => meal.idMeal !== idMeal);
    setFavorites(updatedFavorites)
    console.log(updatedFavorites)
    localStorage.setItem('favoritesStorage', JSON.stringify(updatedFavorites))
  }

  return <AppContext.Provider value={{ loading, meals, setSearchTerm, fetchRandomMeal, showModal, selectedMeal, selectMeal, closeModal, favorites, addToFavorites, removeFromFavorites }}>
    {children}
  </AppContext.Provider>
}


export const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppProvider }