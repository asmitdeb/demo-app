const express = require('express');
const path = require('path')

const app = express()
const PORT = 8000

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile('public/signin.html', {root: './'})
})

app.get('/about', (req, res) => {
  res.send('About route 🎉 ')
})

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
})