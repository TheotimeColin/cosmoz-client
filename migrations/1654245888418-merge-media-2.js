const { mediaCollection, media } = require('../api/entities/index')

 async function up () {
  try {
    let collections = await mediaCollection.model.find()

    await Promise.all(collections.map(async coll => {
      coll.medias = await Promise.all(coll.medias.map(async id => {
        let m = await media.model.findById(id)
        if (m) delete m._id

        console.log(m)
        
        return m ? m : null
      }).filter(m => m))

      await coll.save()
      return coll
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
