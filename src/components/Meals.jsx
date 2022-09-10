import { useGlobalContext } from '../context'
import { BsHandThumbsUp } from 'react-icons/bs'


const Meals = () => {
  const { meals, loading, selectMeal } = useGlobalContext()

  if (loading) {
    return <section className="section">
      <h4>Loading...</h4>
    </section>
  }


  if (meals.length < 1) {
    return <section className='section'>
      <h5>No meals with that description...</h5>
    </section>
  }


  return <section className="section-center">
    {meals.map((singleMeal) => {
      const { idMeal, strMeal: title, strMealThumb: image } = singleMeal
      return <article key={idMeal} className="single-meal">
        <img src={image} className="img" onClick={()=>selectMeal(idMeal)}/>
        <footer>
          <h5>{title}</h5>
          <button className="like-btn"><BsHandThumbsUp /></button>
        </footer>
      </article>
    })}
  </section>
}

export default Meals;