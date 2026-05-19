import React, {
  useState,
  useCallback,
} from "react";

const PRIORITIES = [
  "All",
  "High",
  "Medium",
  "Low",
];

const STATUSES = [
  {
    value: "all",
    label: "All Statuses",
  },
  {
    value: "pending",
    label: "Pending",
  },
  {
    value: "on_track",
    label: "On Track",
  },
  {
    value: "completed",
    label: "Completed",
  },
];

const GoalSearchFilter = ({
  onFilterChange,
  totalCount = 0,
}) => {

  const [filters, setFilters] =
    useState({
      search: "",
      priority: "All",
      status: "all",
      sortBy: "newest",
    });

  const [expanded, setExpanded] =
    useState(true);

  const update = useCallback(
    (key, value) => {

      const next = {
        ...filters,
        [key]: value,
      };

      setFilters(next);

      onFilterChange?.(next);

    },
    [filters, onFilterChange]
  );

  const reset = () => {

    const fresh = {
      search: "",
      priority: "All",
      status: "all",
      sortBy: "newest",
    };

    setFilters(fresh);

    onFilterChange?.(fresh);

  };

  const activeFilterCount = [
    filters.priority !== "All",
    filters.status !== "all",
  ].filter(Boolean).length;

  return (
    <div className="space-y-4 mb-8 w-full">

      <div className="flex flex-col md:flex-row gap-4">

        <div className="relative flex-1">

          <input
            type="text"
            value={filters.search}
            onChange={(e) =>
              update(
                "search",
                e.target.value
              )
            }
            placeholder="Search goals..."
            className="w-full bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-white placeholder-gray-400 outline-none focus:border-blue-500"
          />

        </div>

        <button
          onClick={() =>
            setExpanded(
              !expanded
            )
          }
          className={`px-6 py-4 rounded-2xl border transition-all ${
            activeFilterCount > 0
              ? "bg-blue-600 border-blue-500 text-white"
              : "bg-gray-900 border-gray-700 text-gray-300"
          }`}
        >

          Filters
          {activeFilterCount > 0 &&
            ` (${activeFilterCount})`}

        </button>

        <select
          value={filters.sortBy}
          onChange={(e) =>
            update(
              "sortBy",
              e.target.value
            )
          }
          className="bg-gray-900 border border-gray-700 rounded-2xl px-5 py-4 text-white"
        >

          <option value="newest">
            Newest
          </option>

          <option value="oldest">
            Oldest
          </option>

          <option value="priority">
            Priority
          </option>

          <option value="progress">
            Progress
          </option>

        </select>

      </div>

      {expanded && (

        <div className="bg-gray-900 border border-gray-700 rounded-3xl p-6 space-y-6">

          <div>

            <h3 className="text-sm uppercase text-gray-400 mb-3">
              Priority
            </h3>

            <div className="flex flex-wrap gap-3">

              {PRIORITIES.map(
                (priority) => (

                  <button
                    key={priority}
                    onClick={() =>
                      update(
                        "priority",
                        priority
                      )
                    }
                    className={`px-4 py-2 rounded-xl ${
                      filters.priority ===
                      priority
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 text-gray-300"
                    }`}
                  >

                    {priority}

                  </button>

                )
              )}

            </div>

          </div>

          <div>

            <h3 className="text-sm uppercase text-gray-400 mb-3">
              Status
            </h3>

            <select
              value={filters.status}
              onChange={(e) =>
                update(
                  "status",
                  e.target.value
                )
              }
              className="w-full bg-gray-800 border border-gray-700 rounded-2xl px-5 py-4 text-white"
            >

              {STATUSES.map(
                (status) => (

                  <option
                    key={status.value}
                    value={
                      status.value
                    }
                  >

                    {status.label}

                  </option>

                )
              )}

            </select>

          </div>

          <div className="flex justify-between items-center pt-4 border-t border-gray-700">

            <p className="text-sm text-gray-400">

              Showing{" "}
              <span className="text-white font-bold">
                {totalCount}
              </span>{" "}
              goals

            </p>

            <button
              onClick={reset}
              className="text-red-400 hover:text-red-300"
            >

              Clear Filters

            </button>

          </div>

        </div>

      )}

    </div>
  );
};

export default GoalSearchFilter;