# German Learning School: SEO / AEO / GEO strategy

Last updated: 28 September 2026. This is a working document for the site owner and future contributors.
**Verified** means checked on the live site or in the code. **Recommended** means planned and not yet built.

---

## 1. Rules that apply to every change

- One search intent = one URL. Expand the page that already owns an intent instead of creating a near-duplicate.
- No invented numbers, reviews, teachers, certificates, rankings or "most popular" labels.
- Visa, Ausbildung, university and recognition requirements must name the source (Make it in Germany, German Missions in Pakistan, Goethe-Institut, telc, ÖSD, TestDaF, state authorities). Use "normally", "often" or "depends on the authority" wherever the official wording does.
- A page with no real content (teachers, testimonials, gallery, books) stays `noindex`, stays out of the sitemap and is not linked from navigation. The code gates this in `src/lib/publicContent.js`. When real content is added, the page becomes indexable automatically; its navigation link has to be added back by hand (see the comments in `src/components/Navbar.jsx` and `src/components/Footer.jsx`).
- FAQ schema must match the visible FAQ word for word.

---

## 2. Keyword → URL map

The map is based on search intent. Search volumes and rankings are not included because no Search Console export exists yet (section 6).

### Cluster 1: German courses (commercial)
| Intent / example queries | URL | Status |
|---|---|---|
| german language course pakistan, german classes pakistan, online german classes pakistan | `/` (hub) + `/courses` | Verified: exists |
| german a1 course pakistan, german for beginners | `/courses/german-a1` | Verified: exists |
| german a2 course online | `/courses/german-a2` | Verified: exists |
| german b1 course pakistan (Ausbildung) | `/courses/german-b1` | Verified: exists |
| german b2 course online (study, work, medical base) | `/courses/german-b2` | Verified: exists |
| german a1 syllabus, what do you learn in a1 | `/german-a1-syllabus` | Verified: exists |
| جرمن زبان کورس پاکستان, آن لائن جرمن کلاسز (Urdu) | `/ur` | Verified: new |
| german course karachi / lahore / islamabad | `/` and `/ur` (FAQ and "online from any city") | **Do not create city pages.** The school is online-only, so city pages would be doorway pages. |

### Cluster 2: German exams
| Intent | URL | Status |
|---|---|---|
| goethe exam preparation pakistan | `/goethe-exam-preparation` | Verified: exists |
| telc exam preparation, telc b2 medizin | `/telc-exam-preparation`, `/blog/telc-b2-medizin-…` | Verified: exists |
| ösd exam preparation | `/osd-exam-preparation` | Verified: exists |
| testdaf preparation pakistan | `/testdaf-preparation` | Verified: exists |
| goethe vs telc vs testdaf vs ösd | `/blog/goethe-vs-telc-vs-testdaf-vs-osd-which-german-exam` | Verified: comparison pillar |
| goethe vs telc (Pakistan) | `/blog/goethe-vs-telc-which-german-exam-should-you-choose-in-pakistan` | Recommended: re-angle towards booking and logistics in Pakistan so it doesn't compete with the 4-way pillar |
| german practice test a1–b2 | `/practice-tests`, `/practice-tests/german-a1…b2` | Verified: exists |

### Cluster 3: Germany pathways (informational → course)
| Intent | URL | Status |
|---|---|---|
| german language requirements germany | `/german-language-requirements-germany` | Verified: pillar |
| german level for work visa / opportunity card | `/blog/what-german-level-do-you-need-for-a-germany-work-visa-a1-to-c1-explained` | Verified: sources and date added |
| germany visa documents from pakistan | `/blog/documents-required-for-a-germany-student-work-visa-from-pakistan-complete-checklist` | Verified: exists |
| german level for ausbildung | **Missing**: new article | Recommended (P1) |
| germany study visa german requirement + APS | **Missing**: new article | Recommended (P1) |
| spouse / family reunion visa german A1 | **Missing**: new article | Recommended (P1) |

### Cluster 4: Learning resources
| Intent | URL | Status |
|---|---|---|
| free german learning resources | `/resources` | Verified: exists |
| der die das practice | `/practice-tests/noun-builder` | Verified: exists |
| learn german in urdu | `/blog/learn-german-in-urdu` | Recommended: expand (197 words; needs an Urdu speaker) |
| how long to learn german a1 to b2 | `/blog/how-long-does-it-take-to-learn-german-from-a1-to-b2-a-realistic-timeline` | Verified: exists |

### Pages that should NOT be created
- City landing pages (Karachi, Lahore, Islamabad): doorway pages for an online-only school.
- Separate "fees" pages per level: fees belong on `/courses` and each level page.
- A second Goethe-vs-telc style comparison: consolidate into the existing two posts.
- Machine-translated Urdu copies of every English page (see section 4).

---

## 3. Editorial roadmap (priority order)

Every article needs: one intent, a short answer at the top, one H1, a logical H2/H3 structure, official sources and a "last reviewed" date, links to the relevant course, exam page and requirements guide, and no invented figures. Articles are published through Admin → Visa & Blog CMS, which gives each one Article and Breadcrumb schema and a canonical automatically.

