import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto.js';

export interface Reservation extends CreateReservationDto {
  id: number;
}

@Injectable()
export class ReservationsService {
  private reservations: Reservation[] = [];
  private nextId = 1;

  create(dto: CreateReservationDto): Reservation {
    const reservation = { id: this.nextId++, ...dto };
    this.reservations.push(reservation);
    return reservation;
  }

  findAll(): Reservation[] {
    return this.reservations;
  }
}