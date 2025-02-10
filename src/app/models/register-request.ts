export class RegisterRequest {
  nombre?: string;
  email?: string;
  telefono?: string;
  usuario?: string;
  clave?: string;
  estado?: boolean;
  rol?: {
    id: number;
  };
}
