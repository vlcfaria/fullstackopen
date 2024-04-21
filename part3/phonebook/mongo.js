const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('insert password into second argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://vfariadev:${password}@cluster0.gysxwmo.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.connect(url)

const entrySchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Entry = mongoose.model('Entry', entrySchema)

if (process.argv.length == 3) {
    Entry.find({}).then(res => {
        res.forEach(entry => console.log(`${entry.name} ${entry.number}`))
        mongoose.connection.close()
    })
}
else if (process.argv.length >= 5) {
    const entry = new Entry({
        name: process.argv[3],
        number: process.argv[4],
    })

    entry.save().then(res => {
        console.log(`added ${entry.name} number ${entry.number} to phonebook`)
        mongoose.connection.close()
    })
}