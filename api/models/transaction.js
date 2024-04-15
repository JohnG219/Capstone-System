import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  paymentmethodtransaction: {
    type: String,
  },
  billtypetransaction: {
    type: String,
  },

  amountoftransaction: {
    type: String,
  },
  dateoftransaction: {
    type: String,
  },
  statusoftransaction: {
    type: String,
  },

});

export const Transaction = mongoose.model("Transaction", transactionSchema);