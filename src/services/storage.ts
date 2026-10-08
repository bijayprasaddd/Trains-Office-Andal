import {
  AppDatabase,
  MixLoadEntry,
  CYMUnloadingEntry,
  TranshipmentEntry,
  PCMLDiversionEntry,
  SickRepairEntry,
  UserSession,
  FileAttachment
} from '../types/railway';

const DB_STORAGE_KEY = 'trains_office_andal_db_v1';
const USER_STORAGE_KEY = 'trains_office_andal_user_v1';

// Helper to generate sample preview data URLs for BPC and Railway Memos
export function createMockRailwayDocument(title: string, subtitle: string, docNo: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="850" viewBox="0 0 600 850">
    <rect width="600" height="850" fill="#fdfbf7" stroke="#2c3e50" stroke-width="2"/>
    <rect x="15" y="15" width="570" height="820" fill="none" stroke="#b08d57" stroke-width="1.5" stroke-dasharray="4 2"/>
    
    <!-- Header -->
    <text x="300" y="55" font-family="serif" font-size="18" font-weight="bold" fill="#0B3056" text-anchor="middle">EASTERN RAILWAY - ASANSOL DIVISION</text>
    <text x="300" y="80" font-family="sans-serif" font-size="14" font-weight="bold" fill="#7a1c1c" text-anchor="middle">TRAINS BRANCH OFFICE / ANDAL (UDL)</text>
    <text x="300" y="105" font-family="sans-serif" font-size="16" font-weight="bold" fill="#111827" text-anchor="middle">${title.toUpperCase()}</text>
    <line x1="40" y1="120" x2="560" y2="120" stroke="#0B3056" stroke-width="1.5"/>
    
    <!-- Meta details -->
    <text x="50" y="150" font-family="monospace" font-size="12" fill="#374151">DOC REF NO: ${docNo}</text>
    <text x="400" y="150" font-family="monospace" font-size="12" fill="#374151">DATE: 2026-10-08</text>
    <text x="50" y="175" font-family="monospace" font-size="12" fill="#374151">SUBJECT: ${subtitle}</text>
    <text x="400" y="175" font-family="monospace" font-size="12" fill="#374151">DEPOT: UDL MARSHALLING YARD</text>

    <!-- Table Header -->
    <rect x="40" y="210" width="520" height="30" fill="#0B3056"/>
    <text x="60" y="230" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">SR</text>
    <text x="120" y="230" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">OWNING RLY</text>
    <text x="230" y="230" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">WAGON TYPE</text>
    <text x="360" y="230" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">WAGON NO</text>
    <text x="480" y="230" font-family="sans-serif" font-size="11" font-weight="bold" fill="#ffffff">STATUS</text>

    <!-- Rows -->
    <rect x="40" y="240" width="520" height="30" fill="#f8fafc" stroke="#e2e8f0"/>
    <text x="60" y="260" font-family="monospace" font-size="11" fill="#1e293b">01</text>
    <text x="120" y="260" font-family="monospace" font-size="11" fill="#1e293b">ER</text>
    <text x="230" y="260" font-family="monospace" font-size="11" fill="#1e293b">BOXNHL</text>
    <text x="360" y="260" font-family="monospace" font-size="11" fill="#1e293b">22071839201</text>
    <text x="480" y="260" font-family="monospace" font-size="11" fill="#15803d">FIT / VERIFIED</text>

    <rect x="40" y="270" width="520" height="30" fill="#ffffff" stroke="#e2e8f0"/>
    <text x="60" y="290" font-family="monospace" font-size="11" fill="#1e293b">02</text>
    <text x="120" y="290" font-family="monospace" font-size="11" fill="#1e293b">SER</text>
    <text x="230" y="290" font-family="monospace" font-size="11" fill="#1e293b">BCNHL</text>
    <text x="360" y="290" font-family="monospace" font-size="11" fill="#1e293b">21122045981</text>
    <text x="480" y="290" font-family="monospace" font-size="11" fill="#15803d">FIT / VERIFIED</text>

    <rect x="40" y="300" width="520" height="30" fill="#f8fafc" stroke="#e2e8f0"/>
    <text x="60" y="320" font-family="monospace" font-size="11" fill="#1e293b">03</text>
    <text x="120" y="320" font-family="monospace" font-size="11" fill="#1e293b">ECR</text>
    <text x="230" y="320" font-family="monospace" font-size="11" fill="#1e293b">BOBRN</text>
    <text x="360" y="320" font-family="monospace" font-size="11" fill="#1e293b">24031958210</text>
    <text x="480" y="320" font-family="monospace" font-size="11" fill="#15803d">FIT / VERIFIED</text>

    <!-- Inspection and Signatures -->
    <rect x="40" y="450" width="520" height="180" fill="#ffffff" stroke="#cbd5e1"/>
    <text x="55" y="475" font-family="sans-serif" font-size="12" font-weight="bold" fill="#0B3056">OPERATIONAL VERIFICATION &amp; CLEARANCE CERTIFICATE</text>
    <text x="55" y="505" font-family="sans-serif" font-size="11" fill="#475569">1. Certified that wagons listed have been physically examined and verified.</text>
    <text x="55" y="525" font-family="sans-serif" font-size="11" fill="#475569">2. Brake pipe pressure verified at 5.0 kg/cm2, engine vacuum/BP continuity clear.</text>
    <text x="55" y="545" font-family="sans-serif" font-size="11" fill="#475569">3. Memo issued for onward transmission under Trains Branch Office jurisdiction.</text>
    <text x="55" y="585" font-family="monospace" font-size="11" fill="#1e293b">BRAKE POWER: 100% (INTACT) | AIR PRESSURE: 5.0 / 4.8 KG/CM2</text>

    <!-- Signatures -->
    <line x1="80" y1="740" x2="220" y2="740" stroke="#64748b" stroke-width="1"/>
    <text x="150" y="760" font-family="sans-serif" font-size="11" font-weight="bold" fill="#1e293b" text-anchor="middle">TXR / C&amp;W INCHARGE</text>
    <text x="150" y="775" font-family="sans-serif" font-size="10" fill="#64748b" text-anchor="middle">UDL Yard Examination</text>

    <line x1="380" y1="740" x2="520" y2="740" stroke="#64748b" stroke-width="1"/>
    <text x="450" y="760" font-family="sans-serif" font-size="11" font-weight="bold" fill="#1e293b" text-anchor="middle">CHIEF YARD MASTER / CYM</text>
    <text x="450" y="775" font-family="sans-serif" font-size="10" fill="#64748b" text-anchor="middle">Trains Office Andal</text>

    <!-- Official Stamp simulation -->
    <circle cx="450" cy="670" r="42" fill="none" stroke="#dc2626" stroke-width="2" stroke-dasharray="3 1"/>
    <text x="450" y="665" font-family="sans-serif" font-size="9" font-weight="bold" fill="#dc2626" text-anchor="middle">TRAINS OFFICE</text>
    <text x="450" y="678" font-family="sans-serif" font-size="9" font-weight="bold" fill="#dc2626" text-anchor="middle">ANDAL (E.RLY)</text>
    <text x="450" y="691" font-family="sans-serif" font-size="8" fill="#dc2626" text-anchor="middle">PASSED</text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Initial realistic dataset for Trains Office Andal
function getInitialData(): AppDatabase {
  const sampleBpcUrl = createMockRailwayDocument('Brake Power Certificate (BPC)', 'Freight Train Brake Examination', 'BPC-UDL-2026/8941');
  const sampleVgUrl = createMockRailwayDocument('Vehicle Guidance (VG) Summary', 'Train Formation & Marshalling Order', 'VG-UDL-OUT-4412');
  const sampleTrafficMemoUrl = createMockRailwayDocument('Traffic Yard Memo', 'Unloading & Detachment Order', 'TM-CYM-UDL-1029');
  const sampleCommMemoUrl = createMockRailwayDocument('Commercial Release Memo', 'Demurrage & Unloading Handover', 'CRM-UDL-5520');
  const sampleDivtMemoUrl = createMockRailwayDocument('Traffic Diversion Request Memo', 'PCML Wagon Rerouting Request', 'DIV-REQ-UDL-331');
  const sampleNrLetterUrl = createMockRailwayDocument('NR Cell Diversion Authorisation', 'North Rerouting Control Letter', 'NR-DIV-ASN-789');
  const sampleFitMemoUrl = createMockRailwayDocument('C&W Sick Line Fit Memo', 'Rolling Stock Fitness Certificate', 'FIT-DSL-UDL-661');

  const mixLoads: MixLoadEntry[] = [
    {
      id: 'ml-1',
      type: 'outgoing',
      year: 2026,
      month: 9,
      date: '2026-09-25',
      loadName: 'UDL-BPC EMPTY MIX',
      engineNo: 'WAG9HC-31456',
      outTime: '04:45',
      destinationOrOrigin: 'BPC (Budge Budge)',
      bpcNo: 'BPC/UDL/BOXN/8941',
      bpcPercentage: 100,
      bpcAttachment: {
        name: 'BPC_UDL_BPC_EMPTY_MIX_25Sep.svg',
        type: 'image',
        url: sampleBpcUrl,
        uploadedAt: '2026-09-25 04:30',
        size: '184 KB'
      },
      vehicleGuidanceAttachment: {
        name: 'VG_UDL_BPC_OUT_25Sep.svg',
        type: 'image',
        url: sampleVgUrl,
        uploadedAt: '2026-09-25 04:35',
        size: '192 KB'
      },
      wagons: [
        { id: 'w-1', owningRailway: 'ER', wagonType: 'BOXNHL', wagonNumber: '22071839201', tareWeight: '20.6 T', carryingCapacity: '68.0 T', commodity: 'Empty' },
        { id: 'w-2', owningRailway: 'SER', wagonType: 'BOXNHL', wagonNumber: '21122045981', tareWeight: '20.5 T', carryingCapacity: '68.0 T', commodity: 'Empty' },
        { id: 'w-3', owningRailway: 'ECR', wagonType: 'BOXN', wagonNumber: '24031958210', tareWeight: '22.4 T', carryingCapacity: '58.8 T', commodity: 'Empty' },
        { id: 'w-4', owningRailway: 'SECR', wagonType: 'BOXNHL', wagonNumber: '23081977342', tareWeight: '20.6 T', carryingCapacity: '68.0 T', commodity: 'Empty' },
        { id: 'w-5', owningRailway: 'NR', wagonType: 'BOXNHL', wagonNumber: '22051933219', tareWeight: '20.5 T', carryingCapacity: '68.0 T', commodity: 'Empty' }
      ],
      trainGuardName: 'R. K. Sharma (UDL)',
      locoPilotName: 'A. K. Ghosh (UDL)',
      remarks: 'Load formed from Andal Up Yard Line 4. Despatched right time towards Budge Budge.',
      createdAt: '2026-09-25T04:45:00Z'
    },
    {
      id: 'ml-2',
      type: 'outgoing',
      year: 2026,
      month: 9,
      date: '2026-09-26',
      loadName: 'UDL-DHN COAL MIX',
      engineNo: 'WAG7-27120',
      outTime: '11:30',
      destinationOrOrigin: 'DHN (Dhanbad)',
      bpcNo: 'BPC/UDL/COAL/8966',
      bpcPercentage: 95,
      bpcAttachment: {
        name: 'BPC_UDL_DHN_26Sep.svg',
        type: 'image',
        url: sampleBpcUrl,
        uploadedAt: '2026-09-26 11:15',
        size: '184 KB'
      },
      vehicleGuidanceAttachment: {
        name: 'VG_UDL_DHN_26Sep.svg',
        type: 'image',
        url: sampleVgUrl,
        uploadedAt: '2026-09-26 11:20',
        size: '192 KB'
      },
      wagons: [
        { id: 'w-6', owningRailway: 'ER', wagonType: 'BOBRN', wagonNumber: '22091944102', tareWeight: '25.6 T', carryingCapacity: '55.6 T', commodity: 'Coal' },
        { id: 'w-7', owningRailway: 'ECR', wagonType: 'BOBRN', wagonNumber: '22081988319', tareWeight: '25.5 T', carryingCapacity: '55.6 T', commodity: 'Coal' },
        { id: 'w-8', owningRailway: 'NCR', wagonType: 'BOXNHL', wagonNumber: '21111933821', tareWeight: '20.6 T', carryingCapacity: '68.0 T', commodity: 'Coal' },
        { id: 'w-9', owningRailway: 'WR', wagonType: 'BOXNHL', wagonNumber: '24041922091', tareWeight: '20.6 T', carryingCapacity: '68.0 T', commodity: 'Coal' }
      ],
      trainGuardName: 'S. Mondal (UDL)',
      locoPilotName: 'D. C. Roy (UDL)',
      remarks: 'Coal rake handed over to Dhanbad division via Andal West Cabin.',
      createdAt: '2026-09-26T11:30:00Z'
    },
    {
      id: 'ml-3',
      type: 'incoming',
      year: 2026,
      month: 10,
      date: '2026-10-02',
      loadName: 'ASN-UDL SHUNT MIX',
      engineNo: 'WAG9-31890',
      outTime: '08:15',
      destinationOrOrigin: 'ASN (Asansol Goods Yard)',
      bpcNo: 'BPC/ASN/MIX/4412',
      bpcPercentage: 90,
      bpcAttachment: {
        name: 'BPC_ASN_UDL_02Oct.svg',
        type: 'image',
        url: sampleBpcUrl,
        uploadedAt: '2026-10-02 08:00',
        size: '184 KB'
      },
      vehicleGuidanceAttachment: {
        name: 'VG_ASN_UDL_02Oct.svg',
        type: 'image',
        url: sampleVgUrl,
        uploadedAt: '2026-10-02 08:05',
        size: '192 KB'
      },
      wagons: [
        { id: 'w-10', owningRailway: 'CR', wagonType: 'BCNHL', wagonNumber: '22011988231', commodity: 'Cement' },
        { id: 'w-11', owningRailway: 'WCR', wagonType: 'BCNHL', wagonNumber: '21101966442', commodity: 'Fertilizer' },
        { id: 'w-12', owningRailway: 'ER', wagonType: 'BRN', wagonNumber: '23021955110', commodity: 'Steel Billets' }
      ],
      remarks: 'Received at Andal Down Yard Line 2 for sorting and piecemeal placement.',
      createdAt: '2026-10-02T08:15:00Z'
    }
  ];

  const cymUnloadings: CYMUnloadingEntry[] = [
    {
      id: 'cym-1',
      year: 2026,
      month: 9,
      date: '2026-09-24',
      wagons: [
        { id: 'cw-1', owningRailway: 'ER', wagonType: 'BOXNHL', wagonNumber: '22061977301' },
        { id: 'cw-2', owningRailway: 'SER', wagonType: 'BOXNHL', wagonNumber: '22081955219' }
      ],
      trafficMemoIssueDate: '2026-09-24',
      trafficMemoNo: 'TM/CYM/UDL/2026/1029',
      trafficMemoAttachment: {
        name: 'Traffic_Memo_1029.svg',
        type: 'image',
        url: sampleTrafficMemoUrl,
        uploadedAt: '2026-09-24 10:00'
      },
      commercialReleaseDate: '2026-09-25',
      commercialMemoNo: 'CRM/UDL/WHARF/5520',
      commercialMemoAttachment: {
        name: 'Comm_Release_5520.svg',
        type: 'image',
        url: sampleCommMemoUrl,
        uploadedAt: '2026-09-25 15:30'
      },
      lineNo: 'Coal Wharf Line No. 03',
      despatchedOutside: true,
      outsideDestination: 'DGR-SAIL (Durgapur Steel Plant)',
      despatchDate: '2026-09-26',
      status: 'Despatched',
      remarks: 'Coal unloading completed at Andal coal siding, empty rakes despatched to DGR-SAIL for back-loading.'
    },
    {
      id: 'cym-2',
      year: 2026,
      month: 10,
      date: '2026-10-03',
      wagons: [
        { id: 'cw-3', owningRailway: 'ECR', wagonType: 'BCNHL', wagonNumber: '21122099302' },
        { id: 'cw-4', owningRailway: 'NR', wagonType: 'BCNHL', wagonNumber: '24051933118' },
        { id: 'cw-5', owningRailway: 'SCR', wagonType: 'BCNHL', wagonNumber: '23091944882' }
      ],
      trafficMemoIssueDate: '2026-10-03',
      trafficMemoNo: 'TM/CYM/UDL/2026/1085',
      trafficMemoAttachment: {
        name: 'Traffic_Memo_1085.svg',
        type: 'image',
        url: sampleTrafficMemoUrl,
        uploadedAt: '2026-10-03 09:15'
      },
      commercialReleaseDate: '2026-10-04',
      commercialMemoNo: 'CRM/UDL/GOODS/5598',
      commercialMemoAttachment: {
        name: 'Comm_Release_5598.svg',
        type: 'image',
        url: sampleCommMemoUrl,
        uploadedAt: '2026-10-04 18:00'
      },
      lineNo: 'Goods Shed Siding Line 01',
      despatchedOutside: false,
      status: 'Released',
      remarks: 'Foodgrain bags unloaded. Wagons released for Andal sorting marshalling.'
    }
  ];

  const transhipments: TranshipmentEntry[] = [
    {
      id: 'ts-1',
      year: 2026,
      month: 9,
      date: '2026-09-23',
      commodity: 'Pig Iron & Cast Billets',
      loadedWagons: [
        { id: 'tw-s1', owningRailway: 'SER', wagonType: 'BOXN', wagonNumber: '22041988301', remarks: 'Sick: Broken journal box & wheel defect' }
      ],
      transhipWagons: [
        { id: 'tw-f1', owningRailway: 'ER', wagonType: 'BOXNHL', wagonNumber: '23061911409', remarks: 'Fit wagon placed at Andal Tranship Bay 2' }
      ],
      trafficMemoIssueDate: '2026-09-23',
      trafficMemoNo: 'TM/TS/UDL/4481',
      trafficMemoAttachment: {
        name: 'Traffic_Memo_TS_4481.svg',
        type: 'image',
        url: sampleTrafficMemoUrl,
        uploadedAt: '2026-09-23 09:00'
      },
      commercialMemoIssueDate: '2026-09-23',
      commercialMemoNo: 'CM/TS/UDL/8821',
      commercialMemoAttachment: {
        name: 'Commercial_Memo_TS_8821.svg',
        type: 'image',
        url: sampleCommMemoUrl,
        uploadedAt: '2026-09-23 10:15'
      },
      contractorOrStaff: 'UDL Goods Handling Contractor / Crane Staff',
      transhipmentLocation: 'Andal Tranship Line 02 (Heavy Crane)',
      status: 'Completed',
      remarks: 'Sick BOXN 22041988301 unloaded safely using 20T yard crane into fit wagon BOXNHL 23061911409.'
    }
  ];

  const pcmlDiversions: PCMLDiversionEntry[] = [
    {
      id: 'pcml-1',
      year: 2026,
      month: 9,
      date: '2026-09-22',
      dateOfDiversion: '2026-09-23',
      wagons: [
        { id: 'pw-1', owningRailway: 'ER', wagonType: 'BCNHL', wagonNumber: '22120938471', commodity: 'Industrial Salt' },
        { id: 'pw-2', owningRailway: 'ECR', wagonType: 'BCNHL', wagonNumber: '21091933481', commodity: 'Industrial Salt' }
      ],
      fromStation: 'KGG (Khagaria / ECR)',
      toStation: 'CBO (Coimbatore / SR)',
      divertedToStation: 'DGR (Durgapur Chemical Siding / ER)',
      trafficDivtRequestMemoNo: 'T-REQ/DIV/UDL/331',
      trafficDivtRequestMemoAttachment: {
        name: 'Traffic_Divt_Req_331.svg',
        type: 'image',
        url: sampleDivtMemoUrl,
        uploadedAt: '2026-09-22 14:00'
      },
      nrCellDivtLetterRef: 'ASN/CNTL/NR-CELL/DIV-789',
      nrCellDivtLetterAttachment: {
        name: 'NR_Cell_Divt_Letter_789.svg',
        type: 'image',
        url: sampleNrLetterUrl,
        uploadedAt: '2026-09-22 17:30'
      },
      reasonForDiversion: 'Piecemeal isolated wagon stranded due to SR route breach; diverted by Divisional Control to nearby DGR industry.',
      authorisedBy: 'Sr. DOM / Asansol (ASN)',
      status: 'Diverted',
      remarks: 'Attached to UDL-DGR pilot load on 23-09-2026.'
    }
  ];

  const sickRepairs: SickRepairEntry[] = [
    {
      id: 'sr-1',
      category: 'down_sick_line',
      year: 2026,
      month: 9,
      date: '2026-09-25',
      wagons: [
        { id: 'rw-1', owningRailway: 'ER', wagonType: 'BOXNHL', wagonNumber: '22031977218' },
        { id: 'rw-2', owningRailway: 'SER', wagonType: 'BOXNHL', wagonNumber: '23081933190' },
        { id: 'rw-3', owningRailway: 'ECR', wagonType: 'BOXN', wagonNumber: '21051944882' }
      ],
      typeOfFit: 'Full Fit',
      fitMemoNo: 'FIT/DSL/UDL/2026/661',
      fitMemoAttachment: {
        name: 'Fit_Memo_DSL_661.svg',
        type: 'image',
        url: sampleFitMemoUrl,
        uploadedAt: '2026-09-25 16:00'
      },
      txrSupervisorName: 'P. K. Mukherjee (SSE / C&W / UDL)',
      lineNoOrBay: 'Down Sick Line Bay 03',
      defectNoted: 'Brake beam deformed, distributor valve sluggish',
      workDone: 'Replaced brake beam, DV overhaul and single car test rig tested OK',
      status: 'Fit Certified',
      remarks: 'Certified fit for main line movement. Handed over to Yard Master Andal Down Yard.'
    },
    {
      id: 'sr-2',
      category: 'up_sick_line',
      year: 2026,
      month: 9,
      date: '2026-09-26',
      wagons: [
        { id: 'rw-4', owningRailway: 'NR', wagonType: 'BCNHL', wagonNumber: '22091966145' },
        { id: 'rw-5', owningRailway: 'CR', wagonType: 'BCNHL', wagonNumber: '21111955321' }
      ],
      typeOfFit: 'Empty Fit',
      fitMemoNo: 'FIT/USL/UDL/2026/890',
      fitMemoAttachment: {
        name: 'Fit_Memo_USL_890.svg',
        type: 'image',
        url: sampleFitMemoUrl,
        uploadedAt: '2026-09-26 14:30'
      },
      txrSupervisorName: 'B. B. Soren (JE / C&W / UDL)',
      lineNoOrBay: 'Up Sick Line Track 01',
      defectNoted: 'CBC uncoupling gear pin missing & brake shoes worn out',
      workDone: 'Fitted new pin, 8 composite brake blocks renewed',
      status: 'Fit Certified',
      remarks: 'Empty fit given for coal siding placement.'
    },
    {
      id: 'sr-3',
      category: 'boxn_depot',
      year: 2026,
      month: 10,
      date: '2026-10-01',
      wagons: [
        { id: 'rw-6', owningRailway: 'SECR', wagonType: 'BOXNHL', wagonNumber: '23041922319' },
        { id: 'rw-7', owningRailway: 'ECR', wagonType: 'BOXNHL', wagonNumber: '22021988771' }
      ],
      typeOfFit: 'Wheel Turning Fit',
      fitMemoNo: 'FIT/BOXN-DEPOT/UDL/112',
      fitMemoAttachment: {
        name: 'Fit_Memo_BOXN_112.svg',
        type: 'image',
        url: sampleFitMemoUrl,
        uploadedAt: '2026-10-01 18:00'
      },
      txrSupervisorName: 'A. Dutta (SSE / Incharge BOXN Depot UDL)',
      lineNoOrBay: 'BOXN ROH Depot Bay 02',
      defectNoted: 'Deep flange root defect detected during incoming walkaround',
      workDone: 'Wheel profile re-turned on surface wheel lathe, dimension checked with tyre gauge',
      status: 'Fit Certified',
      remarks: 'Released for rake formation in Andal Up Marshalling Yard.'
    }
  ];

  return {
    mixLoads,
    cymUnloadings,
    transhipments,
    pcmlDiversions,
    sickRepairs,
    lastBackupDate: new Date().toISOString()
  };
}

// Storage helpers
export function getAppDatabase(): AppDatabase {
  try {
    const raw = localStorage.getItem(DB_STORAGE_KEY);
    if (!raw) {
      const initial = getInitialData();
      saveAppDatabase(initial);
      return initial;
    }
    const parsed = JSON.parse(raw) as AppDatabase;
    // ensure all arrays exist
    if (!parsed.mixLoads) parsed.mixLoads = [];
    if (!parsed.cymUnloadings) parsed.cymUnloadings = [];
    if (!parsed.transhipments) parsed.transhipments = [];
    if (!parsed.pcmlDiversions) parsed.pcmlDiversions = [];
    if (!parsed.sickRepairs) parsed.sickRepairs = [];
    return parsed;
  } catch {
    const initial = getInitialData();
    saveAppDatabase(initial);
    return initial;
  }
}

export function saveAppDatabase(db: AppDatabase): void {
  try {
    db.lastBackupDate = new Date().toISOString();
    localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(db));
  } catch (err) {
    console.error('Failed to save database to localStorage:', err);
  }
}

