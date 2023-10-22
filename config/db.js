import { connect } from 'mongoose'

export const connectionDB = async (req, res) => {
  try {
    await connect(process.env.MONGO_URI)
    console.log("Database connection successfully ....")
  } catch (error) {
    console.log(error)
  }
}
