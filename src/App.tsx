import { Button, Layout, Menu, MenuProps } from "antd";
import "./App.css";
import { useEffect, useState } from "react";
import { RouterProvider } from "react-router-dom";
import { Content, Footer, Header } from "antd/es/layout/layout";
import AuthButton from "./components/auth-button";
import { ContextProvider } from "./utils/context-provider";
import { MinimalUser, User, UserPermission } from "./types/user";
import { fetchUsersForEvent, getUserInfo } from "./client/user-client";
import { router } from "./router";
import { fetchCurrentEvent, fetchEventStatus } from "./client/event-client";
import { BPLEvent, EventStatus } from "./types/event";
import { useError } from "./components/errorcontext";
import {
  HomeOutlined,
  LineChartOutlined,
  MenuOutlined,
  ReadOutlined,
  SettingOutlined,
  TwitchOutlined,
} from "@ant-design/icons";
import { ScoringCategory } from "./types/scoring-category";
import { fetchCategoryForEvent } from "./client/category-client";
import { fetchScores } from "./client/score-client";
import { ScoreCategory } from "./types/score";
import { mergeScores } from "./utils/utils";
import { fetchScoringPresetsForEvent } from "./client/scoring-preset-client";
import { ScoringPreset } from "./types/scoring-preset";
import ApplicationButton from "./components/application-button";
import { scoringTabs } from "./pages/scoring-page";
import { greyDark } from "@ant-design/colors";
type MenuItem = Required<MenuProps>["items"][number] & {
  roleRequired?: UserPermission[];
};

function getKeys(items: any[]): string[] {
  let keys = [];
  for (let item of items) {
    keys.push(item.key);
    if (item.children) {
      keys.push(...getKeys(item.children));
    }
  }
  return keys;
}

function filterMenuItems(items: MenuItem[], user: User | undefined) {
  let userRoles = user?.permissions;
  let authItems = [];
  for (let item of items) {
    if (item.roleRequired) {
      if (
        userRoles &&
        item.roleRequired.some((role) => userRoles.includes(role))
      ) {
        authItems.push(item);
      }
    } else {
      authItems.push(item);
    }
  }
  return authItems;
}

