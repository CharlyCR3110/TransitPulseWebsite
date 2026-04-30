import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const SEED_IMPORT_RULE = {
  paths: [
    {
      name: "@/data/transit",
      importNames: ["ALERTS", "NEARBY_STOPS", "INITIAL_ARRIVALS", "TRIP_OPTIONS"],
      message:
        "Seed data is provider-only. Use the relevant hook from @/data/providers (e.g. useStops, useAlerts) so the build-time mock/API switch is honored.",
    },
  ],
};

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      "no-restricted-imports": ["error", SEED_IMPORT_RULE],
    },
  },
  {
    files: ["src/data/providers/mock/**/*.{ts,tsx}", "src/data/transit.ts"],
    rules: {
      "no-restricted-imports": "off",
    },
  },
]);

export default eslintConfig;
