import { Typography } from "antd";
import { TwitchStream } from "../types/twitch-stream";

export type TwitchStreamEmbedProps = {
  stream: TwitchStream;
  width?: number;
  height?: number;
};

export const TwitchStreamEmbed = ({
  stream,
  width = 640,
  height = 480,
}: TwitchStreamEmbedProps) => {
  return (
    <div
      style={{
        width: `${width}px`,
        backgroundColor: "black",
        overflow: "hidden",
        borderRadius: "8px",
      }}
    >
      <div
        style={{
          position: "relative",
        }}
      >
        <img
          src={stream.thumbnail_url
            .replace("{height}", String(height))
            .replace("{width}", String(width))}
          alt={stream.title}
        />
        <div className="twitch-live-indicator">LIVE</div>
        <div className="twitch-viewer-count">{stream.viewer_count} viewers</div>
      </div>
      <div className="twitch-stream-info">
        <div>
          <Typography.Title level={4} style={{ margin: 0 }}>
            {stream.user_name}
          </Typography.Title>
          <p id="marquee" className="twitch-stream-title">
            <span>{stream.title}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
