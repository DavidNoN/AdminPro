import { Hospital } from './hospital.model';

interface MedicUser {
  _id: string;
  name: string;
  img: string;
}


export class Medic {

  constructor(
    public name: string,
    public _id?: string,
    public img?: string,
    public user?: MedicUser,
    public hospital?: Hospital
  ) {
  }


}
