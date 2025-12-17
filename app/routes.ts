import { index, layout, type RouteConfig, route } from "@react-router/dev/routes";

export default [
  layout("layouts/layouts.tsx", [
    index("routes/dashboard.tsx"),
    route("tasks", "routes/tasks.tsx"),
    route("task/new", "routes/task-new.tsx"),
    route("task/edit/:id", "routes/task-edit.tsx"),
  ]),
  // Catch-all route outside layout to avoid interfering with POST requests
  route("*", "routes/catch-all.tsx"),
] satisfies RouteConfig;
