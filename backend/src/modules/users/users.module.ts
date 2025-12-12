import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
    SavedAddress,
    RecentDestination,
    PaymentMethod,
    Wallet,
    Transaction,
} from './entities';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            SavedAddress,
            RecentDestination,
            PaymentMethod,
            Wallet,
            Transaction,
        ]),
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule { }
