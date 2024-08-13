// Map + Filter + reduce

const salesRecord = [
  {type: 'Dog food', amount: 2, price: 19.99}, 
  {type: 'Cat food', amount: 2, price: 29.99}, 
  {type: 'Dog food', amount: 1, price: 19.99}, 
  {type: 'Fish food', amount: 2, price: 9.99},
]

const dogFoodRevenue = salesRecord
  .filter(({type}) => type === 'Dog food')
  .map(({amount, price}) => amount * price)
  .reduce((sum, total) => sum + total, 0)
