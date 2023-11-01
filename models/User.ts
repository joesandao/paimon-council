// models/User.ts
import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  _id: string;
  approvedUsers: string[];
  disapprovedUsers: string[];
  status: string;
}

const userSchema = new Schema<IUser>({
  _id: { type: String, required: true },
  approvedUsers: { type: [String], default: [] },
  disapprovedUsers: { type: [String], default: [] },
  status: { type: String, default: '難民' },
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;

