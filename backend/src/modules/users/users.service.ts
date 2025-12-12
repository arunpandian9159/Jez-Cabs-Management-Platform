import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
    SavedAddress,
    RecentDestination,
    PaymentMethod,
    Wallet,
    Transaction,
} from './entities';
import { PaymentMethodType } from './entities/payment-method.entity';
import { CreateAddressDto, UpdateAddressDto, CreatePaymentMethodDto } from './dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(SavedAddress)
        private addressRepository: Repository<SavedAddress>,
        @InjectRepository(RecentDestination)
        private recentDestRepository: Repository<RecentDestination>,
        @InjectRepository(PaymentMethod)
        private paymentMethodRepository: Repository<PaymentMethod>,
        @InjectRepository(Wallet)
        private walletRepository: Repository<Wallet>,
        @InjectRepository(Transaction)
        private transactionRepository: Repository<Transaction>,
    ) { }

    // ==================== Saved Addresses ====================

    async getSavedAddresses(userId: string): Promise<SavedAddress[]> {
        return this.addressRepository.find({
            where: { user_id: userId },
            order: { created_at: 'DESC' },
        });
    }

    async createAddress(userId: string, dto: CreateAddressDto): Promise<SavedAddress> {
        // If this is set as default, unset other defaults
        if (dto.is_default) {
            await this.addressRepository.update(
                { user_id: userId, is_default: true },
                { is_default: false }
            );
        }

        const address = this.addressRepository.create({
            ...dto,
            user_id: userId,
        });
        return this.addressRepository.save(address);
    }

    async updateAddress(userId: string, id: string, dto: UpdateAddressDto): Promise<SavedAddress> {
        const address = await this.addressRepository.findOne({
            where: { id, user_id: userId },
        });

        if (!address) {
            throw new NotFoundException('Address not found');
        }

        // If setting as default, unset other defaults
        if (dto.is_default) {
            await this.addressRepository.update(
                { user_id: userId, is_default: true },
                { is_default: false }
            );
        }

        Object.assign(address, dto);
        return this.addressRepository.save(address);
    }

    async deleteAddress(userId: string, id: string): Promise<void> {
        const result = await this.addressRepository.delete({ id, user_id: userId });
        if (result.affected === 0) {
            throw new NotFoundException('Address not found');
        }
    }

    // ==================== Recent Destinations ====================

    async getRecentDestinations(userId: string, limit: number = 10): Promise<RecentDestination[]> {
        return this.recentDestRepository.find({
            where: { user_id: userId },
            order: { used_at: 'DESC' },
            take: limit,
        });
    }

    async addRecentDestination(userId: string, address: string, lat: number, lng: number): Promise<RecentDestination> {
        // Check if this destination already exists (within ~100m radius)
        const existing = await this.recentDestRepository.findOne({
            where: { user_id: userId, address },
        });

        if (existing) {
            // Update the used_at timestamp
            existing.used_at = new Date();
            return this.recentDestRepository.save(existing);
        }

        const destination = this.recentDestRepository.create({
            user_id: userId,
            address,
            lat,
            lng,
        });
        return this.recentDestRepository.save(destination);
    }

    // ==================== Payment Methods ====================

    async getPaymentMethods(userId: string): Promise<PaymentMethod[]> {
        return this.paymentMethodRepository.find({
            where: { user_id: userId },
            order: { is_default: 'DESC', created_at: 'DESC' },
        });
    }

    async addPaymentMethod(userId: string, dto: CreatePaymentMethodDto): Promise<PaymentMethod> {
        // If this is set as default, unset other defaults
        if (dto.is_default) {
            await this.paymentMethodRepository.update(
                { user_id: userId, is_default: true },
                { is_default: false }
            );
        }

        // Generate display name based on type
        let displayName = '';
        let lastFour: string | undefined;

        if (dto.type === 'upi') {
            displayName = dto.upi_id || 'UPI';
        } else if (dto.type === 'card') {
            lastFour = dto.token?.slice(-4);
            displayName = `Card ending in ${lastFour || '****'}`;
        } else if (dto.type === 'wallet') {
            displayName = 'Jez Wallet';
        } else {
            displayName = 'Net Banking';
        }

        const paymentMethod = this.paymentMethodRepository.create({
            user_id: userId,
            type: dto.type as PaymentMethodType,
            display_name: displayName,
            last_four: lastFour,
            upi_id: dto.upi_id,
            is_default: dto.is_default || false,
        });

        return this.paymentMethodRepository.save(paymentMethod);
    }

    async removePaymentMethod(userId: string, id: string): Promise<void> {
        const result = await this.paymentMethodRepository.delete({ id, user_id: userId });
        if (result.affected === 0) {
            throw new NotFoundException('Payment method not found');
        }
    }

    async setDefaultPaymentMethod(userId: string, id: string): Promise<PaymentMethod> {
        const method = await this.paymentMethodRepository.findOne({
            where: { id, user_id: userId },
        });

        if (!method) {
            throw new NotFoundException('Payment method not found');
        }

        // Unset other defaults
        await this.paymentMethodRepository.update(
            { user_id: userId, is_default: true },
            { is_default: false }
        );

        method.is_default = true;
        return this.paymentMethodRepository.save(method);
    }

    // ==================== Wallet ====================

    async getWallet(userId: string): Promise<Wallet> {
        let wallet = await this.walletRepository.findOne({
            where: { user_id: userId },
        });

        // Create wallet if it doesn't exist
        if (!wallet) {
            wallet = this.walletRepository.create({
                user_id: userId,
                balance: 0,
                currency: 'INR',
            });
            await this.walletRepository.save(wallet);
        }

        return wallet;
    }

    async updateWalletBalance(userId: string, amount: number): Promise<Wallet> {
        const wallet = await this.getWallet(userId);
        wallet.balance = Number(wallet.balance) + amount;
        return this.walletRepository.save(wallet);
    }

    // ==================== Transactions ====================

    async getTransactions(userId: string, limit: number = 20): Promise<Transaction[]> {
        return this.transactionRepository.find({
            where: { user_id: userId },
            order: { created_at: 'DESC' },
            take: limit,
        });
    }

    async createTransaction(
        userId: string,
        type: 'payment' | 'refund' | 'topup' | 'withdrawal',
        amount: number,
        description: string,
        tripId?: string,
        paymentMethod?: string,
    ): Promise<Transaction> {
        const transaction = this.transactionRepository.create({
            user_id: userId,
            type: type as any,
            amount,
            description,
            trip_id: tripId,
            payment_method: paymentMethod,
            status: 'completed' as any,
        });

        return this.transactionRepository.save(transaction);
    }
}
