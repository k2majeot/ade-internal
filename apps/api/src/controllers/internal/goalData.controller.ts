import {
  getGoalDataService,
  upsertGoalDataService,
} from "../services/goalData.service";

export async function getGoalData(req, res) {
  const { gid, date } = req.query;
  const getGoalData = await getGoalDataService(gid, date);
  return res.success(data);
}

export async function upsertGoalData(req, res) {
  const data = req.body;
  const result = await upsertGoalDataService(data);
  return res.success(result);
}