function App() {
  const [currentNav, setCurrentNav] = useState<string>();
  const [user, setUser] = useState<User>();
  const [currentEvent, setCurrentEvent] = useState<BPLEvent>();
  const [eventStatus, setEventStatus] = useState<EventStatus>();
  const [rules, setRules] = useState<ScoringCategory>();
  const { scoreData } = fetchScores(currentEvent?.id);
  const [scores, setScores] = useState<ScoreCategory>();
  const [scoringPresets, setScoringPresets] = useState<ScoringPreset[]>();
  const [users, setUsers] = useState<MinimalUser[]>([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 900);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  useEffect(() => {
    const items = [
      {
        label: "Admin",
        key: "Admin",
        icon: <SettingOutlined />,
        extra: "right",
        roleRequired: [UserPermission.ADMIN],
        children: [
          { label: "Events", key: "/events" },
          { label: "Manage users", key: "/users" },
          { label: "Sort users", key: "/users/sort" },
        ],
      },
      {
        // scoring subtabs are only shown in mobile view here
        label: "Scoring",
        key: "/scores",
        icon: <LineChartOutlined />,
        children: isMobile
          ? scoringTabs.map((tab) => ({
              label: tab.key,
              key: `/scores?tab=${tab.key}`,
            }))
          : undefined,
      },
      {
        label: "Streams",
        key: "/streams",
        icon: <TwitchOutlined />,
      },
      {
        label: "Rules",
        key: "/rules",
        icon: <ReadOutlined />,
      },
    ];
    for (let key of getKeys(items)) {
      if (window.location.pathname.includes(key)) {
        setCurrentNav(key);
        break;
      }
    }
    setMenuItems(filterMenuItems(items, user));
  }, [isMobile, user]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (rules && scoreData && currentEvent && scoringPresets) {
      setScores(
        mergeScores(
          rules,
          scoreData,
          currentEvent?.teams.map((team) => team.id),
          scoringPresets
        )
      );
    }
  }, [rules, scoreData, currentEvent, scoringPresets]);

  useEffect(() => {
    getUserInfo().then((data) => setUser(data));
    fetchCurrentEvent().then((event) => {
      setCurrentEvent(event);
      fetchCategoryForEvent(event.id).then((rules) => setRules(rules));
      fetchScoringPresetsForEvent(event.id).then((presets) =>
        setScoringPresets(presets)
      );
      fetchUsersForEvent(event.id).then((users) => setUsers(users));
    });
  }, []);

  useEffect(() => {
    if (currentEvent && user) {
      fetchEventStatus(currentEvent.id).then((status) =>
        setEventStatus(status)
      );
    }
  }, [currentEvent, user]);

  const sendNotification = useError().sendNotification;

  useEffect(() => {
    window.addEventListener("error", handleError);
  }, []);
  const handleError = (a: ErrorEvent) => {
    console.log("HANDLING ERROR");
    sendNotification(a.message, "error");
  };

  useEffect(() => {
    window.addEventListener("warning", handleWarning);
  });
  const handleWarning = (a: Event) => {
    sendNotification((a as CustomEvent).detail, "warning");
  };

  useEffect(() => {
    window.addEventListener("success", handleSuccess);
  });
  const handleSuccess = (a: Event) => {
    sendNotification((a as CustomEvent).detail, "success");
  };
  return (
    <>
      <ContextProvider
        value={{
          user: user,
          setUser: setUser,
          currentEvent: currentEvent,
          setCurrentEvent: setCurrentEvent,
          rules: rules,
          setRules: setRules,
          eventStatus: eventStatus,
          setEventStatus: setEventStatus,
          scores: scores,
          setScores: setScores,
          users: users,
          setUsers: setUsers,
          isMobile: isMobile,
          setIsMobile: setIsMobile,
        }}
      >
        {" "}
        <Layout
          style={{
            maxWidth: "1440px",
            margin: "auto",
            textAlign: "center",
          }}
        >
          <Header
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#4096ff",
              padding: "0",
            }}
          >
            {isMobile ? null : (
              <Button
                type="text"
                style={{
                  height: "100%",
                  borderRadius: "0",
                  borderWidth: "20px",
                  borderStyle: "solid",
                  background: greyDark[3],
                  fontSize: "2em",
                  fontWeight: "bold",
                  fontFamily: "fantasy",
                  padding: "0px 40px 0px 20px",
                }}
                icon={
                  <img
                    src="assets/app-logos/bpl-logo.png"
                    style={{ height: "40px" }}
                  />
                }
                onClick={() => {
                  setCurrentNav("/");
                  router.navigate("/");
                }}
              >
                BPL
              </Button>
            )}
            <Menu
              style={{
                flex: 1,
                userSelect: "none",
                border: "1px solid transparent",
                alignItems: "left",
                display: "flex",
              }}
              onClick={(e) => {
                setCurrentNav(e.key);
                router.navigate(e.key);
              }}
              selectedKeys={currentNav ? [currentNav] : []}
              mode="horizontal"
              items={
                isMobile
                  ? [
                      {
                        key: "Menu",
                        icon: <MenuOutlined />,
                        children: [
                          {
                            key: "/",
                            label: "Home",
                            icon: <HomeOutlined />,
                          },
                          ...menuItems,
                        ],
                      },
                    ]
                  : menuItems
              }
            />
            <ApplicationButton style={{ height: "100%" }} />
            <AuthButton style={{ height: "100%" }} />
          </Header>
          <Content style={{ minHeight: "80vh" }}>
            <RouterProvider router={router} />
          </Content>

          <Footer>
            This product isn't affiliated with or endorsed by Grinding Gear
            Games in any way.
          </Footer>
        </Layout>
      </ContextProvider>
    </>
  );

  return;
}

export default App;