1. **German level for Ausbildung (B1): what the visa requires and how to prepare**. Source: make-it-in-germany.com (visa for vocational training: "normally B1"). Links to `/courses/german-b1`, `/practice-tests/german-b1` and the requirements guide.
2. **Germany study visa from Pakistan: German language requirement and APS**. Sources: German Missions in Pakistan, DAAD, university pages. Links to `/testdaf-preparation`, `/courses/german-b2` and the visa documents checklist.
3. **Spouse / family reunion visa: the A1 German requirement and its exceptions**. Sources: German Missions in Pakistan, Make it in Germany. Links to `/courses/german-a1` and `/german-a1-syllabus`.
4. **How to book the Goethe / telc / ÖSD exam from Pakistan**. Better as a section on the three exam pages than as a new URL. Check the current centres on each official site first.
5. **Expand "Learn German in Urdu"**: pronunciation, 20 everyday phrases (German, Urdu, English), der/die/das. Needs an Urdu speaker.
6. **German A1→B2 roadmap**: already covered by the timeline post. Update that post rather than writing a new one.

Only start writing more after Search Console data shows which of these queries already get impressions.

---

## 4. Urdu SEO architecture

**Verified (implemented):**
- `/ur` is a server-rendered Urdu page (`app/ur/page.jsx`) with `lang="ur"`, `dir="rtl"`, an Urdu H1 and H2s, a canonical to `/ur`, hreflang `en` / `ur` / `x-default`, `og:locale` `ur_PK`, and FAQ schema that matches its visible FAQ.
- `/` declares the same hreflang set. Both URLs are in `sitemap.xml` with `xhtml:link` alternates.
- On `/`, the header's "اردو" button opens `/ur`. On `/ur`, "EN" and "DE" return to `/`. Every other page keeps the existing in-page language switch, so nothing else changes.
- `/ur` starts in Urdu on the server (`src/context/GlobalStateContext.jsx` reads the pathname), so the navigation is also Urdu with no hydration flash.

**Recommended next steps (only after `/ur` shows impressions in Search Console):**
1. Add `/ur/courses` (an Urdu summary of the levels with fees taken from the `courses` table), then `/ur/german-language-requirements-germany`.
2. Use the same pattern each time: `app/ur/<slug>/page.jsx`, hand-written Urdu, canonical to itself, hreflang pairing with the English URL, and a sitemap entry with alternates.
3. Have a native Urdu speaker review all Urdu copy. Don't machine-translate whole pages.
4. Leave client-side Urdu mode on the other pages as a reading aid. It is not indexable and doesn't need to be.

---

## 5. Page title review (12 titles over 70 characters)

The titles run 72–86 characters because the " | German Learning School" suffix is added to each. In every case the intent keywords (level, exam name, "Pakistan", "Germany visa") come within the first 60 characters, so search results cut off only the brand suffix.
**Decision: no changes.** Shortening them would gain little and would risk losing keywords. Revisit a title only if Search Console shows many impressions and a low CTR for it.

---

## 6. Search Console data engine

No `Queries.csv` or `Pages.csv` exists in the project yet, so query-level analysis has not been done. Nothing in this document is based on ranking or traffic data.

**Export steps:** Search Console → property `germanlearningschool.com` → Performance → Search results.
1. Date range: last 3 months (and last 28 days separately). Tick all four metrics: Clicks, Impressions, CTR, Position.
2. Click Export → Download CSV. The zip contains `Queries.csv`, `Pages.csv`, `Countries.csv`, `Devices.csv` and others.
3. Put the unzipped files in `Claude outputs/gsc/` (not committed to git).

**Analysis to run once the files exist:**
1. Queries at positions 4–20 with the most impressions: improve the page that owns them (short answer, title/description, internal links).
2. Queries with high impressions and CTR under 2%: rewrite the title and meta description.
3. Queries that land on the wrong page: fix internal links and anchors, or consolidate content.
4. Two URLs showing up for the same query (cannibalisation): merge or differentiate them.
5. Urdu and Roman-Urdu queries: decide whether `/ur/...` pages are worth building.
6. Branded vs non-branded split, and Pakistan vs other countries.

---

## 7. Open items needing the owner

- **Blog `updated_at`**: run `supabase/blog_posts_updated_at.sql` in the Supabase SQL editor. The code already uses the column once it exists.
- **Course bundle prices**: the "Save 10% / ₨8,000" style labels in `course_bundles` don't match the current bundle prices (for example ₨50,000 vs ₨77,000 would be a saving of ₨27,000). Update the prices or the labels in Admin. Not changed automatically, because prices are a business decision.
- **Homepage `stats` setting** ("Expert Faculty", "High Success"): not rendered anywhere at the moment. Replace it before it is ever shown.
- **Real content**: teacher profiles, consented testimonials, gallery photos and books. Each page becomes indexable automatically once it has genuine rows.