export function resetToSampleDatabase(): AppDatabase {
  const initial = getInitialData();
  saveAppDatabase(initial);
  return initial;
}

// Pre-configured Railway Accounts (3 Roles)
export const VALID_USERS = [
  {
    username: 'admin',
    password: 'admin123',
    role: 'ADMIN' as const,
    roleTitle: 'CTNC (I/C)' as const,
    displayName: 'Chief Trains Clerk (In-Charge)',
    designation: 'CTNC In-Charge / Andal Yard',
    shift: 'Morning (06:00 - 14:00)' as const
  },
  {
    username: 'operator',
    password: 'op123',
    role: 'OPERATOR' as const,
    roleTitle: 'CTNC' as const,
    displayName: 'Trains Office Operator',
    designation: 'Trains Clerk (CTNC / UDL)',
    shift: 'Morning (06:00 - 14:00)' as const
  },
  {
    username: 'supervisor',
    password: 'super123',
    role: 'OPERATOR' as const,
    roleTitle: 'CTNC' as const,
    displayName: 'Yard Master / Supervisor',
    designation: 'Yard Master / Andal',
    shift: 'Evening (14:00 - 22:00)' as const
  },
  {
    username: 'viewer',
    password: 'view123',
    role: 'VIEWER' as const,
    roleTitle: 'Yard Staff' as const,
    displayName: 'Yard Staff (Viewer)',
    designation: 'Yard Operations Staff (Read-Only)',
    shift: 'Morning (06:00 - 14:00)' as const
  }
];

