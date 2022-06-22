const { user } = require('../api/entities/index')

 async function up () {
  try {
    let users = await user.model.find()

    await Promise.all(users.map(async user => {
      let numbers = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

      user.set('alias', user.name ? user.name.toLowerCase() : '')
      user.set('handle', numbers[Math.floor(Math.random() * (numbers.length))] + numbers[Math.floor(Math.random() * (numbers.length))] + numbers[Math.floor(Math.random() * (numbers.length))] + numbers[Math.floor(Math.random() * (numbers.length))])

      return await user.save()
    }))
  } catch (e) {
    console.error(e)
    return false
  }
}
/**
 * Make any changes that UNDO the up function side effects here (if possible)
 */
async function down () {
  // Write migration here
}

module.exports = { up, down };
