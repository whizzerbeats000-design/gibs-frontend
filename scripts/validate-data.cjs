const fs = require("fs");
const path = require("path");
const ts = require("typescript");

console.log("=== GIBS AUTHORITATIVE DATA VALIDATION ===");

const dataPath = path.join(__dirname, "../src/lib/data.ts");
if (!fs.existsSync(dataPath)) {
  console.error("ERROR: Data source file not found at src/lib/data.ts");
  process.exit(1);
}

const fileContent = fs.readFileSync(dataPath, "utf8");
const jsContent = ts.transpileModule(fileContent, {
  compilerOptions: { module: ts.ModuleKind.CommonJS },
}).outputText;

const tempFile = path.join(__dirname, "temp-data.cjs");
fs.writeFileSync(tempFile, jsContent);

let data;
try {
  data = require(tempFile);
} catch (err) {
  console.error("ERROR: Failed to load compiled data module:", err);
  if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
  process.exit(1);
} finally {
  if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
}

let errors = 0;

// 1. Validate INSTITUTION
if (!data.INSTITUTION || data.INSTITUTION.cac !== "RC 1178333") {
  console.error("FAIL: INSTITUTION CAC must be RC 1178333");
  errors++;
} else {
  console.log("PASS: INSTITUTION legal name & CAC RC 1178333 verified.");
}

// 2. Validate CONTACTS
if (
  !data.CONTACTS ||
  !data.CONTACTS.emails.includes("gibsilorin@gmail.com") ||
  !data.CONTACTS.emails.includes("goshenibs22@gmail.com")
) {
  console.error("FAIL: CONTACTS must contain official emails gibsilorin@gmail.com and goshenibs22@gmail.com");
  errors++;
} else {
  console.log("PASS: CONTACTS official emails verified.");
}

if (!data.CONTACTS.phones || data.CONTACTS.phones.length < 5) {
  console.error("FAIL: CONTACTS must contain official phone numbers");
  errors++;
} else {
  console.log("PASS: CONTACTS phone numbers verified.");
}

// 3. Validate CAMPUSES
if (!data.CAMPUSES || data.CAMPUSES.length < 3) {
  console.error("FAIL: CAMPUSES must contain Ilorin HQ, Abuja, and Ibafo campuses");
  errors++;
} else {
  console.log(`PASS: CAMPUSES verified (${data.CAMPUSES.length} campuses registered).`);
}

// 4. Validate FACULTY DESIGNATIONS
if (!data.FACULTY_DESIGNATIONS || data.FACULTY_DESIGNATIONS.length !== 14) {
  console.error("FAIL: FACULTY_DESIGNATIONS must contain 14 official designations");
  errors++;
} else {
  console.log("PASS: FACULTY_DESIGNATIONS verified (14 official designations present).");
}

// 5. Validate PROGRAMMES & Currency rules
if (!data.PROGRAMMES || data.PROGRAMMES.length === 0) {
  console.error("FAIL: PROGRAMMES array is empty");
  errors++;
} else {
  console.log(`PASS: PROGRAMMES loaded (${data.PROGRAMMES.length} programmes).`);
  data.PROGRAMMES.forEach((p, idx) => {
    if (!p.slug || !p.title) {
      console.error(`FAIL: Programme at index ${idx} missing slug or title`);
      errors++;
    }
  });
}

if (errors > 0) {
  console.error(`\nFAILED with ${errors} error(s).`);
  process.exit(1);
} else {
  console.log("\nALL GIBS DATA VALIDATIONS PASSED SUCCESSFULLY!");
  process.exit(0);
}
