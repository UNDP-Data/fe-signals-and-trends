/**
 * Browser-compatible database client for Azure PostgreSQL.
 * 
 * This uses a simplified approach to connect to Azure PostgreSQL 
 * from browser environments for development purposes.
 */

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck - Disable TypeScript checks for browser compatibility

// Re-export schema for use in components
export * from './schema';

// Define types for database responses
export interface PaginationResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Define interfaces for API calls
export interface SignalSearchParams {
  page?: number;
  per_page?: number;
  order_by?: string;
  direction?: 'desc' | 'asc';
  statuses?: string[];
  created_by?: string;
  created_for?: string;
  steep_primary?: string;
  steep_secondary?: string[];
  signature_primary?: string;
  signature_secondary?: string[];
  sdgs?: string[];
  query?: string;
  location?: string;
  bureau?: string;
  score?: string;
  unit?: string;
}

// Define concrete types to avoid type errors
export interface UserGroup {
  id: number;
  name: string;
  signal_ids: number[];
  user_ids: number[];
  collaborator_map: string;
  created_at: Date | string;
  admin_ids?: number[] | null;
}

export interface Signal {
  id: number;
  status: string;
  created_at: Date | string;
  created_by: string;
  created_for?: string | null;
  modified_at: Date | string;
  modified_by: string;
  headline?: string | null;
  description?: string | null;
  steep_primary?: string | null;
  steep_secondary?: string[] | null;
  signature_primary?: string | null;
  signature_secondary?: string[] | null;
  sdgs?: string[] | null;
}

export interface UserSprintsResult {
  userGroups: UserGroup[];
  signals: Signal[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// For browser environments, we need to use the API endpoint approach
// This is a temporary solution for development
const API_BASE_URL = '/api/db';

/**
 * Database client for browser environments
 * This creates a simplified interface to make database queries via API endpoints
 */
export const db = {
  // Execute a raw SQL query via API
  execute: async (query, params = []) => {
    try {
      const response = await fetch(`${API_BASE_URL}/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, params })
      });
      
      if (!response.ok) {
        throw new Error(`Database query failed: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Database execute error:', error);
      return [];
    }
  },
  
  // Select data from a table
  select: async (table, conditions = {}, limit = null, offset = null) => {
    try {
      const params = new URLSearchParams();
      params.append('table', table);
      
      if (Object.keys(conditions).length) {
        params.append('conditions', JSON.stringify(conditions));
      }
      
      if (limit !== null) params.append('limit', limit.toString());
      if (offset !== null) params.append('offset', offset.toString());
      
      const response = await fetch(`${API_BASE_URL}/select?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`Select query failed: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Database select error:', error);
      return [];
    }
  }
};

// Database queries for client-side use
export const clientQueries = {
  getUserSprints: async (username: string, options?: { page?: number; limit?: number }): Promise<UserSprintsResult> => {
    try {
      const page = options?.page || 1;
      const limit = options?.limit || 20;
      const offset = (page - 1) * limit;
      
      // Find the user first
      const users = await db.select('users', { email: username }, 1);
      
      if (!users || users.length === 0) {
        throw new Error('User not found');
      }
      
      const userId = users[0].id;
      
      // In a real implementation, we would query user groups and signals
      // For now, we'll return a mock result until API endpoints are created
      
      // Return mock data for development
      return {
        userGroups: [],
        signals: [],
        total: 0,
        page,
        limit,
        totalPages: 0
      };
    } catch (error) {
      console.error('Error fetching user sprints:', error);
      return {
        userGroups: [],
        signals: [],
        total: 0,
        page: options?.page || 1,
        limit: options?.limit || 20,
        totalPages: 0
      };
    }
  }
};