export function authenticateUser(username: string, password: string): UserSession | null {
  const cleanU = username.trim().toLowerCase();
  const cleanP = password.trim();

  const found = VALID_USERS.find(
    (u) => u.username.toLowerCase() === cleanU && u.password === cleanP
  );

  if (found) {
    const session: UserSession = {
      isLoggedIn: true,
      username: found.username,
      displayName: found.displayName,
      role: found.role,
      roleTitle: found.roleTitle,
      designation: found.designation,
      shift: found.shift,
      stationCode: 'UDL (Andal Marshalling Yard)'
    };
    saveSession(session);
    return session;
  }

  // Also support any password if user types admin or operator or viewer with generic pass
  if (cleanU === 'admin' && (cleanP === 'admin' || cleanP === 'admin123')) {
    return authenticateUser('admin', 'admin123');
  }
  if ((cleanU === 'operator' || cleanU === 'op') && (cleanP === 'op' || cleanP === 'op123')) {
    return authenticateUser('operator', 'op123');
  }
  if ((cleanU === 'viewer' || cleanU === 'view') && (cleanP === 'view' || cleanP === 'view123')) {
    return authenticateUser('viewer', 'view123');
  }

  return null;
}

// Session Management
export function getCurrentSession(): UserSession {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.isLoggedIn === 'boolean') {
        return parsed;
      }
    }
  } catch {
    // fallback
  }

  // Default initial state: Not logged in (Show login page first as requested)
  const loggedOutSession: UserSession = {
    isLoggedIn: false,
    username: '',
    displayName: 'Guest Operator',
    role: 'VIEWER',
    roleTitle: 'Yard Staff',
    designation: 'Unauthenticated User',
    stationCode: 'UDL (Andal Marshalling Yard)'
  };
  return loggedOutSession;
}

