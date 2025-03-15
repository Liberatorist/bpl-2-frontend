import { createBrowserRouter } from "react-router-dom";
import SubmissionPage from "./pages/bounty-submissions";
import ScoringPage from "./pages/scoring-page";
import { TwitchPage } from "./pages/twitch-page";
import { RulePage } from "./pages/rules";
import { ProfilePage } from "./pages/profile";
import UserSortPage from "./pages/user-sort";
// import { ScoringReadmePage } from "./pages/scoring_readme";
import { MainPage } from "./pages/main";
import RecurringJobsPage from "./pages/recurring-jobs";
import UserPage from "./pages/users";
import ScoringCategoryPage from "./pages/scoring-categories";
import ScoringPresetsPage from "./pages/scoring-presets";
import TeamPage from "./pages/teams";
import EventPage from "./pages/event";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainPage />,
  },
  {
    path: "/events",
    element: <EventPage />,
  },
  {
    path: "/events/:eventId/teams",
    element: <TeamPage />,
  },
  {
    path: "/events/:eventId/scoring-categories/:categoryId",
    element: <ScoringCategoryPage />,
  },
  {
    path: "/events/:eventId/scoring-presets",
    element: <ScoringPresetsPage />,
  },
  {
    path: "/users",
    element: <UserPage />,
  },
  {
    path: "/events/:eventId/users/sort",
    element: <UserSortPage />,
  },
  {
    path: "/events/:eventId/submissions",
    element: <SubmissionPage />,
  },
  {
    path: "/scores",
    element: <ScoringPage />,
  },
  {
    path: "/streams",
    element: <TwitchPage />,
  },
  {
    path: "/rules",
    element: <RulePage />,
  },
  {
    path: "/profile",
    element: <ProfilePage />,
  },
  // {
  //   path: "/scoring-readme",
  //   element: <ScoringReadmePage />,
  // },
  {
    path: "/submissions",
    element: <SubmissionPage />,
  },
  {
    path: "/recurring-jobs",
    element: <RecurringJobsPage />,
  },
]);
