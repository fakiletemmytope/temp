import express from "express"

const app = express()
const port = 5800

app.get('/', (req, res) => {

  let data = [1, 3, 7, 42, 99]
  res.send(data)
})

app.get('/array', (req, res) => {
  let data = [
    { "name": "Alice", "age": 30, "occupation": "Engineer" },
    { "name": "Bob", "age": 25, "occupation": "Designer" }
  ]
  res.send(data)
})

app.get('/object', (req, res) => {
  let data = ["JavaScript", "Python", "Java", "C++", "Ruby"]
  res.send(data)
})
  
app.listen(port, () => {
    console.log(`Assign-7 app listening on port ${port}`)
})