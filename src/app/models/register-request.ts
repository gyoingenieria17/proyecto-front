export class RegisterRequest {
  nombre?: string;
  email?: string;
  telefono?: string;
  usuario?: string;
  clave?: string;
  rol?: {
    id: number;
  };
}
