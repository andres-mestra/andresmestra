const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  log: ['query', 'info'],
})

const dbConection = async () => {
  try {
    await prisma.$connect()
  } catch (error) {
    console.log('Error conection db', error)
    await prisma.$disconection()
    process.exit(1)
  }
}

module.exports = {
  dbConection,
  prisma,
}
