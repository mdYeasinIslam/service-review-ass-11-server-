const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())

app.get('/',(req,res)=>{
    res.send('server is created')
})


const port = process.env.PORT || 3000
app.listen(port,()=>console.log('server is runnig'))