import { Card, Divider, Tooltip } from "antd";
import { useContext } from "react";
import { GlobalStateContext } from "../utils/context-provider";
import { getSubCategory } from "../types/scoring-category";
import { red } from "@ant-design/colors";
import TeamScore from "../components/team-score";
import { CollectionCardTable } from "../components/collection-card-table";
import Meta from "antd/es/card/Meta";
import { ObjectiveIcon } from "../components/objective-icon";

export function CollectionTab() {
  const { scores, currentEvent } = useContext(GlobalStateContext);
  const category = getSubCategory(scores, "Collections");

  if (!category || !currentEvent) {
    return <></>;
  }
  return (
    <>
      <TeamScore category={category}></TeamScore>
      <Divider>{`Collection Goals`}</Divider>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "8px",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        {category.objectives.map((objective) => {
          return (
            <Card
              key={objective.id}
              size="small"
              styles={{
                body: {
                  // so that the highlight color goes all the way to the edge
                  paddingLeft: "0px",
                  paddingRight: "0px",
                },
              }}
            >
              <Meta
                avatar={<ObjectiveIcon objective={objective} />}
                style={{
                  height: "100%",
                  maxHeight: "60px",
                  width: "auto",
                  paddingLeft: "10px",
                  paddingRight: "10px",
                }}
                title={
                  <Tooltip title={objective.extra}>
                    <div
                      style={{
                        whiteSpace: "normal",
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                      }}
                    >
                      {`Collect ${objective.required_number} ${objective.name}`}
                      {objective.extra ? (
                        <a style={{ color: red[6] }}>*</a>
                      ) : null}
                    </div>
                  </Tooltip>
                }
              />
              <CollectionCardTable objective={objective} />
            </Card>
          );
        })}
      </div>
    </>
  );
}
