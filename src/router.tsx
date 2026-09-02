import { createRouter } from "@tanstack/react-router";
import { AppErrorComponent } from "@/lib/error-component";
import { routeTree } from "./routeTree.gen";

function PendingScreen() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#f3efe6",
        color: "#1a1814",
        padding: "28px 20px",
        fontFamily: "ui-sans-serif, system-ui, sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: "#1e4a43",
          color: "#f4f0e8",
          borderRadius: 16,
          padding: "12px 16px",
          letterSpacing: "0.16em",
          fontSize: 12,
          textTransform: "uppercase",
        }}
      >
        Practice Savings Calculator
      </div>
      <p style={{ fontSize: 28, margin: "20px 0 0", fontFamily: "Georgia, serif" }}>
        Northside Dental
      </p>
      <p
        style={{
          marginTop: 28,
          fontSize: 12,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: "#6f6860",
        }}
      >
        Kept / month
      </p>
      <p
        style={{
          fontSize: 52,
          margin: "8px 0 0",
          fontFamily: "Georgia, serif",
          color: "#2c6b52",
        }}
      >
        $7,888
      </p>
    </main>
  );
}

export function getRouter() {
  return createRouter({
    routeTree,
    basepath: "/practice-savings-calculator",
    defaultErrorComponent: AppErrorComponent,
    defaultPendingComponent: PendingScreen,
  });
}
