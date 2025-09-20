// Global type definitions for the React Static Site Template

export interface RouteConfig {
  path: string;
  title: string;
  description: string;
}

export interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
}

export interface FormData {
  name: string;
  email: string;
  message: string;
}

export interface NavigationItem {
  name: string;
  path: string;
  current: boolean;
}

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  author: string;
  social: {
    github?: string;
    twitter?: string;
    linkedin?: string;
  };
}
