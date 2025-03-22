export async function getRequestCallback(req, res) {
  res
    .status(200)
    .json({
      requestId: req.query.id,
      status: "Completed",
      technician: { name: "John Doe", id: "1234" },
      business: { name: "QuickFix", id: "1234" },
      problem: "Fix the spindle of the washing machine",
      actionSideStatus: "Completed",
      updatedAt: new Date().toISOString(),
    });
}
