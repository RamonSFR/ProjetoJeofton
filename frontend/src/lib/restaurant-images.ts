import image1 from '../assets/restaurants-cards/caption.jpg'
import image2 from '../assets/restaurants-cards/o-melhor-da-gastronomia.jpg'
import image3 from '../assets/restaurants-cards/restaurante-rick-s.jpg'

const restaurantImages = [image1, image2, image3]

export const getRestaurantImage = (seed: number) =>
  restaurantImages[Math.abs(seed) % restaurantImages.length]
