import { useContext, useMemo } from "react";
import { GlobalStateContext } from "../utils/context-provider";
import TeamScore from "../components/team-score";
import { ObjectiveIcon } from "../components/objective-icon";
import { CollectionCardTable } from "../components/collection-card-table";
import { Ranking } from "../components/ranking";
import { ColumnDef, sortingFns } from "@tanstack/react-table";
import { LadderEntry, Team } from "../client";
import { Ascendancy } from "../components/ascendancy";
import { ExperienceBar } from "../components/experience-bar";
import { Table } from "../components/table";
import { TeamName } from "../components/team-name";
import { LadderPortrait } from "../components/ladder-portrait";
import { AscendancyPortrait } from "../components/ascendancy-portrait";

export function DelveTab() {
  const { scores, currentEvent, users, ladder, isMobile } =
    useContext(GlobalStateContext);
  const category = scores?.sub_categories.find((c) => c.name === "Delve");
  if (!category || !currentEvent) {
    return <></>;
  }
  const fossilRaceCategory = category.sub_categories.find(
    (c) => c.name === "Fossil Race"
  );
  const culmulativeDepthObjective = category.objectives.find(
    (o) => o.name === "Culmulative Depth"
  );
  const teamMap =
    currentEvent?.teams?.reduce((acc: { [teamId: number]: Team }, team) => {
      acc[team.id] = team;
      return acc;
    }, {}) || {};
  const userToTeam =
    users?.reduce((acc, user) => {
      acc[user.id] = teamMap[user.team_id];
      return acc;
    }, {} as { [userId: number]: Team }) || {};

  const delveLadderColumns = useMemo(() => {
    let columns: ColumnDef<LadderEntry, any>[] = [];
    if (!isMobile) {
      columns = [
        {
          accessorKey: "delve",
          header: "Delve Depth",
          sortingFn: sortingFns.basic,
          size: 60,
        },
        {
          accessorKey: "character_name",
          header: "Character",
          sortingFn: sortingFns.text,
          size: 250,
        },
        {
          accessorKey: "account_name",
          header: "Account",
          sortingFn: sortingFns.text,
          size: 180,
        },
        {
          accessorFn: (row) => userToTeam[row.user_id] || "Cartographers",
          header: "Team",
          cell: (info) => (
            <TeamName team={userToTeam[info.row.original.user_id]} />
          ),
          sortingFn: sortingFns.text,
          size: 120,
        },
        {
          accessorKey: "character_class",
          header: "Ascendancy",
          cell: (info) => (
            <div className="flex items-center gap-2">
              <AscendancyPortrait
                character_class={info.row.original.character_class}
                className="w-8 h-8 rounded-full"
              />
              <Ascendancy character_class={info.row.original.character_class} />
            </div>
          ),
          sortingFn: sortingFns.text,
          size: 200,
        },
        {
          accessorKey: "experience",
          header: "Level",
          cell: (info) => (
            <ExperienceBar
              experience={info.row.original.experience}
              level={info.row.original.level}
            />
          ),
          sortingFn: sortingFns.basic,

          size: 80,
        },
        {
          accessorKey: "delve",
          header: "Delve",
          sortingFn: sortingFns.basic,
        },
      ];
    } else {
      columns = [
        {
          accessorKey: "delve",
          header: "Depth",
          sortingFn: sortingFns.basic,
          size: 10,
        },
        {
          header: "Character",
          cell: (info) => (
            <LadderPortrait
              entry={info.row.original}
              teamName={userToTeam[info.row.original.user_id]?.name}
            />
          ),
          size: 400,
        },
      ];
    }
    return columns;
  }, [isMobile]);
  return (
    <>
      <TeamScore category={category} />
      {fossilRaceCategory ? (
        <>
          <div className="divider divider-primary">Fossil Race</div>
          <Ranking
            objective={fossilRaceCategory}
            description="Fossils:"
            actual={(teamId) =>
              fossilRaceCategory.objectives.reduce(
                (acc, objective) =>
                  acc +
                  Math.min(
                    objective.team_score[teamId].number,
                    objective.required_number
                  ),
                0
              )
            }
            maximum={fossilRaceCategory.objectives.reduce(
              (acc, objective) => acc + objective.required_number,
              0
            )}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-4">
            {fossilRaceCategory.objectives.map((objective) => {
              return (
                <div className="card bg-base-300" key={objective.id}>
                  <div className=" rounded-t-box flex  m-0 px-4 bg-base-200 p-2 ">
                    <ObjectiveIcon
                      objective={objective}
                      gameVersion={currentEvent.game_version}
                      className="h-8"
                    />

                    <h3 className="flex-grow text-center text-xl font-semibold mx-4 ">
                      {objective.name}
                    </h3>
                  </div>
                  <div className="pb-4 mb-0 bg-base-300 rounded-b-box">
                    <CollectionCardTable
                      objective={objective}
                      showPoints={false}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : null}
      {culmulativeDepthObjective ? (
        <>
          <div className="divider divider-primary">
            {"Culmulative Team Depth"}
          </div>
          <div className="flex flex-col gap-4">
            <Ranking
              objective={culmulativeDepthObjective}
              maximum={culmulativeDepthObjective.required_number}
              actual={(teamId: number) =>
                culmulativeDepthObjective.team_score[teamId].number
              }
              description="Delve:"
            />
            <Table
              columns={delveLadderColumns}
              data={ladder}
              pageSizeOptions={[10, 25, 50, 100]}
            />
          </div>
        </>
      ) : null}
    </>
  );
}
