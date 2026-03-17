# Memory: index.md
Updated: now

PromptNova AI - SaaS AI tools platform with Gemini API, Supabase auth, usage tracking, i18n

## Architecture
- Edge function `ai-generate` handles all AI tools with JWT auth + server-side credit enforcement
- Edge function `process-payment` handles bKash payment creation & verification (simulated for now)
- Uses LOVABLE_API_KEY (AI gateway), validates user session via getClaims()
- Auth: Supabase email/password with AuthProvider context
- DB: profiles, usage_tracking (unified credits), generation_history, referrals, daily_rewards, payments tables with RLS
- i18n: English + Bangla (landing page + dashboard translations)

## Credit System (Unified)
- Free users: 5 credits/day (across all tools) + bonus_credits
- Pro users: 999 credits/day (effectively unlimited)
- 1 credit per AI action, enforced server-side in edge function
- Frontend uses useCredits() hook for display only
- Referral bonus: +20 credits per referral

## Payment System
- Simulated bKash flow: create payment → user sends money → enter transaction ID → server verifies → upgrades to pro
- Server-side verification only (process-payment edge function uses service_role_key)
- Payment history stored in payments table

## Security
- JWT validated in edge function via getClaims()
- Credit check/deduction happens server-side before AI call
- Frontend sends session access_token (not anon key)
- RLS on all user-facing tables
- Payment verification server-side only, prevents fake upgrades

## Design
- Dark mode, neon purple (#7c3aed / 259 75% 62%) + cyan (#06b6d4 / 187 92% 43%)
- Glassmorphism cards, Inter font, semantic tokens only
- Support email: aipromptnova@gmail.com
