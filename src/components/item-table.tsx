import { Table, Image } from "antd";
import { ColumnsType } from "antd/es/table";
import { ScoreCategory } from "../types/score";
import { getImage } from "../types/scoring-objective";
import { GlobalStateContext } from "../utils/context-provider";
import { useContext } from "react";

export type ItemTableProps = {
  category?: ScoreCategory;
  selectedTeam?: number;
  style?: React.CSSProperties;
};

export function ItemTable({ category, selectedTeam, style }: ItemTableProps) {
  const { currentEvent } = useContext(GlobalStateContext);
  if (!currentEvent || !category) {
    return <></>;
  }

  const tableRows = category.objectives.map((objective) => ({
    key: objective.id,
    name: objective.name,
    img_location: getImage(objective),
    ...currentEvent.teams.reduce((acc: { [teamId: number]: boolean }, team) => {
      acc[team.id] = objective.team_score[team.id].finished;
      return acc;
    }, {}),
  }));

  const tableColumns: ColumnsType = [
    {
      title: "",
      render: (img_location: string | null) => {
        return img_location ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              maxHeight: "60px",
            }}
          >
            <Image
              src={img_location}
              style={{
                height: "100%",
                maxHeight: "60px",
                width: "auto",
                maxWidth: "120px",
              }}
            />
          </div>
        ) : (
          ""
        );
      },
      dataIndex: "img_location",
      key: "img_location",
      width: 120,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    ...currentEvent.teams
      .slice()
      .sort((a, b) =>
        a.id === selectedTeam ? -1 : b.id === selectedTeam ? 1 : 0
      )
      .map((team) => ({
        title: team.name,
        dataIndex: team.id.toString(),
        key: team.id.toString(),
        render: (finished: boolean) => (finished ? "✅" : "❌"),
        // width: 10,
      })),
  ];

  return (
    <Table
      columns={tableColumns}
      dataSource={tableRows}
      pagination={false}
      style={{ ...style }}
    />
  );
}
