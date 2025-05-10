export interface Order {
  id: string;
  proposal: Proposal;
  stripePaymentIntentId: string;
  status: string;
  pickupCode: string;
  deliveryCode: string;
  createdAt: string;
  confirmedAt: any;
}

export interface Proposal {
  id: string;
  route: Route;
  user: User;
  transportador: Transportador;
  price: string;
  message: string;
  status: string;
  createdAt: string;
}

export interface Route {
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
  createdAt: string;
}

export interface User {
  id: string;
  role: string;
  name: string;
  email: string;
  password: string;
  cnh: any;
  vehicleInfo: any;
  isVerified: boolean;
  totalTrips: number;
  totalKm: number;
  animalsTransported: number;
  createdAt: string;
  cpf: string;
  cnpj: any;
  vehicleType: any;
  vehiclePlate: any;
  documentFrontUrl: string;
  documentBackUrl: string;
  cnhUrl: any;
  selfieUrl: string;
  vehicleDocumentUrl: any;
}

export interface Transportador {
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
  vehicleType: string;
  vehiclePlate: string;
  documentFrontUrl: any;
  documentBackUrl: any;
  cnhUrl: string;
  selfieUrl: string;
  vehicleDocumentUrl: string;
}
