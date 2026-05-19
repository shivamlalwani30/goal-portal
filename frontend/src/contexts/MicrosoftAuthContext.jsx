// src/contexts/MicrosoftAuthContext.jsx

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";

import { useNavigate } from "react-router-dom";

import toast from "react-hot-toast";

const MicrosoftAuthContext =
  createContext(null);

// MOCK USERS
const MOCK_AZURE_USERS = [
  {
    id: "aad-001",
    displayName:
      "Arjun Sharma",
    email:
      "arjun.sharma@atomquest.in",
    role: "employee",
    avatar: "AS",
    azureGroups: ["Employees"],
  },

  {
    id: "aad-002",
    displayName:
      "Priya Mehta",
    email:
      "priya.mehta@atomquest.in",
    role: "manager",
    avatar: "PM",
    azureGroups: [
      "Managers",
      "Employees",
    ],
  },

  {
    id: "aad-003",
    displayName:
      "Rajesh Kumar",
    email:
      "rajesh.kumar@atomquest.in",
    role: "admin",
    avatar: "RK",
    azureGroups: [
      "Admins",
      "Managers",
      "Employees",
    ],
  },
];

const resolveRole = (
  groups = []
) => {
  if (
    groups.includes("Admins")
  )
    return "admin";

  if (
    groups.includes(
      "Managers"
    )
  )
    return "manager";

  return "employee";
};

export function MicrosoftAuthProvider({
  children,
}) {
  const navigate =
    useNavigate();

  // FIXED USER STATE
  const [user, setUser] =
    useState(() => {
      const stored =
        localStorage.getItem(
          "msUser"
        );

      return stored
        ? JSON.parse(stored)
        : null;
    });

  const [ssoState, setSsoState] =
    useState({
      loading: false,
      popupOpen: false,
    });

  // KEEP USER PERSISTENT
  useEffect(() => {
    if (user) {
      localStorage.setItem(
        "msUser",
        JSON.stringify(user)
      );
    }
  }, [user]);

  // OPEN POPUP
  const initiateSSO =
    useCallback(() => {
      setSsoState({
        loading: false,
        popupOpen: true,
      });
    }, []);

  // COMPLETE LOGIN
  const completeSSO =
    useCallback(
      (azureUser) => {
        setSsoState({
          loading: true,
          popupOpen: false,
        });

        setTimeout(() => {
          const role =
            resolveRole(
              azureUser.azureGroups
            );

          const portalUser = {
            ...azureUser,
            role,
            token: `mock-jwt-${Date.now()}`,
            loginMethod:
              "microsoft_sso",
          };

          // SAVE USER
          setUser(portalUser);

          localStorage.setItem(
            "msUser",
            JSON.stringify(
              portalUser
            )
          );

          localStorage.setItem(
            "token",
            portalUser.token
          );

          toast.success(
            `Welcome ${portalUser.displayName}`
          );

          setSsoState({
            loading: false,
            popupOpen: false,
          });

          // REDIRECT
          if (
            role === "admin"
          ) {
            navigate(
              "/admin/dashboard"
            );
          } else if (
            role === "manager"
          ) {
            navigate(
              "/manager/dashboard"
            );
          } else {
            navigate(
              "/employee/dashboard"
            );
          }
        }, 1500);
      },
      [navigate]
    );

  // LOGOUT
  const logoutSSO =
    useCallback(() => {
      setUser(null);

      localStorage.removeItem(
        "msUser"
      );

      localStorage.removeItem(
        "token"
      );

      navigate("/");
    }, [navigate]);

  const cancelSSO =
    useCallback(() => {
      setSsoState({
        loading: false,
        popupOpen: false,
      });
    }, []);

  return (
    <MicrosoftAuthContext.Provider
      value={{
        user,
        setUser,
        logoutSSO,
        ssoState,
        initiateSSO,
        completeSSO,
        cancelSSO,
        mockUsers:
          MOCK_AZURE_USERS,
      }}
    >
      {children}

      {ssoState.popupOpen && (
        <AzurePopup
          onSelect={
            completeSSO
          }
          onCancel={
            cancelSSO
          }
        />
      )}

      {ssoState.loading && (
        <SSOLoader />
      )}
    </MicrosoftAuthContext.Provider>
  );
}

export const useMicrosoftAuth =
  () =>
    useContext(
      MicrosoftAuthContext
    );

// POPUP
function AzurePopup({
  onSelect,
  onCancel,
}) {
  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center">

      <div className="bg-white rounded-3xl w-[420px] overflow-hidden shadow-2xl">

        <div className="bg-black text-white p-6">

          <h2 className="text-2xl font-bold">
            Microsoft
          </h2>

          <p className="text-sm text-gray-400 mt-1">
            Sign in to Goal
            Portal
          </p>

        </div>

        <div className="p-6 space-y-3">

          {MOCK_AZURE_USERS.map(
            (user) => (
              <button
                key={user.id}
                onClick={() =>
                  onSelect(user)
                }
                className="w-full flex items-center gap-4 border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300 p-4 rounded-2xl text-left"
              >

                <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">

                  {
                    user.avatar
                  }

                </div>

                <div>

                  <h3 className="font-semibold text-gray-800">
                    {
                      user.displayName
                    }
                  </h3>

                  <p className="text-sm text-gray-500">
                    {
                      user.email
                    }
                  </p>

                </div>

              </button>
            )
          )}

          <button
            onClick={onCancel}
            className="w-full mt-4 text-gray-500 hover:text-black transition"
          >
            Cancel
          </button>

        </div>

      </div>

    </div>
  );
}

// LOADER
function SSOLoader() {
  return (
    <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center">

      <div className="bg-white rounded-3xl p-10 flex flex-col items-center shadow-2xl">

        <div className="w-14 h-14 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-5"></div>

        <h2 className="text-xl font-bold">
          Signing you in...
        </h2>

        <p className="text-gray-500 mt-2">
          Verifying Microsoft
          Entra ID
        </p>

      </div>

    </div>
  );
}