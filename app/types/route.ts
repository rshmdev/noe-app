export interface Root {
  id: string;
  origin: string;
  originDate: string;
  destination: string;
  destinationDate: string;
  availableSlots: number;
  speciesAccepted: string;
  animalSizeAccepted: string;
  vehicleObservations: string;
  priceDescription: any;
  status: string;
  stops: Stop[];
  transportador?: Transporter;
  createdAt: string;
}

export interface Stop {
  id: string;
  location: string;
  arrivalTime: string;
  departureTime: string;
  notes: string;
}

export interface Transporter {
  id: string;
  role: string;
  name: string;
  email: string;
  password: string;
  cnh: string;
  vehicleInfo: string;
  isVerified: boolean;
  totalTrips: number;
  totalKm: number;
  animalsTransported: number;
  createdAt: string;
  cpf: any;
  cnpj: string;
  cnhNumber: any;
  vehicleType: string;
  vehiclePlate: string;
  documentFrontUrl: any;
  documentBackUrl: any;
  cnhUrl: string;
  selfieUrl: string;
  vehicleDocumentUrl: any;
}
