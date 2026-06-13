/**
 * Custom Branding Manager
 * White-label & branding customization for enterprise
 */

import { Database } from '@supabase/supabase-js';

export interface BrandingConfig {
  id: string;
  workspaceId: string;
  companyName: string;
  companyLogo: string; // URL to logo
  logoUrl?: string; // Alternative logo
  primaryColor: string; // Hex color
  secondaryColor: string; // Hex color
  accentColor: string; // Hex color
  backgroundColor: string; // Hex color
  textColor: string; // Hex color
  borderRadius: number; // 0-32 (px)
  fontFamily: string; // Font stack
  customDomain?: string; // Custom domain
  customEmailDomain?: string; // Custom email domain
  favicon: string; // URL to favicon
  faviconUrl?: string; // Alternative favicon
  socialMediaLinks?: Record<string, string>; // { twitter: "...", linkedin: "..." }
  customCSS?: string; // Custom CSS for advanced branding
  isWhiteLabel: boolean; // Remove "Victor IA" branding
  createdAt: number;
  updatedAt: number;
}

export const DEFAULT_BRANDING: Partial<BrandingConfig> = {
  primaryColor: '#0066FF', // Victor Blue
  secondaryColor: '#F0F4FF',
  accentColor: '#00D9FF',
  backgroundColor: '#FFFFFF',
  textColor: '#1A1A1A',
  borderRadius: 8,
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  isWhiteLabel: false,
};

class CustomBrandingManager {
  private db: Database | null = null;

  constructor(db?: Database) {
    if (db) {
      this.db = db;
    }
  }

  /**
   * Create or update branding configuration
   */
  async setBrandingConfig(
    workspaceId: string,
    config: Partial<BrandingConfig>
  ): Promise<BrandingConfig | null> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const now = Date.now();

      const { data, error } = await this.db
        .from('branding_configs')
        .upsert([
          {
            workspace_id: workspaceId,
            company_name: config.companyName,
            company_logo: config.companyLogo,
            logo_url: config.logoUrl,
            primary_color: config.primaryColor,
            secondary_color: config.secondaryColor,
            accent_color: config.accentColor,
            background_color: config.backgroundColor,
            text_color: config.textColor,
            border_radius: config.borderRadius,
            font_family: config.fontFamily,
            custom_domain: config.customDomain,
            custom_email_domain: config.customEmailDomain,
            favicon: config.favicon,
            favicon_url: config.faviconUrl,
            social_media_links: config.socialMediaLinks,
            custom_css: config.customCSS,
            is_white_label: config.isWhiteLabel ?? false,
            updated_at: now,
          },
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return this._mapDatabaseConfig(data);
    } catch (error) {
      console.error('Failed to set branding config:', error);
      return null;
    }
  }

  /**
   * Get branding configuration
   */
  async getBrandingConfig(workspaceId: string): Promise<BrandingConfig | null> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const { data, error } = await this.db
        .from('branding_configs')
        .select('*')
        .eq('workspace_id', workspaceId)
        .single();

      if (error) {
        return null;
      }

      return this._mapDatabaseConfig(data);
    } catch (error) {
      console.error('Failed to get branding config:', error);
      return null;
    }
  }

  /**
   * Get branding by custom domain
   */
  async getBrandingByCustomDomain(customDomain: string): Promise<BrandingConfig | null> {
    try {
      if (!this.db) {
        throw new Error('Database not initialized');
      }

      const { data, error } = await this.db
        .from('branding_configs')
        .select('*')
        .eq('custom_domain', customDomain)
        .single();

      if (error) {
        return null;
      }

      return this._mapDatabaseConfig(data);
    } catch (error) {
      console.error('Failed to get branding by custom domain:', error);
      return null;
    }
  }

  /**
   * Generate CSS variables for branding
   */
  generateBrandingCSS(branding: BrandingConfig): string {
    return `
      :root {
        --primary-color: ${branding.primaryColor};
        --secondary-color: ${branding.secondaryColor};
        --accent-color: ${branding.accentColor};
        --background-color: ${branding.backgroundColor};
        --text-color: ${branding.textColor};
        --border-radius: ${branding.borderRadius}px;
        --font-family: ${branding.fontFamily};
      }

      * {
        border-radius: var(--border-radius);
        color: var(--text-color);
      }

      html, body {
        background-color: var(--background-color);
        font-family: var(--font-family);
      }

      a {
        color: var(--primary-color);
      }

      button, [role="button"] {
        background-color: var(--primary-color);
        color: white;
        border-radius: var(--border-radius);
      }

      button:hover, [role="button"]:hover {
        opacity: 0.9;
      }

      input, textarea, select {
        border-color: var(--secondary-color);
        border-radius: var(--border-radius);
      }

      input:focus, textarea:focus, select:focus {
        border-color: var(--accent-color);
        outline: none;
        box-shadow: 0 0 0 3px rgba(0, 217, 255, 0.1);
      }

      ${branding.customCSS ? branding.customCSS : ''}
    `;
  }

  /**
   * Validate branding colors
   */
  validateBrandingColors(config: Partial<BrandingConfig>): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

    if (config.primaryColor && !hexRegex.test(config.primaryColor)) {
      errors.push('Primary color must be valid hex color');
    }
    if (config.secondaryColor && !hexRegex.test(config.secondaryColor)) {
      errors.push('Secondary color must be valid hex color');
    }
    if (config.accentColor && !hexRegex.test(config.accentColor)) {
      errors.push('Accent color must be valid hex color');
    }
    if (config.backgroundColor && !hexRegex.test(config.backgroundColor)) {
      errors.push('Background color must be valid hex color');
    }
    if (config.textColor && !hexRegex.test(config.textColor)) {
      errors.push('Text color must be valid hex color');
    }

    if (config.borderRadius !== undefined && (config.borderRadius < 0 || config.borderRadius > 32)) {
      errors.push('Border radius must be between 0 and 32');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate custom domain
   */
  validateCustomDomain(domain: string): {
    isValid: boolean;
    error?: string;
  } {
    const domainRegex = /^([a-z0-9](-[a-z0-9])*\.)+[a-z]{2,}$/i;

    if (!domainRegex.test(domain)) {
      return {
        isValid: false,
        error: 'Invalid domain format',
      };
    }

    // Reserved domains
    const reserved = ['app', 'api', 'admin', 'support', 'help', 'docs'];
    const subdomain = domain.split('.')[0];

    if (reserved.includes(subdomain)) {
      return {
        isValid: false,
        error: `"${subdomain}" is a reserved subdomain`,
      };
    }

    return { isValid: true };
  }

  /**
   * Map database config to interface
   */
  private _mapDatabaseConfig(data: any): BrandingConfig {
    return {
      id: data.id,
      workspaceId: data.workspace_id,
      companyName: data.company_name,
      companyLogo: data.company_logo,
      logoUrl: data.logo_url,
      primaryColor: data.primary_color,
      secondaryColor: data.secondary_color,
      accentColor: data.accent_color,
      backgroundColor: data.background_color,
      textColor: data.text_color,
      borderRadius: data.border_radius,
      fontFamily: data.font_family,
      customDomain: data.custom_domain,
      customEmailDomain: data.custom_email_domain,
      favicon: data.favicon,
      faviconUrl: data.favicon_url,
      socialMediaLinks: data.social_media_links,
      customCSS: data.custom_css,
      isWhiteLabel: data.is_white_label,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}

export default CustomBrandingManager;