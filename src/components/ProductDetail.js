import React from 'react'
import { useParams } from 'react-router-dom'

const ProductDetail = () => {
  const params = useParams();
  console.log(params)
  return (
    <div className='component'>
      Product details
    </div>
  )
}

export default ProductDetail
