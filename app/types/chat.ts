export interface Root {
  id: string;
  route: Route;
  createdAt: string;
  otherUser: OtherUser;
  lastMessage: any;
  unreadCount: number;
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

export interface OtherUser {
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

export interface Messages {
  id: string;
  sender: Sender;
  text: string;
  paymentStatus?: string;
  proposal?: Proposal;
  read: boolean;
  createdAt: string;
}

export interface Proposal {
  id: string;
  price: string;
  message: string;
  status: string;
  createdAt: string;
}

export interface Sender {
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
  cnhNumber: any;
  vehicleType: any;
  vehiclePlate: any;
  documentFrontUrl: string;
  documentBackUrl: string;
  cnhUrl: any;
  selfieUrl: string;
  vehicleDocumentUrl: any;
}
