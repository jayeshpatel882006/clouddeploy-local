/**
 * Table column definitions for the deployment table.
 * Each column has a key, label, width, and optional sortable flag.
 */
const COLUMNS = [
  { key: "project", label: "Project", sortable: true, width: "min-w-[160px] flex-1" },
  { key: "repository", label: "Repository", width: "min-w-[200px] flex-1" },
  { key: "branch", label: "Branch", width: "w-28" },
  { key: "status", label: "Status", sortable: true, width: "w-28" },
  { key: "preview", label: "Preview", width: "w-28" },
  { key: "created", label: "Created", sortable: true, width: "w-44" },
  { key: "updated", label: "Updated", sortable: true, width: "w-44" },
  { key: "actions", label: "", width: "w-36" },
];

export default COLUMNS;
