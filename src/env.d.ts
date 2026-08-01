/// <reference types="astro/client" />

declare namespace App {
  interface Locals {
    /** Locale resolved from the URL prefix by src/middleware.ts */
    locale: import("./i18n/config").Locale;
  }
}