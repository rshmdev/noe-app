export interface Root {
  token: string;
  user: User;
}

export interface User {
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
  vehicleType: any;
  vehiclePlate: any;
  documentFrontUrl: any;
  documentBackUrl: any;
  cnhUrl: any;
  selfieUrl: any;
}
