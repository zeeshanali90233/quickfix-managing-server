export async function getRequestCallback(req, res) {
  console.log(req.params);
  res.status(200).json({ hi: "dd" });
}