export function saveSession(session: UserSession): void {
  try {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(session));
  } catch (err) {
    console.error('Failed to save session:', err);
  }
}

export function clearSession(): void {
  try {
    localStorage.removeItem(USER_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear session:', err);
  }
}

// Global wagon trace / search helper across all 5 categories
export interface WagonTraceResult {
  category: 'Mix Load Management' | 'CYM Unloading' | 'Transhipment' | 'PCML Diversion' | 'Sick Repair';
  categoryId: string;
  recordId: string;
  date: string;
  owningRailway: string;
  wagonType: string;
  wagonNumber: string;
  detailTitle: string;
  subDetails: string;
  status?: string;
}

export function searchWagonAcrossSystem(query: string, db: AppDatabase): WagonTraceResult[] {
  const cleanQ = query.trim().toUpperCase();
  if (!cleanQ) return [];

  const results: WagonTraceResult[] = [];

  // 1. Mix Loads
  for (const item of db.mixLoads) {
    for (const w of item.wagons) {
      if (
        w.wagonNumber.toUpperCase().includes(cleanQ) ||
        w.owningRailway.toUpperCase().includes(cleanQ) ||
        w.wagonType.toUpperCase().includes(cleanQ)
      ) {
        results.push({
          category: 'Mix Load Management',
          categoryId: 'mix_load',
          recordId: item.id,
          date: item.date,
          owningRailway: w.owningRailway,
          wagonType: w.wagonType,
          wagonNumber: w.wagonNumber,
          detailTitle: `${item.type.toUpperCase()} MIX: ${item.loadName}`,
          subDetails: `Loco: ${item.engineNo} | Dest/From: ${item.destinationOrOrigin} | Out Time: ${item.outTime}`,
          status: 'Despatched'
        });
      }
    }
  }

  // 2. CYM Unloading
  for (const item of db.cymUnloadings) {
    for (const w of item.wagons) {
      if (
        w.wagonNumber.toUpperCase().includes(cleanQ) ||
        w.owningRailway.toUpperCase().includes(cleanQ) ||
        w.wagonType.toUpperCase().includes(cleanQ)
      ) {
        results.push({
          category: 'CYM Unloading',
          categoryId: 'cym_unloading',
          recordId: item.id,
          date: item.date,
          owningRailway: w.owningRailway,
          wagonType: w.wagonType,
          wagonNumber: w.wagonNumber,
          detailTitle: `CYM Unload at ${item.lineNo}`,
          subDetails: `Traffic Memo: ${item.trafficMemoNo || 'Issued'} | Outside Despatch: ${item.despatchedOutside ? (item.outsideDestination || 'Yes') : 'No'}`,
          status: item.status
        });
      }
    }
  }

  // 3. Transhipment
  for (const item of db.transhipments) {
    for (const w of item.loadedWagons) {
      if (
        w.wagonNumber.toUpperCase().includes(cleanQ) ||
        w.owningRailway.toUpperCase().includes(cleanQ) ||
        w.wagonType.toUpperCase().includes(cleanQ)
      ) {
        results.push({
          category: 'Transhipment',
          categoryId: 'transhipment',
          recordId: item.id,
          date: item.date,
          owningRailway: w.owningRailway,
          wagonType: w.wagonType,
          wagonNumber: w.wagonNumber,
          detailTitle: `Transhipment (Sick Origin Wagon): ${item.commodity}`,
          subDetails: `Traffic Memo: ${item.trafficMemoNo || 'Issued'} | Loc: ${item.transhipmentLocation || 'Andal Yard'}`,
          status: 'Sick Wagon Unloaded'
        });
      }
    }
    for (const w of item.transhipWagons) {
      if (
        w.wagonNumber.toUpperCase().includes(cleanQ) ||
        w.owningRailway.toUpperCase().includes(cleanQ) ||
        w.wagonType.toUpperCase().includes(cleanQ)
      ) {
        results.push({
          category: 'Transhipment',
          categoryId: 'transhipment',
          recordId: item.id,
          date: item.date,
          owningRailway: w.owningRailway,
          wagonType: w.wagonType,
          wagonNumber: w.wagonNumber,
          detailTitle: `Transhipment (Fit Receiving Wagon): ${item.commodity}`,
          subDetails: `Commercial Memo: ${item.commercialMemoNo || 'Issued'} | Loc: ${item.transhipmentLocation || 'Andal Yard'}`,
          status: 'Fit Wagon Loaded'
        });
      }
    }
  }

  // 4. PCML Diversion
  for (const item of db.pcmlDiversions) {
    for (const w of item.wagons) {
      if (
        w.wagonNumber.toUpperCase().includes(cleanQ) ||
        w.owningRailway.toUpperCase().includes(cleanQ) ||
        w.wagonType.toUpperCase().includes(cleanQ)
      ) {
        results.push({
          category: 'PCML Diversion',
          categoryId: 'pcml_diversion',
          recordId: item.id,
          date: item.date,
          owningRailway: w.owningRailway,
          wagonType: w.wagonType,
          wagonNumber: w.wagonNumber,
          detailTitle: `Piecemeal Diversion: ${item.fromStation} -> ${item.toStation}`,
          subDetails: `Diverted To: ${item.divertedToStation} | Reason: ${item.reasonForDiversion}`,
          status: item.status
        });
      }
    }
  }

  // 5. Sick Repair
  for (const item of db.sickRepairs) {
    const catLabel =
      item.category === 'down_sick_line' ? 'DOWN SICK LINE' :
      item.category === 'up_sick_line' ? 'UP SICK LINE' : 'BOXN DEPOT';

    for (const w of item.wagons) {
      if (
        w.wagonNumber.toUpperCase().includes(cleanQ) ||
        w.owningRailway.toUpperCase().includes(cleanQ) ||
        w.wagonType.toUpperCase().includes(cleanQ)
      ) {
        results.push({
          category: 'Sick Repair',
          categoryId: 'sick_repair',
          recordId: item.id,
          date: item.date,
          owningRailway: w.owningRailway,
          wagonType: w.wagonType,
          wagonNumber: w.wagonNumber,
          detailTitle: `${catLabel}: Fit Type [${item.typeOfFit}]`,
          subDetails: `Bay: ${item.lineNoOrBay || 'Sick Line'} | Supervisor: ${item.txrSupervisorName || 'TXR'} | Fit Memo: ${item.fitMemoNo || 'Certified'}`,
          status: item.status
        });
      }
    }
  }

  return results;
}
