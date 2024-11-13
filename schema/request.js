import mongoose from "mongoose";

const Schema = new mongoose.Schema();

const requestSchema = Schema({
  requestId: {
    type: "string",
    required: [true, "Request Id is missing"],
  },
});

const RequestModel =
  mongoose.models.requests || mongoose.model("requests", requestSchema);
export default RequestModel;
