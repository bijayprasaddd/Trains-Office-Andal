export interface WagonEntry {
  id: string;
  owningRailway: string; // e.g. ER, SER, ECR, SECR, NR, WR, CR, SR, etc.
  wagonType: string;     // e.g. BOXNHL, BCNHL, BOBRN, BRN, BOXN, BTPN, etc.
  wagonNumber: string;   // e.g. 22120938471
  loadStatus?: 'Loaded' | 'Empty'; // Column for Loaded or Empty
  destination?: string;  // Individual wagon destination (optional / non-mandatory)
  tareWeight?: string;
  carryingCapacity?: string;
  commodity?: string;
  remarks?: string;
}

export interface FileAttachment {
  name: string;
  type: 'image' | 'pdf';
  url: string; // Data URL or object URL
  uploadedAt: string;
  size?: string;
}

// 1. MIX LOAD MANAGEMENT
export interface MixLoadEntry {
  id: string;
  type: 'incoming' | 'outgoing';
  year: number;
  month: number; // 1-12
  date: string;  // YYYY-MM-DD
  loadName: string; // e.g. UDL-BPC MIX, DHN EMPTY MIX
  engineNo: string; // e.g. WAG9-31245
  outTime: string;  // e.g. 04:30 or 16:45
  destinationOrOrigin: string; // Destination for outgoing, Origin for incoming
  bpcAttachment?: FileAttachment;
  vehicleGuidanceAttachment?: FileAttachment;
  bpcNo?: string;
  bpcPercentage?: number;
  wagons: WagonEntry[];
  trainGuardName?: string;
  locoPilotName?: string;
  remarks?: string;
  createdAt: string;
}

// 2. CYM UNLOADING
export interface CYMUnloadingEntry {
  id: string;
  year: number;
  month: number;
  date: string; // YYYY-MM-DD
  wagons: WagonEntry[];
  trafficMemoIssueDate: string; // YYYY-MM-DD
  trafficMemoAttachment?: FileAttachment;
  trafficMemoNo?: string;
  commercialReleaseDate: string; // YYYY-MM-DD
  commercialMemoAttachment?: FileAttachment;
  commercialMemoNo?: string;
  lineNo: string; // e.g. Line 04, Yard Line 07, Coal Wharf Line 2
  despatchedOutside: boolean;
  outsideDestination?: string; // e.g. DGR, ASN, DGR-SAIL
  despatchDate?: string;
  status: 'In Unloading' | 'Released' | 'Despatched';
  remarks?: string;
  createdAt?: string;
}

// 3. TRANSHIPMENT
export interface TranshipmentEntry {
  id: string;
  year: number;
  month: number;
  date: string; // YYYY-MM-DD
  commodity: string;
  loadedWagons: WagonEntry[]; // Sick wagons with contents
  transhipWagons: WagonEntry[]; // Fit wagons receiving contents
  trafficMemoAttachment?: FileAttachment;
  trafficMemoNo?: string;
  trafficMemoIssueDate: string;
  commercialMemoAttachment?: FileAttachment;
  commercialMemoNo?: string;
  commercialMemoIssueDate: string;
  contractorOrStaff?: string;
  transhipmentLocation?: string; // e.g. Andal Tranship Shed / Yard Line 3
  status: 'Initiated' | 'In Progress' | 'Completed';
  remarks?: string;
  createdAt?: string;
}

// 4. PCML DIVERSION (Piecemeal Diversion)
export interface PCMLDiversionEntry {
  id: string;
  year: number;
  month: number;
  date: string; // Date of diversion request/entry
  dateOfDiversion: string; // Date when diversion executed
  wagons: WagonEntry[];
  fromStation: string; // Original origin
  toStation: string;   // Original destination
  divertedToStation: string; // Nearer diverted destination
  trafficDivtRequestMemoAttachment?: FileAttachment;
  trafficDivtRequestMemoNo?: string;
  nrCellDivtLetterAttachment?: FileAttachment;
  nrCellDivtLetterRef?: string;
  reasonForDiversion: string;
  authorisedBy?: string;
  status: 'Proposed' | 'Approved' | 'Diverted';
  remarks?: string;
  createdAt?: string;
}

// 5. SICK REPAIR
export type SickRepairCategory = 'down_sick_line' | 'up_sick_line' | 'boxn_depot';

export interface SickRepairEntry {
  id: string;
  category: SickRepairCategory; // 'down_sick_line' | 'up_sick_line' | 'boxn_depot'
  year: number;
  month: number;
  date: string; // YYYY-MM-DD (Date when wagons fit)
  wagons: WagonEntry[];
  typeOfFit: string; // e.g. Full Fit, Empty Fit, Loaded Fit, Wheel Turning, Brake Beam Fit, Temporary Fit
  fitMemoAttachment?: FileAttachment;
  fitMemoNo?: string;
  txrSupervisorName?: string;
  lineNoOrBay?: string;
  defectNoted?: string;
  workDone?: string;
  status: 'Under Repair' | 'Fit Certified' | 'Despatched to Yard';
  remarks?: string;
  createdAt?: string;
}

// Overall Store schema
export interface AppDatabase {
  mixLoads: MixLoadEntry[];
  cymUnloadings: CYMUnloadingEntry[];
  transhipments: TranshipmentEntry[];
  pcmlDiversions: PCMLDiversionEntry[];
  sickRepairs: SickRepairEntry[];
  lastBackupDate?: string;
}

// User Authentication Session
export type RailwayRole = 'ADMIN' | 'OPERATOR' | 'VIEWER';

export interface UserSession {
  isLoggedIn: boolean;
  username: string;
  displayName: string;
  role: RailwayRole;
  roleTitle: 'CTNC (I/C)' | 'CTNC' | 'Yard Staff';
  designation: string;
  shift?: string;
  stationCode: string; // UDL (Andal Marshalling Yard)
}
