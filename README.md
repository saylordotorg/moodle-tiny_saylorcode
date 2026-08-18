# Saylor Code Studio — editor button (`tiny_saylorcode`)

TinyMCE plugin that inserts a Saylor Code Studio exercise reference into course content, so
authors don't have to remember the token syntax or type it correctly by hand.

**Status: alpha, Phase 1 vertical slice.**

## Requirements

| | |
|---|---|
| Moodle | 4.5 (build 2024100700) |
| PHP | 8.1 – 8.3 |
| Depends on | `local_saylorcode`, and `filter_saylorcode` to render what it inserts |

## What it does

Adds a toolbar button and an Insert menu item. The dialogue asks for the exercise ID and how it
should appear, then writes a well-formed token into the content:

```
[[saylorcode:exercise=CS101-U05-E03;mode=compact;version=latest]]
```

| Field | Notes |
|---|---|
| Exercise ID | Validated before insertion |
| Presentation | Compact, full, or link only |
| Version | `latest`, or a number to pin |
| Height | Only the values the filter accepts |
| Show instructions | On by default |

## Two things worth knowing

**The validation pattern comes from the server.** `plugininfo::get_plugin_configuration_for_context()`
hands the JavaScript the same regular expression `stable_id` enforces, with the PCRE delimiters
stripped. It is shared rather than retyped so the two checks cannot drift apart — a client-side
rule that disagrees with the server is worse than no rule, because it teaches authors the wrong
format.

**Hiding the button is convenience, not access control.** `is_enabled()` checks
`local/saylorcode:viewlibrary` so the button only appears for people who work with the library.
That is *not* a security boundary: a token typed by hand is treated exactly the same, and the
filter re-validates every reference when it renders. The real controls live in the filter and in
the activity.

## Why validate at all, if the filter is strict?

Because the failure is silent otherwise. A malformed reference looks fine to the author in the
editor, and renders as nothing for the student — the filter deliberately hides broken tokens
from people who can't fix them. Catching it at insertion is the difference between a typo and a
missing exercise nobody notices until a learner reports it.

## Development

The compiled AMD modules in `amd/build/` are generated with `grunt amd` against a
`MOODLE_405_STABLE` checkout and committed, as Moodle requires.

## Licence

GPL-3.0-or-later, matching Moodle.
