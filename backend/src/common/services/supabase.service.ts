import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class SupabaseService implements OnModuleInit {
    private readonly logger = new Logger(SupabaseService.name);
    private supabaseClient: SupabaseClient | null = null;

    constructor(private readonly configService: ConfigService) { }

    onModuleInit() {
        const supabaseUrl = this.configService.get<string>('supabase.url');
        const supabaseAnonKey = this.configService.get<string>('supabase.anonKey');

        if (supabaseUrl && supabaseAnonKey) {
            this.supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
                auth: {
                    autoRefreshToken: true,
                    persistSession: false,
                },
            });
            this.logger.log('Supabase client initialized successfully');
        } else {
            this.logger.warn(
                'Supabase URL or Anon Key not configured. Supabase client not initialized.',
            );
        }
    }

    /**
     * Get the Supabase client instance
     * Use this for direct Supabase operations like Storage, Realtime, etc.
     */
    getClient(): SupabaseClient {
        if (!this.supabaseClient) {
            throw new Error(
                'Supabase client not initialized. Please configure SUPABASE_URL and SUPABASE_ANON_KEY.',
            );
        }
        return this.supabaseClient;
    }

    /**
     * Check if Supabase client is available
     */
    isAvailable(): boolean {
        return this.supabaseClient !== null;
    }

    /**
     * Get a service role client for admin operations
     * Only use this for server-side operations that require elevated privileges
     */
    getServiceRoleClient(): SupabaseClient {
        const supabaseUrl = this.configService.get<string>('supabase.url');
        const serviceRoleKey = this.configService.get<string>(
            'supabase.serviceRoleKey',
        );

        if (!supabaseUrl || !serviceRoleKey) {
            throw new Error(
                'Supabase URL or Service Role Key not configured for admin operations.',
            );
        }

        return createClient(supabaseUrl, serviceRoleKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        });
    }
}
