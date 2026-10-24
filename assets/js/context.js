/**
 * Universal Context & Master Branch Directory for GSPN Helper Tools
 * 
 * Central authoritative source for all MSC Codes, MSC Names, Zones, and Regions.
 * All pages and modules (RC-GD, Open Pending, Master Closer, Cancellation Report,
 * Data Extraction, Context Dictionary) refer to this master context file.
 */

(function (root, factory) {
  const context = factory();
  if (typeof root !== 'undefined') {
    root.GSPN_CONTEXT = context;
    root.GSPN_BRANCHES = context.BRANCHES;
  }
  if (typeof globalThis !== 'undefined') {
    globalThis.GSPN_CONTEXT = context;
    globalThis.GSPN_BRANCHES = context.BRANCHES;
  }
  if (typeof module === 'object' && module && module.exports) {
    module.exports = context;
  }
  if (typeof define === 'function' && define.amd) {
    define([], () => context);
  }
})(typeof self !== 'undefined' ? self : (typeof window !== 'undefined' ? window : this), function () {
  'use strict';

  // ═════════════════════════════════════════════════════════════════════════
  // 1. MASTER BRANCH DIRECTORY (MSC NAME, MSC CODE, ZONE, REGION)
  // ═════════════════════════════════════════════════════════════════════════
  const BRANCHES = [
    {
      id: 'ghaziabad',
      zone: 'India-1',
      name: 'Ghaziabad',
      mscName: 'Ghaziabad',
      code: '4915414',
      mscCode: '4915414',
      region: 'North 1',
      state: 'Uttar Pradesh',
      aliases: ['Ghaziabad', 'Ghaziabad-CE', 'GHAZIABAD', 'Gzb', 'GZB']
    },
    {
      id: 'ahmedabad',
      zone: 'India-1',
      name: 'Ahmedabad',
      mscName: 'Ahmedabad',
      code: '4917449',
      mscCode: '4917449',
      region: 'West 2',
      state: 'Gujarat',
      aliases: ['Ahmedabad', 'Ahmedabad-CE', 'Ahmdabad-CE', 'AHMEDABAD', 'Ahmdabad', 'AMD']
    },
    {
      id: 'surat',
      zone: 'India-2',
      name: 'Surat',
      mscName: 'Surat',
      code: '4936933',
      mscCode: '4936933',
      region: 'West 2',
      state: 'Gujarat',
      aliases: ['Surat', 'Surat-CE', 'SURAT', 'SRT']
    },
    {
      id: 'gandhinagar',
      zone: 'India-2',
      name: 'Gandhinagar',
      mscName: 'Gandhinagar',
      code: '6451772',
      mscCode: '6451772',
      region: 'West 2',
      state: 'Gujarat',
      aliases: ['Gandhinagar', 'Gandhinagar-CE', 'GANDHINAGAR', 'Gandhinagar-CE']
    },
    {
      id: 'cochin',
      zone: 'India-2',
      name: 'Cochin',
      mscName: 'Cochin',
      code: '6458704',
      mscCode: '6458704',
      region: 'South 2',
      state: 'Kerala',
      aliases: ['Cochin', 'Cochin-CE', 'COCHIN', 'Kochi', 'KOCHI', 'Ernakulam', 'ERNAKULAM', 'COK']
    },
    {
      id: 'lucknow',
      zone: 'India-1',
      name: 'Lucknow',
      mscName: 'Lucknow',
      code: '8200354',
      mscCode: '8200354',
      region: 'North 1',
      state: 'Uttar Pradesh',
      aliases: ['Lucknow', 'Lucknow-CE', 'LUCKNOW', 'LKO']
    },
    {
      id: 'gurgaon',
      zone: 'India-1',
      name: 'Gurgaon',
      mscName: 'Gurgaon',
      code: '9225951',
      mscCode: '9225951',
      region: 'North 1',
      state: 'Haryana',
      aliases: ['Gurgaon', 'Gurgaon-CE', 'GURGAON', 'Gurugram', 'GURUGRAM', 'GGN']
    },
    {
      id: 'lucknow-hhp',
      zone: 'India-1',
      name: 'Lucknow-HHP',
      mscName: 'Lucknow-HHP',
      code: '3871175',
      mscCode: '3871175',
      region: 'North 1',
      state: 'Uttar Pradesh',
      aliases: ['Lucknow-HHP', 'LUCKNOW-HHP', 'Lko-HHP']
    },
    {
      id: 'moradabad-hhp',
      zone: 'India-1',
      name: 'Moradabad-HHP',
      mscName: 'Moradabad-HHP',
      code: '4776004',
      mscCode: '4776004',
      region: 'North 1',
      state: 'Uttar Pradesh',
      aliases: ['Moradabad-HHP', 'MORADABAD-HHP', 'Moradabad', 'MORADABAD']
    }
  ];

  // ═════════════════════════════════════════════════════════════════════════
  // 2. ZONE & REGION GROUPINGS
  // ═════════════════════════════════════════════════════════════════════════
  const ZONES = ['India-1', 'India-2'];
  const REGIONS = ['North 1', 'West 2', 'South 2'];

  const INDIA_1_NAMES = BRANCHES.filter(b => b.zone === 'India-1').map(b => b.name);
  const INDIA_2_NAMES = BRANCHES.filter(b => b.zone === 'India-2').map(b => b.name);

  // ═════════════════════════════════════════════════════════════════════════
  // 3. MASTER REASONS & SUB-REASONS DIRECTORY (SAMSUNG GSPN TAXONOMY)
  // ═════════════════════════════════════════════════════════════════════════
  const REASONS = [
    'Eng Assigned',
    'Svc Working',
    'Part Pending',
    'Confirmation Br/Cx',
    'Samsung',
    'Support'
  ];

  const SUB_REASONS = [
    { subReason: 'Monitoring/Aging or Not reproduced', reason: 'Eng Assigned' },
    { subReason: 'Request Tech support (Technical problem)', reason: 'Support' },
    { subReason: "Re-scheduled from Eng'r / ASC", reason: 'Eng Assigned' },
    { subReason: 'Re-scheduled requested to svc center', reason: 'Svc Working' },
    { subReason: 'Customer not available', reason: 'Svc Working' },
    { subReason: 'Waiting for confirmation from customer', reason: 'Confirmation Br/Cx' },
    { subReason: 'Waiting for confirmation from SAMSUNG', reason: 'Samsung' },
    { subReason: 'Parts Back Ordered (Samsung)', reason: 'Part Pending' },
    { subReason: 'Credit Block', reason: 'Support' },
    { subReason: 'Natural disaster', reason: 'Confirmation Br/Cx' },
    { subReason: 'Processing exchange', reason: 'Samsung' },
    { subReason: 'Repair In Progress After Parts Receive', reason: 'Eng Assigned' },
    { subReason: 'Repair completed in field', reason: 'Svc Working' },
    { subReason: '[OOW] Waiting for repair price confirmation', reason: 'Confirmation Br/Cx' },
    { subReason: '[OOW] Repair price confirmed', reason: 'Confirmation Br/Cx' },
    { subReason: '[OOW] Repair price declined', reason: 'Confirmation Br/Cx' },
    { subReason: 'Pending to raise cancellation SAW', reason: 'Svc Working' },
    { subReason: 'Re-scheduling (due to Part ETA)', reason: 'Part Pending' },
    { subReason: 'Re-visit required (Additional Part)', reason: 'Part Pending' },
    { subReason: 'Re-visit required (Defective Part)', reason: 'Part Pending' },
    { subReason: 'Waiting for warranty documents (POP/BOS)', reason: 'Confirmation Br/Cx' },
    { subReason: 'Pending for Gas Charging', reason: 'Eng Assigned' },
    { subReason: 'Pending for Compressor Replacement', reason: 'Eng Assigned' },
    { subReason: 'Part received PJP Area', reason: 'Eng Assigned' },
    { subReason: 'SEND TO L4', reason: 'Eng Assigned' },
    { subReason: 'WAITING FOR FOC/DISCOUNT APPROVAL', reason: 'Samsung' },
    { subReason: 'PJP(UPCOUNTRY) CASE', reason: 'Eng Assigned' },
    { subReason: 'SEND TO WORKSHOP ESC', reason: 'Eng Assigned' },
    { subReason: 'Confirmation for SO cancellation', reason: 'Samsung' },
    { subReason: 'Confirmation from VOC team.', reason: 'Samsung' },
    { subReason: 'Confirmation for international warranty.', reason: 'Samsung' },
    { subReason: 'Confirmation for Product liability cases', reason: 'Samsung' },
    { subReason: 'Exchange SAW rejected', reason: 'Support' },
    { subReason: 'Appointment Date is set', reason: 'Eng Assigned' },
    { subReason: 'Repair in progress', reason: 'Eng Assigned' },
    { subReason: 'Engineer Departure(PDA)', reason: 'Eng Assigned' },
    { subReason: 'Engineer Arrived(PDA)', reason: 'Eng Assigned' },
    { subReason: 'Parts ordered', reason: 'Part Pending' },
    { subReason: "Assign to Eng'r after parts received", reason: 'Eng Assigned' },
    { subReason: 'Part Shipped', reason: 'Part Pending' },
    { subReason: 'Part Order Rejected, ASC to review', reason: 'Svc Working' },
    { subReason: 'Preferred date is after 7days from posting', reason: 'Svc Working' },
    { subReason: 'Request for Sr.Engineer visit', reason: 'Svc Working' },
    { subReason: 'Parts not available(ASC)', reason: 'Svc Working' },
    { subReason: 'Acknowledged (ASC)', reason: 'Svc Working' },
    { subReason: 'Waiting for Product Receive', reason: 'Svc Working' },
    { subReason: 'Pending Civil/Electrical/Plumbing', reason: 'Svc Working' },
    // Management Lite standard reasons & status mappings
    { subReason: 'Assigned to service center', reason: 'Svc Working' },
    { subReason: 'Assign to service center', reason: 'Svc Working' },
    { subReason: 'Assign to Service Center', reason: 'Svc Working' },
    { subReason: 'Assigned to Service Center', reason: 'Svc Working' },
    { subReason: 'Demo Done', reason: 'Svc Working' },
    { subReason: 'Demo done', reason: 'Svc Working' },
    { subReason: 'Goods Delivered', reason: 'Svc Working' },
    { subReason: 'Parts Allocated(Samsung)', reason: 'Part Pending' },
    { subReason: 'Parts Allocated (Samsung)', reason: 'Part Pending' },
    { subReason: "Re-scheduling by Eng'r or ASC", reason: 'Eng Assigned' },
    { subReason: 'Re-scheduling by Engr or ASC', reason: 'Eng Assigned' },
    { subReason: 'Parts In Transit (Samsung)', reason: 'Part Pending' },
    { subReason: 'Parts In Transit(Samsung)', reason: 'Part Pending' },
    { subReason: 'Parts not available (ASC)', reason: 'Svc Working' },
    { subReason: 'Parts P/O Cancellation', reason: 'Part Pending' },
    { subReason: 'Pending with Samsung : Branch confirmation', reason: 'Samsung' },
    { subReason: 'Pending with Samsung: Branch confirmation', reason: 'Samsung' }
  ];

  const REASON_TO_SUB_REASONS = {};
  REASONS.forEach(r => {
    REASON_TO_SUB_REASONS[r] = [];
  });

  const SUB_REASON_TO_REASON = {};
  const NORMALIZED_SUB_REASON_TO_REASON = {};

  SUB_REASONS.forEach(item => {
    if (REASON_TO_SUB_REASONS[item.reason]) {
      REASON_TO_SUB_REASONS[item.reason].push(item.subReason);
    }
    SUB_REASON_TO_REASON[item.subReason] = item.reason;

    const norm = item.subReason.toLowerCase().replace(/''/g, "'").replace(/\s+/g, ' ').trim();
    NORMALIZED_SUB_REASON_TO_REASON[norm] = item.reason;

    // Handle escaped quote variants (e.g. Eng''r)
    if (item.subReason.includes("'")) {
      const escapedKey = item.subReason.replace(/'/g, "''");
      SUB_REASON_TO_REASON[escapedKey] = item.reason;
      NORMALIZED_SUB_REASON_TO_REASON[escapedKey.toLowerCase().trim()] = item.reason;
    }
  });

  // ═════════════════════════════════════════════════════════════════════════
  // 4. FAST LOOKUP DICTIONARIES FOR BRANCHES
  // ═════════════════════════════════════════════════════════════════════════
  const NAME_TO_BRANCH = {};
  const CODE_TO_BRANCH = {};
  const ALIAS_TO_BRANCH = {};

  BRANCHES.forEach(b => {
    NAME_TO_BRANCH[b.name.toLowerCase()] = b;
    CODE_TO_BRANCH[b.code] = b;

    b.aliases.forEach(alias => {
      ALIAS_TO_BRANCH[alias.toLowerCase().trim()] = b;
    });
  });


  // ═════════════════════════════════════════════════════════════════════════
  // 4b. GD / FDR CLOSER REPAIR CODES & REASON ABBREVIATIONS
  // Authoritative dictionary used for closure of any service request (GD/FDR)
  // ═════════════════════════════════════════════════════════════════════════
  const REPAIR_CODES = [
  {
    "code": "A01",
    "abbreviation": "Electrical parts replacement",
    "category": "Parts Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "A02",
    "abbreviation": "Mechanical parts replacement",
    "category": "Parts Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "A03",
    "abbreviation": "Cosmetic parts replacement",
    "category": "Parts Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "A04",
    "abbreviation": "PCB replacement",
    "category": "Parts Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "A05",
    "abbreviation": "CRT replacement",
    "category": "Parts Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "A06",
    "abbreviation": "Consumables replacement",
    "category": "Parts Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "A07",
    "abbreviation": "Parts addition",
    "category": "Parts Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "A08",
    "abbreviation": "Parts removal",
    "category": "Parts Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "A09",
    "abbreviation": "UB part replacement",
    "category": "Parts Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "A10",
    "abbreviation": "Change LCD",
    "category": "Parts Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "A11",
    "abbreviation": "Change outcase",
    "category": "Parts Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "A12",
    "abbreviation": "Change handset",
    "category": "Parts Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "A13",
    "abbreviation": "Add refrigerant",
    "category": "Parts Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "A14",
    "abbreviation": "Reduce refrigerant",
    "category": "Parts Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "A15",
    "abbreviation": "Compressor replacement",
    "category": "Parts Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "A16",
    "abbreviation": "Motor replacement",
    "category": "Parts Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "A17",
    "abbreviation": "Sensor replacement",
    "category": "Parts Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "A18",
    "abbreviation": "Fan/Blower replacement",
    "category": "Parts Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "A19",
    "abbreviation": "Filter replacement",
    "category": "Parts Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "A20",
    "abbreviation": "Accessory replacement",
    "category": "Parts Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "A46",
    "abbreviation": "Cosmetic replacement(customer request)",
    "category": "Parts Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "A65",
    "abbreviation": "Other Replacement",
    "category": "Parts Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "A66",
    "abbreviation": "Module Replacement",
    "category": "Parts Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "A67",
    "abbreviation": "Other replacement by dealer",
    "category": "Parts Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "B01",
    "abbreviation": "Soldering",
    "category": "Welding & Sealed System",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "B02",
    "abbreviation": "Welding",
    "category": "Welding & Sealed System",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "B03",
    "abbreviation": "Sealed System Repair with Gas Pressure",
    "category": "Welding & Sealed System",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "C01",
    "abbreviation": "Degaussing",
    "category": "Adjustment & Alignment",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "C02",
    "abbreviation": "CRT adjustment",
    "category": "Adjustment & Alignment",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "C03",
    "abbreviation": "FBT adjustment",
    "category": "Adjustment & Alignment",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "C04",
    "abbreviation": "User mode adjustment",
    "category": "Adjustment & Alignment",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "C05",
    "abbreviation": "Factory mode adjustment",
    "category": "Adjustment & Alignment",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "C06",
    "abbreviation": "External controller adjustment",
    "category": "Adjustment & Alignment",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "C07",
    "abbreviation": "Anntena adjustment",
    "category": "Adjustment & Alignment",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "C08",
    "abbreviation": "External cable adjustment",
    "category": "Adjustment & Alignment",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "C09",
    "abbreviation": "Other electrical adjustment",
    "category": "Adjustment & Alignment",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "C10",
    "abbreviation": "Deck alignment",
    "category": "Adjustment & Alignment",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "C11",
    "abbreviation": "Tape path alignment",
    "category": "Adjustment & Alignment",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "C12",
    "abbreviation": "Leg alignment",
    "category": "Adjustment & Alignment",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "C13",
    "abbreviation": "Wire alignment",
    "category": "Adjustment & Alignment",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "C14",
    "abbreviation": "Cosmetic adjustment",
    "category": "Adjustment & Alignment",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "C15",
    "abbreviation": "Internal machine wire adjustment",
    "category": "Adjustment & Alignment",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "C96",
    "abbreviation": "Image Setting",
    "category": "Adjustment & Alignment",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "C97",
    "abbreviation": "Network Setting",
    "category": "Adjustment & Alignment",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "C98",
    "abbreviation": "Re-connection",
    "category": "Adjustment & Alignment",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "C99",
    "abbreviation": "Other mechanical adjustment",
    "category": "Adjustment & Alignment",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "D01",
    "abbreviation": "Head cleaning",
    "category": "Cleaning & Foreign Material",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "D02",
    "abbreviation": "Deck cleaning",
    "category": "Cleaning & Foreign Material",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "D03",
    "abbreviation": "Pickup cleaning",
    "category": "Cleaning & Foreign Material",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "D04",
    "abbreviation": "Cosmetic cleaning",
    "category": "Cleaning & Foreign Material",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "D05",
    "abbreviation": "Foreign material removal",
    "category": "Cleaning & Foreign Material",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "D06",
    "abbreviation": "Drain hose cleaning",
    "category": "Cleaning & Foreign Material",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "D07",
    "abbreviation": "Inlet filter cleaning",
    "category": "Cleaning & Foreign Material",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "D08",
    "abbreviation": "Magic / lint / debris filter cleaning",
    "category": "Cleaning & Foreign Material",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "D09",
    "abbreviation": "Drain valve cleaning",
    "category": "Cleaning & Foreign Material",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "D10",
    "abbreviation": "Spin tub foreign material remove",
    "category": "Cleaning & Foreign Material",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "D11",
    "abbreviation": "Drain filter cleaning",
    "category": "Cleaning & Foreign Material",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "D99",
    "abbreviation": "Other cleaning",
    "category": "Cleaning & Foreign Material",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "E01",
    "abbreviation": "Initial installation",
    "category": "Installation",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "E02",
    "abbreviation": "Re-installation",
    "category": "Installation",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "E03",
    "abbreviation": "S/W Re-installation",
    "category": "Installation",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "F01",
    "abbreviation": "PCB re-assembling",
    "category": "Re-assembling",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "F02",
    "abbreviation": "Mechanical re-assembling",
    "category": "Re-assembling",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "F03",
    "abbreviation": "Cosmetic re-assembling",
    "category": "Re-assembling",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "F17",
    "abbreviation": "Other Re-assembling",
    "category": "Re-assembling",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "G01",
    "abbreviation": "Customer Education / Explanation",
    "category": "Customer Education",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "G02",
    "abbreviation": "Dissatisfaction about Emotional Quality",
    "category": "Customer Education",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "H01",
    "abbreviation": "Firmware upgrade",
    "category": "Firmware & Software",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "H02",
    "abbreviation": "Application program modification",
    "category": "Firmware & Software",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "H03",
    "abbreviation": "Driver installation",
    "category": "Firmware & Software",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "H04",
    "abbreviation": "Data recovery",
    "category": "Firmware & Software",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "H05",
    "abbreviation": "Reformat",
    "category": "Firmware & Software",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "H06",
    "abbreviation": "Unlock",
    "category": "Firmware & Software",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "H07",
    "abbreviation": "Preventive Software Update",
    "category": "Firmware & Software",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "M01",
    "abbreviation": "PCB replacement",
    "category": "Mechanical & Deck Repair",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "M02",
    "abbreviation": "Pick-up replacement",
    "category": "Mechanical & Deck Repair",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "M03",
    "abbreviation": "FPC Harness replacement",
    "category": "Mechanical & Deck Repair",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "M04",
    "abbreviation": "Motor replacement",
    "category": "Mechanical & Deck Repair",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "M05",
    "abbreviation": "Tray disc replacement",
    "category": "Mechanical & Deck Repair",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "M06",
    "abbreviation": "Deck Ass'y repair/replacement",
    "category": "Mechanical & Deck Repair",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "M07",
    "abbreviation": "Housing replacement",
    "category": "Mechanical & Deck Repair",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "M08",
    "abbreviation": "Mechanical repair",
    "category": "Mechanical & Deck Repair",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "M09",
    "abbreviation": "Adjustment",
    "category": "Mechanical & Deck Repair",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "M10",
    "abbreviation": "Cleaning",
    "category": "Mechanical & Deck Repair",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "M11",
    "abbreviation": "Re-assemble",
    "category": "Mechanical & Deck Repair",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "M12",
    "abbreviation": "Scrap",
    "category": "Mechanical & Deck Repair",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "M13",
    "abbreviation": "Test OK",
    "category": "Mechanical & Deck Repair",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "M14",
    "abbreviation": "Re-soldering",
    "category": "Mechanical & Deck Repair",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "M15",
    "abbreviation": "PCB Front replacement",
    "category": "Mechanical & Deck Repair",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "M16",
    "abbreviation": "Spindle Motor replacement",
    "category": "Mechanical & Deck Repair",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "M17",
    "abbreviation": "Loading Motor replacement",
    "category": "Mechanical & Deck Repair",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "M18",
    "abbreviation": "Stepping Motor replacement",
    "category": "Mechanical & Deck Repair",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "M19",
    "abbreviation": "Door tray replacement",
    "category": "Mechanical & Deck Repair",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "M20",
    "abbreviation": "Panel Front replacement",
    "category": "Mechanical & Deck Repair",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "M21",
    "abbreviation": "Spindle Motor Drive IC replacement",
    "category": "Mechanical & Deck Repair",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "M22",
    "abbreviation": "Loading Motor Drive IC replacement",
    "category": "Mechanical & Deck Repair",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "M99",
    "abbreviation": "Other repair",
    "category": "Mechanical & Deck Repair",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "PD",
    "abbreviation": "Site Compensation",
    "category": "Compensation",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q01",
    "abbreviation": "Accs_Repair/Change Accessories",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q02",
    "abbreviation": "Boad_Replace Board",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q03",
    "abbreviation": "Boad_Board Repair",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q04",
    "abbreviation": "Boad_Re-connect Board",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q05",
    "abbreviation": "Cble_Replace system cable",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q06",
    "abbreviation": "Cble_Re-conncect system cable",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q07",
    "abbreviation": "Cble_external cable problem",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q08",
    "abbreviation": "Hard_Replace HDD",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q09",
    "abbreviation": "Hous_Replace housing&mechanical",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q0A",
    "abbreviation": "Keys_Replace alphakey",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q0B",
    "abbreviation": "MNT_Replace Monitor",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q0C",
    "abbreviation": "MNT_Adjustment monitor setting",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q0D",
    "abbreviation": "MNT_Repair monitor",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q0E",
    "abbreviation": "ODD_Replace ODD",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q0F",
    "abbreviation": "Opti_Add/cancel option",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q0G",
    "abbreviation": "PC_Replace PC",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q0H",
    "abbreviation": "PC_Repair PC",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q0I",
    "abbreviation": "PC_Re-connect PC",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q0J",
    "abbreviation": "Peri_Replace peripheral",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q0K",
    "abbreviation": "Peri_Adjust/Repair other peripheral",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q0L",
    "abbreviation": "PWR_Replace Power",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q0M",
    "abbreviation": "PWR_Repair Power",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q0N",
    "abbreviation": "Prevent_B/S(Before Service)",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q0O",
    "abbreviation": "Prevent_Preventive Maintence",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q0P",
    "abbreviation": "Prob_Probe Change",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q0Q",
    "abbreviation": "Prob_Probe Repair",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q0R",
    "abbreviation": "Prob_Probe ETC Repair",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q0S",
    "abbreviation": "S/W_S/W RE-INSTALLATION or Upgrade",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q0T",
    "abbreviation": "Sett_Dicom/Network setting",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q0U",
    "abbreviation": "Sett_Image or S/W SETTING",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q0V",
    "abbreviation": "SVC_Demo product service",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q0W",
    "abbreviation": "SVC_Additional installation core(noise)",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q0X",
    "abbreviation": "SVC_other service",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q0Y",
    "abbreviation": "SVC_Data Backup/Restore",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q0Z",
    "abbreviation": "SVC_cost consultation",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q11",
    "abbreviation": "SVC_Transfer service",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q12",
    "abbreviation": "SVC_Repair cancel",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q13",
    "abbreviation": "SVC_System Check (No failure) or Move",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q14",
    "abbreviation": "SVC_remote service",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q15",
    "abbreviation": "SVC_phone consultation",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q16",
    "abbreviation": "Sys_System Change",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q17",
    "abbreviation": "Sys_Decomposition/Assembly system",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q18",
    "abbreviation": "Sys_System Repair",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q19",
    "abbreviation": "Sys_System Check (NDF)",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q1A",
    "abbreviation": "Sys_Electrical parts replacement",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q1B",
    "abbreviation": "T/B_Repalce trackball",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q1C",
    "abbreviation": "T/B_Clean trackball",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q1D",
    "abbreviation": "Touch_Replace Touch panel",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q1E",
    "abbreviation": "Touch_Calibration Touch Panel",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q1F",
    "abbreviation": "User_Customer Education / Explanation",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q1G",
    "abbreviation": "User_customer fault",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q21",
    "abbreviation": "Q21-Prob_Reconnect Probe",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q22",
    "abbreviation": "Q22-Peri_Supply Peripheral Goods",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q23",
    "abbreviation": "Q23-Keys_Fix Alphakey",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q24",
    "abbreviation": "Q24-SVC_Computational Processing",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q25",
    "abbreviation": "Q25-SVC_Service(order) parts defect",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q5S",
    "abbreviation": "Q5S-System/Probe Install",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q5T",
    "abbreviation": "Q5T-System Move",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q5U",
    "abbreviation": "Q5U-SW Upgrade",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q81",
    "abbreviation": "Q81-Replacement of components",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q82",
    "abbreviation": "Q82-Calibration",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q83",
    "abbreviation": "Q83-SW/FW",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q84",
    "abbreviation": "Q84-Adjustment(SW)",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q85",
    "abbreviation": "Q85-Adjustment(HW)",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q86",
    "abbreviation": "Q86-Get Log/Image file",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q87",
    "abbreviation": "Q87-Installation SW/FW",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q88",
    "abbreviation": "Q88-Reconnection",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q89",
    "abbreviation": "Q89-Monitoring",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q8A",
    "abbreviation": "Q8A-Explanation for usage",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q8B",
    "abbreviation": "Q8B-Replacement of Loaner",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q8C",
    "abbreviation": "Q8C-Inventory handling",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q8D",
    "abbreviation": "Q8D-Move installation place",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q8E",
    "abbreviation": "Q8E-System setting",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q8F",
    "abbreviation": "Q8F-No technical support",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q8G",
    "abbreviation": "Q8G-Customer fault",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q8H",
    "abbreviation": "Q8H-Transfer service(Third-party system)",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q8I",
    "abbreviation": "Q8I-Repair of components",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q8J",
    "abbreviation": "Q8J-Sales option",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q8K",
    "abbreviation": "Q8K-External influence",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q8L",
    "abbreviation": "Q8L-Customer request",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q8M",
    "abbreviation": "Q8M-Engineer fault",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q8N",
    "abbreviation": "Q8N-Installation SW/FW",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q91",
    "abbreviation": "Q91-Customer fault (Reagent/Cartridge)",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q92",
    "abbreviation": "Q92-Cartridge Performance Issue",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q93",
    "abbreviation": "Q93-CartridgeOutward(Print/Attach/Scratc",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q94",
    "abbreviation": "Q94-Specimen (Hemolysis/Interference)",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q95",
    "abbreviation": "Q95-other service (Reagent/Cartridge)",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q96",
    "abbreviation": "Q96-Req.SpecimenInquiry(Reagent/Cartridg",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q9A",
    "abbreviation": "Q9A-External Ground connection",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q9B",
    "abbreviation": "Q9B-Detector Alignment",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q9C",
    "abbreviation": "Q9C-Set calibration",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q9D",
    "abbreviation": "Q9D-Manufacturer Instrument Factor Calib",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Q9E",
    "abbreviation": "Q9E-Dust removal",
    "category": "System, Probe & Defect",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "R24",
    "abbreviation": "Replacement, assy",
    "category": "Apparatus & Board Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "R25",
    "abbreviation": "Replacement, mechanical parts",
    "category": "Apparatus & Board Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "R26",
    "abbreviation": "Replacement, electrical parts",
    "category": "Apparatus & Board Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "R27",
    "abbreviation": "Replacement, cover",
    "category": "Apparatus & Board Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "R28",
    "abbreviation": "Replacement, PBA",
    "category": "Apparatus & Board Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "R29",
    "abbreviation": "Replacement, cable",
    "category": "Apparatus & Board Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "R2A",
    "abbreviation": "Replacement, tube",
    "category": "Apparatus & Board Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "R2B",
    "abbreviation": "Replacement, detector",
    "category": "Apparatus & Board Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "R2C",
    "abbreviation": "Replacement, fan",
    "category": "Apparatus & Board Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "R2D",
    "abbreviation": "Replacement, battery",
    "category": "Apparatus & Board Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "R2E",
    "abbreviation": "Replacement, LCD",
    "category": "Apparatus & Board Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "R2F",
    "abbreviation": "Replacement, sensor",
    "category": "Apparatus & Board Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "R2G",
    "abbreviation": "Repair assy",
    "category": "Apparatus & Board Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "R2H",
    "abbreviation": "Repair mechanical parts",
    "category": "Apparatus & Board Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "R2I",
    "abbreviation": "Repair electrical parts",
    "category": "Apparatus & Board Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "R2J",
    "abbreviation": "Repair cover",
    "category": "Apparatus & Board Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "R2K",
    "abbreviation": "Repair PBA",
    "category": "Apparatus & Board Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "R2L",
    "abbreviation": "Repair cable",
    "category": "Apparatus & Board Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "R2M",
    "abbreviation": "Repair other",
    "category": "Apparatus & Board Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "R2N",
    "abbreviation": "Reconnection",
    "category": "Apparatus & Board Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "R2O",
    "abbreviation": "Adjustment(HW)",
    "category": "Apparatus & Board Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "R2P",
    "abbreviation": "Adjustment(SW)",
    "category": "Apparatus & Board Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "R2Q",
    "abbreviation": "Calibration",
    "category": "Apparatus & Board Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "R2R",
    "abbreviation": "Reinstallation / Recovery SW, FW",
    "category": "Apparatus & Board Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "R2S",
    "abbreviation": "Get the log file & check",
    "category": "Apparatus & Board Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "R2T",
    "abbreviation": "Upgrade SW/FW(remedy)",
    "category": "Apparatus & Board Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "R2U",
    "abbreviation": "Upgrade SW/FW",
    "category": "Apparatus & Board Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "R2V",
    "abbreviation": "Upgrade HW",
    "category": "Apparatus & Board Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "R2W",
    "abbreviation": "PM",
    "category": "Apparatus & Board Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "R2X",
    "abbreviation": "BS",
    "category": "Apparatus & Board Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "R2Y",
    "abbreviation": "RM",
    "category": "Apparatus & Board Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "R2Z",
    "abbreviation": "Other service",
    "category": "Apparatus & Board Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "R31",
    "abbreviation": "External influence",
    "category": "Apparatus & Board Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "R32",
    "abbreviation": "Customer fault",
    "category": "Apparatus & Board Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "R33",
    "abbreviation": "No technical support",
    "category": "Apparatus & Board Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "R34",
    "abbreviation": "Instruction",
    "category": "Apparatus & Board Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "R35",
    "abbreviation": "Clean and Lubricate",
    "category": "Apparatus & Board Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "R36",
    "abbreviation": "System setting change",
    "category": "Apparatus & Board Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "RD",
    "abbreviation": "RETURN BY DARK DOT",
    "category": "NDF, Exchange & Returns",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "RN",
    "abbreviation": "REJECT BY NONE DEFAULT",
    "category": "NDF, Exchange & Returns",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "RP",
    "abbreviation": "Return by Quality Reason",
    "category": "NDF, Exchange & Returns",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "RR",
    "abbreviation": "Return by None Quality Reason",
    "category": "NDF, Exchange & Returns",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "RT",
    "abbreviation": "Reject of Return",
    "category": "NDF, Exchange & Returns",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "SW1",
    "abbreviation": "Firmware Upgrade",
    "category": "S/W & Driver Upgrade",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "SW2",
    "abbreviation": "Application Upgrade",
    "category": "S/W & Driver Upgrade",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "SW3",
    "abbreviation": "S/W Upgrade( H/W Defect )",
    "category": "S/W & Driver Upgrade",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "SW4",
    "abbreviation": "S/W Upgrade( External Factor )",
    "category": "S/W & Driver Upgrade",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "SW5",
    "abbreviation": "Application Installation",
    "category": "S/W & Driver Upgrade",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "SW6",
    "abbreviation": "Driver Installation",
    "category": "S/W & Driver Upgrade",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "SW7",
    "abbreviation": "Resetting",
    "category": "S/W & Driver Upgrade",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "U1W",
    "abbreviation": "Revisit required",
    "category": "Diagnostic & Component Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "U1X",
    "abbreviation": "Replace Fluidic part",
    "category": "Diagnostic & Component Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "U1Y",
    "abbreviation": "Replace analyzer",
    "category": "Diagnostic & Component Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "U1Z",
    "abbreviation": "Replace Assistance",
    "category": "Diagnostic & Component Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "U21",
    "abbreviation": "Rerun with New Reagent",
    "category": "Diagnostic & Component Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "U22",
    "abbreviation": "Rerun same Sample, QC",
    "category": "Diagnostic & Component Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "U23",
    "abbreviation": "Rerun New Sample, QC",
    "category": "Diagnostic & Component Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "U24",
    "abbreviation": "Change enviroment",
    "category": "Diagnostic & Component Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "U25",
    "abbreviation": "Change consumable",
    "category": "Diagnostic & Component Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "U26",
    "abbreviation": "Document",
    "category": "Diagnostic & Component Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "U27",
    "abbreviation": "Replace accessary",
    "category": "Diagnostic & Component Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "U28",
    "abbreviation": "Training",
    "category": "Diagnostic & Component Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "U29",
    "abbreviation": "Replacement, assy",
    "category": "Diagnostic & Component Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "U2A",
    "abbreviation": "Replacement, mechanical parts",
    "category": "Diagnostic & Component Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "U2B",
    "abbreviation": "Replacement, electrical parts",
    "category": "Diagnostic & Component Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "U2C",
    "abbreviation": "Replacement, cover",
    "category": "Diagnostic & Component Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "U2D",
    "abbreviation": "Replacement, PBA",
    "category": "Diagnostic & Component Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "U2E",
    "abbreviation": "Replacement, cable",
    "category": "Diagnostic & Component Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "U2F",
    "abbreviation": "Replacement, Fan",
    "category": "Diagnostic & Component Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "U2G",
    "abbreviation": "Replacement, LCD",
    "category": "Diagnostic & Component Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "U2H",
    "abbreviation": "Replacement, Sensor",
    "category": "Diagnostic & Component Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "U2I",
    "abbreviation": "Repair assy",
    "category": "Diagnostic & Component Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "U2J",
    "abbreviation": "Repair mechanical parts",
    "category": "Diagnostic & Component Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "U2K",
    "abbreviation": "Repair electrical parts",
    "category": "Diagnostic & Component Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "U2L",
    "abbreviation": "Repair cover",
    "category": "Diagnostic & Component Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "U2M",
    "abbreviation": "Repair PBA",
    "category": "Diagnostic & Component Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "U2N",
    "abbreviation": "Repair cable",
    "category": "Diagnostic & Component Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "U2O",
    "abbreviation": "Repair other",
    "category": "Diagnostic & Component Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "U2P",
    "abbreviation": "Reconnection",
    "category": "Diagnostic & Component Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "U2Q",
    "abbreviation": "Adjustment(HW)",
    "category": "Diagnostic & Component Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "U2R",
    "abbreviation": "Adjustment(SW)",
    "category": "Diagnostic & Component Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "U2S",
    "abbreviation": "Calibration",
    "category": "Diagnostic & Component Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "U2T",
    "abbreviation": "Reinstallation / Recovery SW, FW",
    "category": "Diagnostic & Component Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "U2U",
    "abbreviation": "Upgrade SW/FW(remedy)",
    "category": "Diagnostic & Component Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "U2V",
    "abbreviation": "Upgrade SW/FW",
    "category": "Diagnostic & Component Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "U2W",
    "abbreviation": "Upgrade HW",
    "category": "Diagnostic & Component Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "U2X",
    "abbreviation": "PM",
    "category": "Diagnostic & Component Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "U2Y",
    "abbreviation": "BS",
    "category": "Diagnostic & Component Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "U2Z",
    "abbreviation": "RM",
    "category": "Diagnostic & Component Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "U31",
    "abbreviation": "Other service",
    "category": "Diagnostic & Component Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "U32",
    "abbreviation": "Get the log file & check",
    "category": "Diagnostic & Component Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "U33",
    "abbreviation": "customer fault",
    "category": "Diagnostic & Component Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "U34",
    "abbreviation": "No Technical support",
    "category": "Diagnostic & Component Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "U35",
    "abbreviation": "Instruction",
    "category": "Diagnostic & Component Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "U36",
    "abbreviation": "Clean and Lubricate",
    "category": "Diagnostic & Component Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "U37",
    "abbreviation": "System setting change",
    "category": "Diagnostic & Component Replacement",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W01",
    "abbreviation": "Repair/Change Accessories",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W02",
    "abbreviation": "Add Accessories",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W03",
    "abbreviation": "Charge Battery",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W04",
    "abbreviation": "Bios setting/upgrade",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W05",
    "abbreviation": "Board Repair",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W06",
    "abbreviation": "Additional installation core(noise)",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W07",
    "abbreviation": "Data Backup/Restore",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W08",
    "abbreviation": "delete/re-install driver",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W09",
    "abbreviation": "Main S/W Upgrade / Downgrade",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W10",
    "abbreviation": "Module Cleaning",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W11",
    "abbreviation": "Repair Module",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W12",
    "abbreviation": "Re-connect Module",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W13",
    "abbreviation": "Replace Monitor",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W14",
    "abbreviation": "Adjustment monitor setting",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W15",
    "abbreviation": "Repair monitor",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W16",
    "abbreviation": "Add/cancel option",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W17",
    "abbreviation": "PM",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W18",
    "abbreviation": "delete printer paper",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W19",
    "abbreviation": "Replace printer",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W20",
    "abbreviation": "Adjustment printer setting",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W21",
    "abbreviation": "Repair printer",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W22",
    "abbreviation": "Probe Change",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W23",
    "abbreviation": "Probe Cleaning",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W24",
    "abbreviation": "Probe Repair",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W25",
    "abbreviation": "Probe Taping",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W26",
    "abbreviation": "System Check (NDF)",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W27",
    "abbreviation": "System Check (No failure)",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W28",
    "abbreviation": "System Cleaning",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W29",
    "abbreviation": "System Cleaning(customer request)",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W30",
    "abbreviation": "System Move",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W31",
    "abbreviation": "System Repair",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W32",
    "abbreviation": "System Setting(H/W)",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W33",
    "abbreviation": "Decomposition/Assembly system",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W34",
    "abbreviation": "Replace Touch panel",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W35",
    "abbreviation": "Adjustment Touch Panel",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W36",
    "abbreviation": "Replace item cause of customer fault",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W37",
    "abbreviation": "Change customer use environment",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W38",
    "abbreviation": "Guidance for function & performance",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W39",
    "abbreviation": "Adjust other merchandise setting",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W40",
    "abbreviation": "other service",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W41",
    "abbreviation": "Re-conncect internal cable",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W42",
    "abbreviation": "Replace internal cable",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W43",
    "abbreviation": "Repair internal cable",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W44",
    "abbreviation": "cost consultation",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W45",
    "abbreviation": "Re-conncect external cable",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W46",
    "abbreviation": "Replace external cable",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W47",
    "abbreviation": "Repair external cable",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W48",
    "abbreviation": "remote service",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W49",
    "abbreviation": "test system service",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W50",
    "abbreviation": "Replace HDD",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W51",
    "abbreviation": "Replace Power",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W52",
    "abbreviation": "Repair Power",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W53",
    "abbreviation": "Replace ODD",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W54",
    "abbreviation": "Repair ODD",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W55",
    "abbreviation": "Repair cancel",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W57",
    "abbreviation": "Replace Board",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W58",
    "abbreviation": "Re-connect Board",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W59",
    "abbreviation": "Replace Module",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W60",
    "abbreviation": "Network Setting",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W61",
    "abbreviation": "System Change",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W62",
    "abbreviation": "Guidance for customer use",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W63",
    "abbreviation": "Replace other Electric",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W64",
    "abbreviation": "Adjustment other S/W setting",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W65",
    "abbreviation": "Change/Replace other product",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W66",
    "abbreviation": "Adjustment other product",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "W67",
    "abbreviation": "Transfer service",
    "category": "Module, Cable & Peripheral",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "X01",
    "abbreviation": "No fault found",
    "category": "NDF, Exchange & Returns",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "X02",
    "abbreviation": "Connected equipment problem",
    "category": "NDF, Exchange & Returns",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "X03",
    "abbreviation": "Telecom carrier problem",
    "category": "NDF, Exchange & Returns",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "X04",
    "abbreviation": "Set exchange",
    "category": "NDF, Exchange & Returns",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "X05",
    "abbreviation": "Refund",
    "category": "NDF, Exchange & Returns",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "X06",
    "abbreviation": "Lubrication",
    "category": "NDF, Exchange & Returns",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "X07",
    "abbreviation": "Re-charging",
    "category": "NDF, Exchange & Returns",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "X08",
    "abbreviation": "Painting",
    "category": "NDF, Exchange & Returns",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "X09",
    "abbreviation": "Repair refusal",
    "category": "NDF, Exchange & Returns",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "X10",
    "abbreviation": "B/S(Before Service)",
    "category": "NDF, Exchange & Returns",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "X11",
    "abbreviation": "Software upgrade",
    "category": "NDF, Exchange & Returns",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "X12",
    "abbreviation": "Functional check",
    "category": "NDF, Exchange & Returns",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "X13",
    "abbreviation": "Refund",
    "category": "NDF, Exchange & Returns",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "X14",
    "abbreviation": "S/W Setting",
    "category": "NDF, Exchange & Returns",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "X15",
    "abbreviation": "Service Transfer",
    "category": "NDF, Exchange & Returns",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "X16",
    "abbreviation": "System Change",
    "category": "NDF, Exchange & Returns",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "X17",
    "abbreviation": "General Service",
    "category": "NDF, Exchange & Returns",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "X18",
    "abbreviation": "Repair of Resale",
    "category": "NDF, Exchange & Returns",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "X99",
    "abbreviation": "Other repair",
    "category": "NDF, Exchange & Returns",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "XRD",
    "abbreviation": "RETURN BY DARK DOT",
    "category": "NDF, Exchange & Returns",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "XRN",
    "abbreviation": "REJECT BY NONE DEFAULT",
    "category": "NDF, Exchange & Returns",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "XRP",
    "abbreviation": "RETURN BY QUALITY",
    "category": "NDF, Exchange & Returns",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "XRR",
    "abbreviation": "RETURN BY NONE QUALITY",
    "category": "NDF, Exchange & Returns",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "XRT",
    "abbreviation": "REJECT OF RETURN",
    "category": "NDF, Exchange & Returns",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Y11",
    "abbreviation": "Exchange due to DNA",
    "category": "DNA & Non-Delivery Exchange",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Y12",
    "abbreviation": "Refund due to DNA",
    "category": "DNA & Non-Delivery Exchange",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Y21",
    "abbreviation": "Exchange due to no longer delivery",
    "category": "DNA & Non-Delivery Exchange",
    "context": "GD/FDR Closer Repair Code"
  },
  {
    "code": "Y22",
    "abbreviation": "Refund due to no longer delivery",
    "category": "DNA & Non-Delivery Exchange",
    "context": "GD/FDR Closer Repair Code"
  }
];

  const REPAIR_CODE_MAP = {
  "A01": "Electrical parts replacement",
  "A02": "Mechanical parts replacement",
  "A03": "Cosmetic parts replacement",
  "A04": "PCB replacement",
  "A05": "CRT replacement",
  "A06": "Consumables replacement",
  "A07": "Parts addition",
  "A08": "Parts removal",
  "A09": "UB part replacement",
  "A10": "Change LCD",
  "A11": "Change outcase",
  "A12": "Change handset",
  "A13": "Add refrigerant",
  "A14": "Reduce refrigerant",
  "A15": "Compressor replacement",
  "A16": "Motor replacement",
  "A17": "Sensor replacement",
  "A18": "Fan/Blower replacement",
  "A19": "Filter replacement",
  "A20": "Accessory replacement",
  "A46": "Cosmetic replacement(customer request)",
  "A65": "Other Replacement",
  "A66": "Module Replacement",
  "A67": "Other replacement by dealer",
  "B01": "Soldering",
  "B02": "Welding",
  "B03": "Sealed System Repair with Gas Pressure",
  "C01": "Degaussing",
  "C02": "CRT adjustment",
  "C03": "FBT adjustment",
  "C04": "User mode adjustment",
  "C05": "Factory mode adjustment",
  "C06": "External controller adjustment",
  "C07": "Anntena adjustment",
  "C08": "External cable adjustment",
  "C09": "Other electrical adjustment",
  "C10": "Deck alignment",
  "C11": "Tape path alignment",
  "C12": "Leg alignment",
  "C13": "Wire alignment",
  "C14": "Cosmetic adjustment",
  "C15": "Internal machine wire adjustment",
  "C96": "Image Setting",
  "C97": "Network Setting",
  "C98": "Re-connection",
  "C99": "Other mechanical adjustment",
  "D01": "Head cleaning",
  "D02": "Deck cleaning",
  "D03": "Pickup cleaning",
  "D04": "Cosmetic cleaning",
  "D05": "Foreign material removal",
  "D06": "Drain hose cleaning",
  "D07": "Inlet filter cleaning",
  "D08": "Magic / lint / debris filter cleaning",
  "D09": "Drain valve cleaning",
  "D10": "Spin tub foreign material remove",
  "D11": "Drain filter cleaning",
  "D99": "Other cleaning",
  "E01": "Initial installation",
  "E02": "Re-installation",
  "E03": "S/W Re-installation",
  "F01": "PCB re-assembling",
  "F02": "Mechanical re-assembling",
  "F03": "Cosmetic re-assembling",
  "F17": "Other Re-assembling",
  "G01": "Customer Education / Explanation",
  "G02": "Dissatisfaction about Emotional Quality",
  "H01": "Firmware upgrade",
  "H02": "Application program modification",
  "H03": "Driver installation",
  "H04": "Data recovery",
  "H05": "Reformat",
  "H06": "Unlock",
  "H07": "Preventive Software Update",
  "M01": "PCB replacement",
  "M02": "Pick-up replacement",
  "M03": "FPC Harness replacement",
  "M04": "Motor replacement",
  "M05": "Tray disc replacement",
  "M06": "Deck Ass'y repair/replacement",
  "M07": "Housing replacement",
  "M08": "Mechanical repair",
  "M09": "Adjustment",
  "M10": "Cleaning",
  "M11": "Re-assemble",
  "M12": "Scrap",
  "M13": "Test OK",
  "M14": "Re-soldering",
  "M15": "PCB Front replacement",
  "M16": "Spindle Motor replacement",
  "M17": "Loading Motor replacement",
  "M18": "Stepping Motor replacement",
  "M19": "Door tray replacement",
  "M20": "Panel Front replacement",
  "M21": "Spindle Motor Drive IC replacement",
  "M22": "Loading Motor Drive IC replacement",
  "M99": "Other repair",
  "PD": "Site Compensation",
  "Q01": "Accs_Repair/Change Accessories",
  "Q02": "Boad_Replace Board",
  "Q03": "Boad_Board Repair",
  "Q04": "Boad_Re-connect Board",
  "Q05": "Cble_Replace system cable",
  "Q06": "Cble_Re-conncect system cable",
  "Q07": "Cble_external cable problem",
  "Q08": "Hard_Replace HDD",
  "Q09": "Hous_Replace housing&mechanical",
  "Q0A": "Keys_Replace alphakey",
  "Q0B": "MNT_Replace Monitor",
  "Q0C": "MNT_Adjustment monitor setting",
  "Q0D": "MNT_Repair monitor",
  "Q0E": "ODD_Replace ODD",
  "Q0F": "Opti_Add/cancel option",
  "Q0G": "PC_Replace PC",
  "Q0H": "PC_Repair PC",
  "Q0I": "PC_Re-connect PC",
  "Q0J": "Peri_Replace peripheral",
  "Q0K": "Peri_Adjust/Repair other peripheral",
  "Q0L": "PWR_Replace Power",
  "Q0M": "PWR_Repair Power",
  "Q0N": "Prevent_B/S(Before Service)",
  "Q0O": "Prevent_Preventive Maintence",
  "Q0P": "Prob_Probe Change",
  "Q0Q": "Prob_Probe Repair",
  "Q0R": "Prob_Probe ETC Repair",
  "Q0S": "S/W_S/W RE-INSTALLATION or Upgrade",
  "Q0T": "Sett_Dicom/Network setting",
  "Q0U": "Sett_Image or S/W SETTING",
  "Q0V": "SVC_Demo product service",
  "Q0W": "SVC_Additional installation core(noise)",
  "Q0X": "SVC_other service",
  "Q0Y": "SVC_Data Backup/Restore",
  "Q0Z": "SVC_cost consultation",
  "Q11": "SVC_Transfer service",
  "Q12": "SVC_Repair cancel",
  "Q13": "SVC_System Check (No failure) or Move",
  "Q14": "SVC_remote service",
  "Q15": "SVC_phone consultation",
  "Q16": "Sys_System Change",
  "Q17": "Sys_Decomposition/Assembly system",
  "Q18": "Sys_System Repair",
  "Q19": "Sys_System Check (NDF)",
  "Q1A": "Sys_Electrical parts replacement",
  "Q1B": "T/B_Repalce trackball",
  "Q1C": "T/B_Clean trackball",
  "Q1D": "Touch_Replace Touch panel",
  "Q1E": "Touch_Calibration Touch Panel",
  "Q1F": "User_Customer Education / Explanation",
  "Q1G": "User_customer fault",
  "Q21": "Q21-Prob_Reconnect Probe",
  "Q22": "Q22-Peri_Supply Peripheral Goods",
  "Q23": "Q23-Keys_Fix Alphakey",
  "Q24": "Q24-SVC_Computational Processing",
  "Q25": "Q25-SVC_Service(order) parts defect",
  "Q5S": "Q5S-System/Probe Install",
  "Q5T": "Q5T-System Move",
  "Q5U": "Q5U-SW Upgrade",
  "Q81": "Q81-Replacement of components",
  "Q82": "Q82-Calibration",
  "Q83": "Q83-SW/FW",
  "Q84": "Q84-Adjustment(SW)",
  "Q85": "Q85-Adjustment(HW)",
  "Q86": "Q86-Get Log/Image file",
  "Q87": "Q87-Installation SW/FW",
  "Q88": "Q88-Reconnection",
  "Q89": "Q89-Monitoring",
  "Q8A": "Q8A-Explanation for usage",
  "Q8B": "Q8B-Replacement of Loaner",
  "Q8C": "Q8C-Inventory handling",
  "Q8D": "Q8D-Move installation place",
  "Q8E": "Q8E-System setting",
  "Q8F": "Q8F-No technical support",
  "Q8G": "Q8G-Customer fault",
  "Q8H": "Q8H-Transfer service(Third-party system)",
  "Q8I": "Q8I-Repair of components",
  "Q8J": "Q8J-Sales option",
  "Q8K": "Q8K-External influence",
  "Q8L": "Q8L-Customer request",
  "Q8M": "Q8M-Engineer fault",
  "Q8N": "Q8N-Installation SW/FW",
  "Q91": "Q91-Customer fault (Reagent/Cartridge)",
  "Q92": "Q92-Cartridge Performance Issue",
  "Q93": "Q93-CartridgeOutward(Print/Attach/Scratc",
  "Q94": "Q94-Specimen (Hemolysis/Interference)",
  "Q95": "Q95-other service (Reagent/Cartridge)",
  "Q96": "Q96-Req.SpecimenInquiry(Reagent/Cartridg",
  "Q9A": "Q9A-External Ground connection",
  "Q9B": "Q9B-Detector Alignment",
  "Q9C": "Q9C-Set calibration",
  "Q9D": "Q9D-Manufacturer Instrument Factor Calib",
  "Q9E": "Q9E-Dust removal",
  "R24": "Replacement, assy",
  "R25": "Replacement, mechanical parts",
  "R26": "Replacement, electrical parts",
  "R27": "Replacement, cover",
  "R28": "Replacement, PBA",
  "R29": "Replacement, cable",
  "R2A": "Replacement, tube",
  "R2B": "Replacement, detector",
  "R2C": "Replacement, fan",
  "R2D": "Replacement, battery",
  "R2E": "Replacement, LCD",
  "R2F": "Replacement, sensor",
  "R2G": "Repair assy",
  "R2H": "Repair mechanical parts",
  "R2I": "Repair electrical parts",
  "R2J": "Repair cover",
  "R2K": "Repair PBA",
  "R2L": "Repair cable",
  "R2M": "Repair other",
  "R2N": "Reconnection",
  "R2O": "Adjustment(HW)",
  "R2P": "Adjustment(SW)",
  "R2Q": "Calibration",
  "R2R": "Reinstallation / Recovery SW, FW",
  "R2S": "Get the log file & check",
  "R2T": "Upgrade SW/FW(remedy)",
  "R2U": "Upgrade SW/FW",
  "R2V": "Upgrade HW",
  "R2W": "PM",
  "R2X": "BS",
  "R2Y": "RM",
  "R2Z": "Other service",
  "R31": "External influence",
  "R32": "Customer fault",
  "R33": "No technical support",
  "R34": "Instruction",
  "R35": "Clean and Lubricate",
  "R36": "System setting change",
  "RD": "RETURN BY DARK DOT",
  "RN": "REJECT BY NONE DEFAULT",
  "RP": "Return by Quality Reason",
  "RR": "Return by None Quality Reason",
  "RT": "Reject of Return",
  "SW1": "Firmware Upgrade",
  "SW2": "Application Upgrade",
  "SW3": "S/W Upgrade( H/W Defect )",
  "SW4": "S/W Upgrade( External Factor )",
  "SW5": "Application Installation",
  "SW6": "Driver Installation",
  "SW7": "Resetting",
  "U1W": "Revisit required",
  "U1X": "Replace Fluidic part",
  "U1Y": "Replace analyzer",
  "U1Z": "Replace Assistance",
  "U21": "Rerun with New Reagent",
  "U22": "Rerun same Sample, QC",
  "U23": "Rerun New Sample, QC",
  "U24": "Change enviroment",
  "U25": "Change consumable",
  "U26": "Document",
  "U27": "Replace accessary",
  "U28": "Training",
  "U29": "Replacement, assy",
  "U2A": "Replacement, mechanical parts",
  "U2B": "Replacement, electrical parts",
  "U2C": "Replacement, cover",
  "U2D": "Replacement, PBA",
  "U2E": "Replacement, cable",
  "U2F": "Replacement, Fan",
  "U2G": "Replacement, LCD",
  "U2H": "Replacement, Sensor",
  "U2I": "Repair assy",
  "U2J": "Repair mechanical parts",
  "U2K": "Repair electrical parts",
  "U2L": "Repair cover",
  "U2M": "Repair PBA",
  "U2N": "Repair cable",
  "U2O": "Repair other",
  "U2P": "Reconnection",
  "U2Q": "Adjustment(HW)",
  "U2R": "Adjustment(SW)",
  "U2S": "Calibration",
  "U2T": "Reinstallation / Recovery SW, FW",
  "U2U": "Upgrade SW/FW(remedy)",
  "U2V": "Upgrade SW/FW",
  "U2W": "Upgrade HW",
  "U2X": "PM",
  "U2Y": "BS",
  "U2Z": "RM",
  "U31": "Other service",
  "U32": "Get the log file & check",
  "U33": "customer fault",
  "U34": "No Technical support",
  "U35": "Instruction",
  "U36": "Clean and Lubricate",
  "U37": "System setting change",
  "W01": "Repair/Change Accessories",
  "W02": "Add Accessories",
  "W03": "Charge Battery",
  "W04": "Bios setting/upgrade",
  "W05": "Board Repair",
  "W06": "Additional installation core(noise)",
  "W07": "Data Backup/Restore",
  "W08": "delete/re-install driver",
  "W09": "Main S/W Upgrade / Downgrade",
  "W10": "Module Cleaning",
  "W11": "Repair Module",
  "W12": "Re-connect Module",
  "W13": "Replace Monitor",
  "W14": "Adjustment monitor setting",
  "W15": "Repair monitor",
  "W16": "Add/cancel option",
  "W17": "PM",
  "W18": "delete printer paper",
  "W19": "Replace printer",
  "W20": "Adjustment printer setting",
  "W21": "Repair printer",
  "W22": "Probe Change",
  "W23": "Probe Cleaning",
  "W24": "Probe Repair",
  "W25": "Probe Taping",
  "W26": "System Check (NDF)",
  "W27": "System Check (No failure)",
  "W28": "System Cleaning",
  "W29": "System Cleaning(customer request)",
  "W30": "System Move",
  "W31": "System Repair",
  "W32": "System Setting(H/W)",
  "W33": "Decomposition/Assembly system",
  "W34": "Replace Touch panel",
  "W35": "Adjustment Touch Panel",
  "W36": "Replace item cause of customer fault",
  "W37": "Change customer use environment",
  "W38": "Guidance for function & performance",
  "W39": "Adjust other merchandise setting",
  "W40": "other service",
  "W41": "Re-conncect internal cable",
  "W42": "Replace internal cable",
  "W43": "Repair internal cable",
  "W44": "cost consultation",
  "W45": "Re-conncect external cable",
  "W46": "Replace external cable",
  "W47": "Repair external cable",
  "W48": "remote service",
  "W49": "test system service",
  "W50": "Replace HDD",
  "W51": "Replace Power",
  "W52": "Repair Power",
  "W53": "Replace ODD",
  "W54": "Repair ODD",
  "W55": "Repair cancel",
  "W57": "Replace Board",
  "W58": "Re-connect Board",
  "W59": "Replace Module",
  "W60": "Network Setting",
  "W61": "System Change",
  "W62": "Guidance for customer use",
  "W63": "Replace other Electric",
  "W64": "Adjustment other S/W setting",
  "W65": "Change/Replace other product",
  "W66": "Adjustment other product",
  "W67": "Transfer service",
  "X01": "No fault found",
  "X02": "Connected equipment problem",
  "X03": "Telecom carrier problem",
  "X04": "Set exchange",
  "X05": "Refund",
  "X06": "Lubrication",
  "X07": "Re-charging",
  "X08": "Painting",
  "X09": "Repair refusal",
  "X10": "B/S(Before Service)",
  "X11": "Software upgrade",
  "X12": "Functional check",
  "X13": "Refund",
  "X14": "S/W Setting",
  "X15": "Service Transfer",
  "X16": "System Change",
  "X17": "General Service",
  "X18": "Repair of Resale",
  "X99": "Other repair",
  "XRD": "RETURN BY DARK DOT",
  "XRN": "REJECT BY NONE DEFAULT",
  "XRP": "RETURN BY QUALITY",
  "XRR": "RETURN BY NONE QUALITY",
  "XRT": "REJECT OF RETURN",
  "Y11": "Exchange due to DNA",
  "Y12": "Refund due to DNA",
  "Y21": "Exchange due to no longer delivery",
  "Y22": "Refund due to no longer delivery"
};

  // ═════════════════════════════════════════════════════════════════════════
  // 5. API & HELPER METHODS
  // ═════════════════════════════════════════════════════════════════════════
  const contextApi = {
    BRANCHES: BRANCHES,
    ZONES: ZONES,
    REGIONS: REGIONS,
    INDIA_1_NAMES: INDIA_1_NAMES,
    INDIA_2_NAMES: INDIA_2_NAMES,
    REASONS: REASONS,
    SUB_REASONS: SUB_REASONS,
    REASON_TO_SUB_REASONS: REASON_TO_SUB_REASONS,
    SUB_REASON_TO_REASON: SUB_REASON_TO_REASON,
    REPAIR_CODES: REPAIR_CODES,
    REPAIR_CODE_MAP: REPAIR_CODE_MAP,

    getAllRepairCodes() {
      return REPAIR_CODES.map(c => ({ ...c }));
    },

    getRepairCode(code) {
      if (!code) return "";
      const c = String(code).trim().toUpperCase();
      return REPAIR_CODE_MAP[c] || "";
    },

    searchRepairCodes(term) {
      if (!term) return [...REPAIR_CODES];
      const q = String(term).trim().toLowerCase();
      return REPAIR_CODES.filter(item => 
        item.code.toLowerCase().includes(q) || 
        item.abbreviation.toLowerCase().includes(q) ||
        (item.category && item.category.toLowerCase().includes(q))
      );
    },

    /**
     * Get all master reasons list
     */
    getAllReasons() {
      return [...REASONS];
    },

    /**
     * Get all sub-reasons list
     */
    getAllSubReasons() {
      return SUB_REASONS.map(s => ({ ...s }));
    },

    /**
     * Get parent reason for a given sub-reason string
     * @param {string} subReason
     */
    getReasonBySubReason(subReason) {
      if (!subReason) return null;
      const raw = String(subReason).trim();
      if (SUB_REASON_TO_REASON[raw]) return SUB_REASON_TO_REASON[raw];

      const norm = raw.toLowerCase().replace(/''/g, "'").replace(/\s+/g, ' ').trim();
      if (NORMALIZED_SUB_REASON_TO_REASON[norm]) {
        return NORMALIZED_SUB_REASON_TO_REASON[norm];
      }

      // Partial fuzzy search
      for (let i = 0; i < SUB_REASONS.length; i++) {
        const item = SUB_REASONS[i];
        const itemNorm = item.subReason.toLowerCase().replace(/''/g, "'").replace(/\s+/g, ' ');
        if (norm.includes(itemNorm) || itemNorm.includes(norm)) {
          return item.reason;
        }
      }

      return null;
    },

    /**
     * Get sub-reasons array for a given master reason
     * @param {string} reason
     */
    getSubReasonsByReason(reason) {
      if (!reason) return [];
      const clean = String(reason).trim();
      return REASON_TO_SUB_REASONS[clean] ? [...REASON_TO_SUB_REASONS[clean]] : [];
    },

    /**
     * Populate a <select> element with Master Reasons
     */
    populateReasonSelect(selectElementOrId, options = {}) {
      const el = typeof selectElementOrId === 'string'
        ? document.getElementById(selectElementOrId)
        : selectElementOrId;
      if (!el) return;

      const {
        includeAll = false,
        allLabel = 'All Reasons',
        allValue = 'ALL',
        defaultSelected = ''
      } = options;

      el.innerHTML = '';
      if (includeAll) {
        const opt = document.createElement('option');
        opt.value = allValue;
        opt.textContent = allLabel;
        if (defaultSelected === allValue) opt.selected = true;
        el.appendChild(opt);
      }

      REASONS.forEach(r => {
        const opt = document.createElement('option');
        opt.value = r;
        opt.textContent = r;
        if (defaultSelected === r) opt.selected = true;
        el.appendChild(opt);
      });
    },

    /**
     * Populate a <select> element with Sub-Reasons
     */
    populateSubReasonSelect(selectElementOrId, options = {}) {
      const el = typeof selectElementOrId === 'string'
        ? document.getElementById(selectElementOrId)
        : selectElementOrId;
      if (!el) return;

      const {
        filterByReason = null,
        includeAll = false,
        allLabel = 'All Sub-Reasons',
        allValue = 'ALL',
        defaultSelected = '',
        showReasonInLabel = false
      } = options;

      el.innerHTML = '';
      if (includeAll) {
        const opt = document.createElement('option');
        opt.value = allValue;
        opt.textContent = allLabel;
        if (defaultSelected === allValue) opt.selected = true;
        el.appendChild(opt);
      }

      const list = filterByReason
        ? SUB_REASONS.filter(s => s.reason === filterByReason)
        : SUB_REASONS;

      list.forEach(item => {
        const opt = document.createElement('option');
        opt.value = item.subReason;
        opt.textContent = showReasonInLabel ? `${item.subReason} [${item.reason}]` : item.subReason;
        opt.dataset.reason = item.reason;
        if (defaultSelected === item.subReason) opt.selected = true;
        el.appendChild(opt);
      });
    },

    /**
     * Get all active branches (copy)
     */
    getAllBranches() {
      return BRANCHES.map(b => ({ ...b }));
    },

    /**
     * Get branch names list
     */
    getBranchNames() {
      return BRANCHES.map(b => b.name);
    },

    /**
     * Get branch by name or alias
     * @param {string} name
     */
    getBranchByName(name) {
      if (!name) return null;
      const key = String(name).toLowerCase().trim();
      return ALIAS_TO_BRANCH[key] || NAME_TO_BRANCH[key] || null;
    },

    /**
     * Get branch by code
     * @param {string} code
     */
    getBranchByCode(code) {
      if (!code) return null;
      const clean = String(code).trim();
      return CODE_TO_BRANCH[clean] || null;
    },

    /**
     * Get branches by zone ('India-1' or 'India-2')
     */
    getBranchesByZone(zone) {
      if (!zone) return [];
      const clean = String(zone).toLowerCase().trim();
      return BRANCHES.filter(b => b.zone.toLowerCase() === clean);
    },

    /**
     * Get branches by region ('North 1', 'West 2', 'South 2')
     */
    getBranchesByRegion(region) {
      if (!region) return [];
      const clean = String(region).toLowerCase().trim();
      return BRANCHES.filter(b => b.region.toLowerCase() === clean);
    },

    /**
     * Get MSC Code by branch name or alias. Falls back to default '9225951' (Gurgaon)
     * @param {string} branchName
     */
    getMscCode(branchName) {
      if (!branchName) return '9225951';
      const b = this.getBranchByName(branchName);
      if (b) return b.code;

      const lower = String(branchName).toLowerCase().trim();
      if (lower.includes('ghaziabad')) return '4915414';
      if (lower.includes('ahmedabad') || lower.includes('ahmdabad')) return '4917449';
      if (lower.includes('surat')) return '4936933';
      if (lower.includes('gandhinagar')) return '6451772';
      if (lower.includes('cochin') || lower.includes('kochi') || lower.includes('ernakulam')) return '6458704';
      if (lower.includes('lucknow') && lower.includes('hhp')) return '3871175';
      if (lower.includes('lucknow')) return '8200354';
      if (lower.includes('moradabad')) return '4776004';
      if (lower.includes('gurgaon') || lower.includes('gurugram')) return '9225951';

      return '9225951';
    },

    /**
     * Get canonical MSC Name by branch code
     * @param {string} code
     */
    getMscName(code) {
      if (!code) return 'Gurgaon';
      const b = this.getBranchByCode(code);
      return b ? b.name : 'Gurgaon';
    },

    /**
     * Build standard key-value map of { BranchName: BranchCode }
     * Including both canonical names and common "-CE" aliases for backward compatibility.
     */
    getBranchMap() {
      const map = {};
      BRANCHES.forEach(b => {
        map[b.name] = b.code;
        map[`${b.name}-CE`] = b.code;
        b.aliases.forEach(a => {
          map[a] = b.code;
        });
      });
      return map;
    },

    /**
     * Detect branch from raw text (city, address, branch column, or code)
     * @param {string} text
     * @param {string} fallbackName
     */
    detectBranch(text, fallbackName = 'Gurgaon') {
      if (!text) return this.getBranchByName(fallbackName) || BRANCHES[6];
      const s = String(text).toUpperCase().trim();

      // Check direct code match
      for (let i = 0; i < BRANCHES.length; i++) {
        if (s.includes(BRANCHES[i].code)) {
          return BRANCHES[i];
        }
      }

      // Check aliases
      if (s.includes('MORADABAD')) return this.getBranchByName('Moradabad-HHP');
      if (s.includes('LUCKNOW') && s.includes('HHP')) return this.getBranchByName('Lucknow-HHP');
      if (s.includes('LUCKNOW')) return this.getBranchByName('Lucknow');
      if (s.includes('GHAZIABAD')) return this.getBranchByName('Ghaziabad');
      if (s.includes('AHMEDABAD') || s.includes('AHMDABAD')) return this.getBranchByName('Ahmedabad');
      if (s.includes('SURAT')) return this.getBranchByName('Surat');
      if (s.includes('GANDHINAGAR')) return this.getBranchByName('Gandhinagar');
      if (s.includes('COCHIN') || s.includes('KOCHI') || s.includes('ERNAKULAM')) return this.getBranchByName('Cochin');
      if (s.includes('GURGAON') || s.includes('GURUGRAM')) return this.getBranchByName('Gurgaon');

      return this.getBranchByName(fallbackName) || BRANCHES[6];
    },

    /**
     * Populate an HTML <select> element with branches from this context
     * @param {HTMLSelectElement|string} selectElementOrId
     * @param {Object} options
     *   - includeAll: boolean (adds 'ALL' option)
     *   - allLabel: string (default: 'All Branches')
     *   - defaultSelected: string (branch name or code to mark selected)
     *   - valueType: 'name' | 'code' (what to put in option.value, default 'name')
     *   - showCodeInLabel: boolean (default true, e.g. "Ghaziabad (4915414)")
     *   - customOption: boolean (adds "Custom / Other..." option)
     */
    populateSelect(selectElementOrId, options = {}) {
      const el = typeof selectElementOrId === 'string'
        ? document.getElementById(selectElementOrId)
        : selectElementOrId;
      if (!el) return;

      const {
        includeAll = false,
        allLabel = 'All Branches',
        allValue = 'ALL',
        defaultSelected = 'Gurgaon',
        valueType = 'name',
        showCodeInLabel = true,
        customOption = false
      } = options;

      el.innerHTML = '';

      if (includeAll) {
        const allOpt = document.createElement('option');
        allOpt.value = allValue;
        allOpt.textContent = allLabel;
        if (defaultSelected === allValue) allOpt.selected = true;
        el.appendChild(allOpt);
      }

      BRANCHES.forEach(b => {
        const opt = document.createElement('option');
        opt.value = valueType === 'code' ? b.code : b.name;
        opt.textContent = showCodeInLabel ? `${b.name} (${b.code})` : b.name;
        opt.dataset.code = b.code;
        opt.dataset.name = b.name;
        opt.dataset.zone = b.zone;
        opt.dataset.region = b.region;
        if (
          b.name === defaultSelected ||
          b.code === defaultSelected ||
          b.aliases.includes(defaultSelected)
        ) {
          opt.selected = true;
        }
        el.appendChild(opt);
      });

      if (customOption) {
        const custOpt = document.createElement('option');
        custOpt.value = 'Custom';
        custOpt.textContent = 'Custom / Other...';
        if (defaultSelected === 'Custom') custOpt.selected = true;
        el.appendChild(custOpt);
      }
    },

    /**
     * Async fetch of context.json or /api/context
     */
    async loadContextJson() {
      try {
        const res = await fetch('/context.json');
        if (res.ok) {
          return await res.json();
        }
      } catch (e) {
        console.warn('Failed to fetch /context.json, falling back to /api/context or in-memory context', e);
      }
      try {
        const resApi = await fetch('/api/context');
        if (resApi.ok) {
          return await resApi.json();
        }
      } catch (e) {
        // Fallback to in-memory representation
      }
      return {
        branches: BRANCHES,
        zones: ZONES,
        regions: REGIONS,
        reasons: REASONS,
        subReasons: SUB_REASONS,
        reasonToSubReasons: REASON_TO_SUB_REASONS,
        subReasonToReason: SUB_REASON_TO_REASON
      };
    }
  };

  return contextApi;
});
