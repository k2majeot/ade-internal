import { getGoalsService, updateGoalService } from "../services/goal.service";

export async function getGoals(req, res) {
  const { cid, title } = req.query;
  const goals = await getGoalsService(cid, title);
  return res.success(goals);
}

export async function updateGoal(req, res) {
  const goal = await updateGoalService(req.body);
  return res.success(goal);
}
