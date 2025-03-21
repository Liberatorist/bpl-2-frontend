import { useContext, useEffect } from "react";
import { GlobalStateContext } from "../utils/context-provider";
import TeamScore from "../components/team-score";
import { ItemTable } from "../components/item-table";
import { GameVersion } from "../client";
import { router } from "../router";
import { Ranking } from "../components/ranking";

export const HeistTab: React.FC = () => {
  const { scores, gameVersion } = useContext(GlobalStateContext);
  const heistCategory = scores?.sub_categories.find(
    (category) => category.name === "Heist"
  );
  useEffect(() => {
    if (gameVersion !== GameVersion.poe1) {
      router.navigate("/scores?tab=Ladder");
    }
  }, [gameVersion]);
  if (!heistCategory) {
    return <></>;
  }

  const rogueGearCategory = heistCategory.sub_categories.find(
    (category) => category.name === "Rogue Gear"
  );
  const experimentalBasesCategory = heistCategory.sub_categories.find(
    (category) => category.name === "Experimental Bases"
  );
  const heistUniquesCategory = heistCategory.sub_categories.find(
    (category) => category.name === "Blueprint Uniques"
  );

  return (
    <>
      <TeamScore category={heistCategory} />
      {rogueGearCategory && (
        <div className="flex flex-col gap-4">
          <div className="divider divider-primary">Rogue Gear</div>
          <Ranking
            objective={rogueGearCategory}
            maximum={rogueGearCategory.objectives.length}
            actual={(teamId: number) =>
              rogueGearCategory.objectives.filter(
                (o) => o.team_score[teamId]?.finished
              ).length
            }
            description="Gear:"
          />
          <ItemTable category={rogueGearCategory} />
        </div>
      )}
      {experimentalBasesCategory && (
        <>
          <div className="divider divider-primary">Experimental Bases</div>
          <ItemTable category={experimentalBasesCategory} />
        </>
      )}
      {heistUniquesCategory && (
        <>
          <div className="divider divider-primary">Heist Uniques</div>
          <ItemTable category={heistUniquesCategory} />
        </>
      )}
    </>
  );
};
