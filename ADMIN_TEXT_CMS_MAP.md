# Admin Text CMS Map

The public text CMS adds optional Supabase overrides on top of `src/content/publicTranslations.js`.

## Fallback Logic

1. The public site renders static LV/EN/RU translations from code immediately.
2. The browser loads active rows from `public.site_texts`.
3. If `value_lv`, `value_en`, or `value_ru` exists for the current locale, that string replaces the matching static text key.
4. If a row is missing, inactive, reset to default, has no saved value for that locale, or Supabase is unavailable, the static translation remains visible.

Only string leaf values are overridden. Objects, arrays, and JavaScript functions stay in code.

## Admin Location

Open:

```text
/admin -> Teksti
```

The admin UI remains Latvian. Editable language fields are only:

```text
LV
EN
RU
```

## Text Groups

The editor groups public text keys into:

```text
common
header
hero
trust_strip
use_cases
benefits
product_overview
apvidus_feature
product_catalog
product_details
gallery
videos
order_steps
delivery_payment
about
partners
faq
contact
footer
cookies
legal_ui
scroll
```

## Editable

The text CMS is intended for public copy and UI strings, including:

```text
headings and subtitles
buttons and CTA labels
navigation labels
product descriptive copy
product detail text
gallery/video labels and fallback titles
FAQ questions and answers
contact/footer visible copy
cookie banner/settings labels
legal page UI titles/navigation labels
```

## Intentionally Not Editable

These stay in code or existing CMS tables:

```text
product prices
Stripe/payment buy URLs
checkout/payment logic
image, video, thumbnail, poster, and media paths
href/mailto/tel link targets
Cloudinary folders and upload logic
Supabase table/column names
legal document body source files
dynamic function-generated strings
```

Skipped dynamic functions include strings such as gallery counts and footer copyright year formatting. They remain in `src/content/publicTranslations.js` so existing call sites keep working.

## Supabase Notes

Run `supabase/admin_cms_schema.sql` once after this feature is deployed. It creates `public.site_texts`, the update trigger, and RLS policies. No seed is required for texts because the admin screen builds its editable list from the code definitions and only saves changed rows.
