import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { ApiKeyGuard } from '../common/guards/api-key.guard.js';
import { CreateReservationDto } from './dto/create-reservation.dto.js';
import { ReservationsService } from './reservations.service.js';

@ApiTags('reservations')
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar reservas (público)' })
  @ApiResponse({ status: 200, description: 'Lista de reservas' })
  findAll() {
    return this.reservationsService.findAll();
  }

  @Post()
  @UseGuards(ApiKeyGuard)
  @ApiSecurity('x-api-key')
  @ApiOperation({ summary: 'Crear una reserva (requiere API key)' })
  @ApiResponse({ status: 201, description: 'Reserva creada' })
  @ApiResponse({ status: 400, description: 'Datos inválidos' })
  @ApiResponse({ status: 403, description: 'API key inválida o ausente' })
  create(@Body() dto: CreateReservationDto) {
    // Para probar el Exception Filter, descomenta temporalmente:
    // throw new BadRequestException('Reservation data is invalid');
    return this.reservationsService.create(dto);
  }
}