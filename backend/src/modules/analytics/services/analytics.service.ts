import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { Cab } from '../../cab/entities';
import { Driver } from '../../driver/entities';
import { Booking } from '../../booking/entities';
import { Invoice } from '../../invoice/entities';
import { User } from '../../iam/entities';
import { AnalyticsQueryDto, AnalyticsPeriod } from '../dto';
import { CabStatus } from '../../../common/enums/cab-status.enum';
import { BookingStatus } from '../../../common/enums/booking-status.enum';
import { InvoiceStatus } from '../../../common/enums/invoice-status.enum';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Cab)
    private cabRepository: Repository<Cab>,
    @InjectRepository(Driver)
    private driverRepository: Repository<Driver>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Invoice)
    private invoiceRepository: Repository<Invoice>,
  ) {}

  async getDashboardKPIs(queryDto: AnalyticsQueryDto, currentUser: User) {
    const { startDate, endDate } = this.getDateRange(queryDto);

    // Get all metrics in parallel
    const [
      totalCabs,
      availableCabs,
      rentedCabs,
      maintenanceCabs,
      totalDrivers,
      activeDrivers,
      totalBookings,
      activeBookings,
      completedBookings,
      totalRevenue,
      paidRevenue,
      pendingRevenue,
      overdueInvoices,
    ] = await Promise.all([
      // Cab metrics
      this.cabRepository.count({ where: { company_id: currentUser.company_id } }),
      this.cabRepository.count({
        where: { company_id: currentUser.company_id, status: CabStatus.AVAILABLE },
      }),
      this.cabRepository.count({
        where: { company_id: currentUser.company_id, status: CabStatus.RENTED },
      }),
      this.cabRepository.count({
        where: { company_id: currentUser.company_id, status: CabStatus.IN_MAINTENANCE },
      }),

      // Driver metrics
      this.driverRepository.count({ where: { company_id: currentUser.company_id } }),
      this.driverRepository.count({
        where: { company_id: currentUser.company_id, is_active: true },
      }),

      // Booking metrics
      this.bookingRepository.count({
        where: {
          company_id: currentUser.company_id,
          created_at: Between(startDate, endDate),
        },
      }),
      this.bookingRepository.count({
        where: {
          company_id: currentUser.company_id,
          status: BookingStatus.ACTIVE,
        },
      }),
      this.bookingRepository.count({
        where: {
          company_id: currentUser.company_id,
          status: BookingStatus.COMPLETED,
          created_at: Between(startDate, endDate),
        },
      }),

      // Revenue metrics
      this.calculateTotalRevenue(currentUser.company_id, startDate, endDate),
      this.calculatePaidRevenue(currentUser.company_id, startDate, endDate),
      this.calculatePendingRevenue(currentUser.company_id, startDate, endDate),
      this.invoiceRepository.count({
        where: {
          company_id: currentUser.company_id,
          status: InvoiceStatus.OVERDUE,
        },
      }),
    ]);

    // Calculate utilization rate
    const utilizationRate = totalCabs > 0 ? (rentedCabs / totalCabs) * 100 : 0;

    return {
      period: {
        type: queryDto.period,
        startDate,
        endDate,
      },
      fleet: {
        totalCabs,
        availableCabs,
        rentedCabs,
        maintenanceCabs,
        utilizationRate: Math.round(utilizationRate * 100) / 100,
      },
      drivers: {
        totalDrivers,
        activeDrivers,
        inactiveDrivers: totalDrivers - activeDrivers,
      },
      bookings: {
        totalBookings,
        activeBookings,
        completedBookings,
        pendingBookings: totalBookings - activeBookings - completedBookings,
      },
      revenue: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        paidRevenue: Math.round(paidRevenue * 100) / 100,
        pendingRevenue: Math.round(pendingRevenue * 100) / 100,
        overdueInvoices,
        collectionRate:
          totalRevenue > 0 ? Math.round((paidRevenue / totalRevenue) * 10000) / 100 : 0,
      },
    };
  }

  async getFleetUtilization(queryDto: AnalyticsQueryDto, currentUser: User) {
    const { startDate, endDate } = this.getDateRange(queryDto);

    // Get all cabs
    const cabs = await this.cabRepository.find({
      where: { company_id: currentUser.company_id },
    });

    // Calculate utilization for each cab
    const utilizationData = await Promise.all(
      cabs.map(async (cab) => {
        const bookings = await this.bookingRepository.find({
          where: {
            company_id: currentUser.company_id,
            cab_id: cab.id,
            status: In([BookingStatus.ACTIVE, BookingStatus.COMPLETED]),
            start_date: Between(startDate, endDate),
          },
        });

        // Calculate total days rented
        let totalDaysRented = 0;
        bookings.forEach((booking) => {
          const start = new Date(booking.start_date);
          const end = new Date(booking.end_date);
          const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
          totalDaysRented += days;
        });

        // Calculate period days
        const periodDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        const utilizationRate = periodDays > 0 ? (totalDaysRented / periodDays) * 100 : 0;

        // Calculate revenue
        const revenue = bookings.reduce(
          (sum, booking) => sum + Number(booking.total_amount || 0),
          0,
        );

        return {
          cabId: cab.id,
          registrationNumber: cab.registration_number,
          make: cab.make,
          model: cab.model,
          totalBookings: bookings.length,
          totalDaysRented,
          utilizationRate: Math.round(utilizationRate * 100) / 100,
          revenue: Math.round(revenue * 100) / 100,
        };
      }),
    );

    // Sort by utilization rate
    utilizationData.sort((a, b) => b.utilizationRate - a.utilizationRate);

    return {
      period: {
        type: queryDto.period,
        startDate,
        endDate,
      },
      totalCabs: cabs.length,
      averageUtilization:
        utilizationData.length > 0
          ? Math.round(
              (utilizationData.reduce((sum, cab) => sum + cab.utilizationRate, 0) /
                utilizationData.length) *
                100,
            ) / 100
          : 0,
      cabs: utilizationData,
    };
  }

  async getRevenueAnalytics(queryDto: AnalyticsQueryDto, currentUser: User) {
    const { startDate, endDate } = this.getDateRange(queryDto);

    // Get all invoices in the period
    const invoices = await this.invoiceRepository.find({
      where: {
        company_id: currentUser.company_id,
        created_at: Between(startDate, endDate),
      },
      order: { created_at: 'ASC' },
    });

    // Group by status
    const byStatus = {
      [InvoiceStatus.DRAFT]: 0,
      [InvoiceStatus.SENT]: 0,
      [InvoiceStatus.PAID]: 0,
      [InvoiceStatus.OVERDUE]: 0,
      [InvoiceStatus.CANCELLED]: 0,
    };

    invoices.forEach((invoice) => {
      byStatus[invoice.status] += Number(invoice.total_amount || 0);
    });

    // Calculate totals
    const totalInvoiced = invoices.reduce((sum, inv) => sum + Number(inv.total_amount || 0), 0);
    const totalPaid = byStatus[InvoiceStatus.PAID];
    const totalPending = byStatus[InvoiceStatus.SENT] + byStatus[InvoiceStatus.OVERDUE];

    // Group by month for trend analysis
    const monthlyRevenue: Record<string, number> = {};
    invoices.forEach((invoice) => {
      const month = new Date(invoice.created_at).toISOString().substring(0, 7); // YYYY-MM
      monthlyRevenue[month] = (monthlyRevenue[month] || 0) + Number(invoice.total_amount || 0);
    });

    return {
      period: {
        type: queryDto.period,
        startDate,
        endDate,
      },
      summary: {
        totalInvoices: invoices.length,
        totalInvoiced: Math.round(totalInvoiced * 100) / 100,
        totalPaid: Math.round(totalPaid * 100) / 100,
        totalPending: Math.round(totalPending * 100) / 100,
        collectionRate:
          totalInvoiced > 0 ? Math.round((totalPaid / totalInvoiced) * 10000) / 100 : 0,
      },
      byStatus: {
        draft: Math.round(byStatus[InvoiceStatus.DRAFT] * 100) / 100,
        sent: Math.round(byStatus[InvoiceStatus.SENT] * 100) / 100,
        paid: Math.round(byStatus[InvoiceStatus.PAID] * 100) / 100,
        overdue: Math.round(byStatus[InvoiceStatus.OVERDUE] * 100) / 100,
        cancelled: Math.round(byStatus[InvoiceStatus.CANCELLED] * 100) / 100,
      },
      monthlyTrend: Object.entries(monthlyRevenue).map(([month, amount]) => ({
        month,
        amount: Math.round(amount * 100) / 100,
      })),
    };
  }

  async getDriverPerformance(queryDto: AnalyticsQueryDto, currentUser: User) {
    const { startDate, endDate } = this.getDateRange(queryDto);

    // Get all drivers
    const drivers = await this.driverRepository.find({
      where: { company_id: currentUser.company_id },
    });

    // Calculate performance for each driver
    const performanceData = await Promise.all(
      drivers.map(async (driver) => {
        const bookings = await this.bookingRepository.find({
          where: {
            company_id: currentUser.company_id,
            driver_id: driver.id,
            start_date: Between(startDate, endDate),
          },
        });

        const completedBookings = bookings.filter(
          (b) => b.status === BookingStatus.COMPLETED,
        ).length;
        const totalRevenue = bookings.reduce(
          (sum, booking) => sum + Number(booking.total_amount || 0),
          0,
        );

        return {
          driverId: driver.id,
          firstName: driver.first_name,
          lastName: driver.last_name,
          email: driver.email,
          totalBookings: bookings.length,
          completedBookings,
          activeBookings: bookings.filter((b) => b.status === BookingStatus.ACTIVE).length,
          totalRevenue: Math.round(totalRevenue * 100) / 100,
          isActive: driver.is_active,
        };
      }),
    );

    // Sort by total revenue
    performanceData.sort((a, b) => b.totalRevenue - a.totalRevenue);

    return {
      period: {
        type: queryDto.period,
        startDate,
        endDate,
      },
      totalDrivers: drivers.length,
      drivers: performanceData,
    };
  }

  // Helper methods
  private getDateRange(queryDto: AnalyticsQueryDto): { startDate: Date; endDate: Date } {
    const now = new Date();
    let startDate: Date;
    let endDate: Date = now;

    if (queryDto.period === AnalyticsPeriod.CUSTOM) {
      startDate = queryDto.startDate || new Date(now.getFullYear(), now.getMonth(), 1);
      endDate = queryDto.endDate || now;
    } else {
      switch (queryDto.period) {
        case AnalyticsPeriod.DAY:
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case AnalyticsPeriod.WEEK:
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case AnalyticsPeriod.MONTH:
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
          break;
        case AnalyticsPeriod.QUARTER:
          const quarter = Math.floor(now.getMonth() / 3);
          startDate = new Date(now.getFullYear(), quarter * 3, 1);
          break;
        case AnalyticsPeriod.YEAR:
          startDate = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      }
    }

    return { startDate, endDate };
  }

  private async calculateTotalRevenue(
    company_id: string,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const result = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .select('SUM(invoice.total_amount)', 'total')
      .where('invoice.company_id = :company_id', { company_id })
      .andWhere('invoice.created_at BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getRawOne();

    return Number(result?.total || 0);
  }

  private async calculatePaidRevenue(
    company_id: string,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const result = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .select('SUM(invoice.total_amount)', 'total')
      .where('invoice.company_id = :company_id', { company_id })
      .andWhere('invoice.status = :status', { status: InvoiceStatus.PAID })
      .andWhere('invoice.created_at BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getRawOne();

    return Number(result?.total || 0);
  }

  private async calculatePendingRevenue(
    company_id: string,
    startDate: Date,
    endDate: Date,
  ): Promise<number> {
    const result = await this.invoiceRepository
      .createQueryBuilder('invoice')
      .select('SUM(invoice.total_amount)', 'total')
      .where('invoice.company_id = :company_id', { company_id })
      .andWhere('invoice.status IN (:...statuses)', {
        statuses: [InvoiceStatus.SENT, InvoiceStatus.OVERDUE],
      })
      .andWhere('invoice.created_at BETWEEN :startDate AND :endDate', { startDate, endDate })
      .getRawOne();

    return Number(result?.total || 0);
  }
}

