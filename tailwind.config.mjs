/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Core palette driven by CSS variables for live dark/light switching
        graphite: 'var(--color-graphite)',
        'midnight-navy': 'var(--color-midnight-navy)',
        surface: 'var(--color-surface)',
        'elevated-surface': 'var(--color-elevated)',
        // Text
        'primary-text': 'var(--color-text-primary)',
        'secondary-text': 'var(--color-text-secondary)',
        'muted-text': 'var(--color-text-muted)',
        // Accents
        'electric-blue': 'var(--color-electric-blue)',
        'intelligence-cyan': 'var(--color-intelligence-cyan)',
        'research-violet': 'var(--color-research-violet)',
        // Semantic
        border: 'var(--color-border)',
        'border-subtle': 'var(--color-border-subtle)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '1rem' }],
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.6s ease-out forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'drift': 'drift 8s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        drift: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'grid-subtle': `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
      },
      backgroundSize: {
        'grid-sm': '32px 32px',
      },
      transitionTimingFunction: {
        'in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
      typography: (theme) => ({
        research: {
          css: {
            '--tw-prose-body': theme('colors.secondary-text'),
            '--tw-prose-headings': theme('colors.primary-text'),
            '--tw-prose-lead': theme('colors.secondary-text'),
            '--tw-prose-links': theme('colors.electric-blue'),
            '--tw-prose-bold': theme('colors.primary-text'),
            '--tw-prose-counters': theme('colors.muted-text'),
            '--tw-prose-bullets': theme('colors.muted-text'),
            '--tw-prose-hr': 'rgba(255,255,255,0.08)',
            '--tw-prose-quotes': theme('colors.secondary-text'),
            '--tw-prose-quote-borders': theme('colors.electric-blue'),
            '--tw-prose-captions': theme('colors.muted-text'),
            '--tw-prose-code': theme('colors.intelligence-cyan'),
            '--tw-prose-pre-code': theme('colors.primary-text'),
            '--tw-prose-pre-bg': theme('colors.surface'),
            '--tw-prose-th-borders': 'rgba(255,255,255,0.1)',
            '--tw-prose-td-borders': 'rgba(255,255,255,0.05)',
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
