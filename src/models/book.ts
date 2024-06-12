import { Schema, Types, model } from "mongoose";

interface IBook {
  title: string;
  description: string;
  authorId: Types.ObjectId;
  price: number;
  category: string;
}

const bookSchema = new Schema<IBook>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  authorId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  price: { type: Number, required: true },
  category: { type: String, required: true }
});

export const Book = model<IBook>('Book', bookSchema);