const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/**
 * GIBS Programme Catalogue Integrity Check
 *
 * This script ensures that src/lib/data.ts remains byte-for-byte identical
 * to the authorized production version. Any modification to the catalogue
 * must be explicitly authorized and the hash updated manually.
 */

const FILE_PATH = path.join(__dirname, '../../src/lib/data.ts');
const EXPECTED_HASH = '910ff4d75ad3110aa3062e0fbc3e6ea73074d0004a53780c35a961cef64dbde7';

function verifyIntegrity() {
  try {
    if (!fs.existsSync(FILE_PATH)) {
      console.error(`❌ Error: Catalogue file not found at ${FILE_PATH}`);
      process.exit(1);
    }

    const fileBuffer = fs.readFileSync(FILE_PATH);
    const actualHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');

    if (actualHash === EXPECTED_HASH) {
      console.log('✅ Catalogue integrity verified: SHA-256 matches.');
      process.exit(0);
    } else {
      console.error('❌ CRITICAL: Programme catalogue integrity violation!');
      console.error(`Expected: ${EXPECTED_HASH}`);
      console.error(`Actual:   ${actualHash}`);
      console.error('\nIf this change was authorized, update the EXPECTED_HASH in this script after review.');
      process.exit(1);
    }
  } catch (err) {
    console.error('❌ Unexpected error during integrity check:', err);
    process.exit(1);
  }
}

verifyIntegrity();
