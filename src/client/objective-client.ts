import { ScoringObjective } from "../types/scoring-objective";
import { fetchWrapper } from "./base";

export async function getObjectiveById(
  objectiveId: number
): Promise<ScoringObjective> {
  return await fetchWrapper<ScoringObjective>(
    "/scoring/objectives/" + objectiveId,
    "GET"
  );
}

export async function createObjective(
  categoryId: number,
  data: Partial<ScoringObjective>
) {
  if (
    data.name === undefined ||
    data.objective_type === undefined ||
    data.aggregation === undefined ||
    data.number_field === undefined
  ) {
    return;
  }
  if (!data.scoring_preset_id) {
    delete data.scoring_preset_id;
  }
  data.category_id = categoryId;
  return await fetchWrapper<Partial<ScoringObjective>>(
    "/scoring/objectives",
    "PUT",
    data
  );
}

export async function deleteObjective(data: Partial<ScoringObjective>) {
  if (data.id === undefined) {
    throw Error;
  }
  return await fetchWrapper<null>("/scoring/objectives/" + data.id, "DELETE");
}
