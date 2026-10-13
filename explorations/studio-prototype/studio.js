// The Studio's Pack page, prototype. A classic script with no build step and no request: a
// browser refuses a module script on a page opened through file://.
//
// Two halves, split the way the product's build lanes split:
//   1. The template. It turns recipe 29's answer and the Pack context into the page's markup.
//      In the product the build writes this markup at publish time and the page needs no script
//      to read it; here the script stands in for the build.
//   2. The elements. sdp-expander and sdp-copy enhance markup that is already on the page, as the
//      page elements Spec designs them.
(function () {
  "use strict";

  /* ------------------------------------------------------------------------------------------ */
  /* 1. The template                                                                              */
  /* ------------------------------------------------------------------------------------------ */

  var RUNGS = ["idea", "scoped", "defined", "ready"];

  function esc(value) {
    return String(value).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // The page-set path rule: the id after its namespace, each uppercase ASCII letter written as
  // `_` and its lowercase.
  function pageName(id) {
    return id.slice(id.indexOf(":") + 1).replace(/[A-Z]/g, function (c) {
      return "_" + c.toLowerCase();
    });
  }

  // Links are written as they would be from `packs/<name>.html`. This prototype holds only the
  // Pack page, so a link to a Spec page does not resolve here.
  function specHref(address) {
    var hash = address.indexOf("#");
    var id = hash === -1 ? address : address.slice(0, hash);
    return "../specs/" + pageName(id) + ".html" + (hash === -1 ? "" : "#" + address.slice(hash + 1));
  }

  function cardHref(id) {
    return "#" + id;
  }

  // A mention: `spec:` after a character that is not a letter, digit or `-`, ending before
  // trailing punctuation, close to the prose-mentions validator's token rule.
  var MENTION = /(^|[^A-Za-z0-9-])(spec:[A-Za-z0-9.#-]*[A-Za-z0-9])/g;

  function linkMentions(html) {
    return html.replace(MENTION, function (_match, before, id) {
      return before + '<a href="' + esc(specHref(id)) + '">' + id + "</a>";
    });
  }

  // Authored text: plain text, inline code spans as code, mentions as links, nothing else read.
  function inline(text) {
    var out = "";
    var re = /`([^`]+)`/g;
    var last = 0;
    var match;
    while ((match = re.exec(text)) !== null) {
      out += linkMentions(esc(text.slice(last, match.index)));
      out += "<code>" + linkMentions(esc(match[1])) + "</code>";
      last = re.lastIndex;
    }
    return out + linkMentions(esc(text.slice(last)));
  }

  function prose(text) {
    return text
      .split(/\n\s*\n/)
      .map(function (paragraph) {
        return "<p>" + inline(paragraph) + "</p>";
      })
      .join("");
  }

  function count(n, one, many) {
    return n === 0 ? "no " + many : n + " " + (n === 1 ? one : many);
  }

  function capital(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  function rungBadge(rung) {
    return rung === null || rung === undefined || rung === "none"
      ? '<span class="badge">no rung</span>'
      : '<span class="badge rung-' + esc(rung) + '">' + esc(rung) + "</span>";
  }

  // The stated rung as the one colored badge, the floor beside it in words, and the warning color
  // only on the divergence, beside its words.
  function stated(rung, floor) {
    var diverges = RUNGS.indexOf(floor) < RUNGS.indexOf(rung);
    return (
      rungBadge(rung) +
      ' <span class="kind">floor ' +
      esc(floor) +
      "</span>" +
      (diverges ? ' <span class="badge diverges">stated above its floor</span>' : "")
    );
  }

  // The next rung in words, or null when the member states ready and has none.
  function nextRung(member) {
    if (member.statedNextRung === null) return null;
    var n = member.statedNextRungFailures.length;
    return n === 0
      ? "nothing blocks " + member.statedNextRung
      : "waits on " + count(n, "unmet clause", "unmet clauses") + " for " + member.statedNextRung;
  }

  function copy(text) {
    return '<code>' + esc(text) + '</code><sdp-copy text="' + esc(text) + '"></sdp-copy>';
  }

  function target(t) {
    return '<a href="' + esc(specHref(t.id)) + '">' + esc(t.id) + "</a> " + rungBadge(t.statedReadiness);
  }

  function clauses(failures) {
    return (
      '<ul class="plain-list">' +
      failures
        .map(function (f) {
          var targets = f.targets && f.targets.length > 0
            ? '<br><span class="field"><b>Targets:</b> ' + f.targets.map(target).join(", ") + "</span>"
            : "";
          return "<li>" + inline(f.description) + " <code>" + esc(f.clauseId) + "</code>" + targets + "</li>";
        })
        .join("") +
      "</ul>"
    );
  }

  function unit(u, label) {
    var c = u.component;
    return (
      "<li><code>" +
      esc(u.id) +
      "</code>" +
      (label ? " — " + inline(label) : "") +
      (u.file
        ? ' <span class="loc">' + copy(u.file + (u.line === null ? "" : ":" + u.line)) + "</span>"
        : " <span class=\"floor\">no recorded file</span>") +
      (u.role ? ' <span class="field"><b>Role:</b> <code>' + esc(u.role) + "</code>" : '<span class="field">') +
      (c
        ? " <b>Component:</b> <code>" +
          esc(c.id) +
          "</code>" +
          (c.layer || c.context
            ? " (" + [c.layer && "layer " + esc(c.layer), c.context && "context " + esc(c.context)].filter(Boolean).join(", ") + ")"
            : "")
        : "") +
      "</span></li>"
    );
  }

  function units(list, labels, none) {
    if (list.length === 0) return '<p class="floor">' + none + "</p>";
    return '<ul class="units">' + list.map(function (u) { return unit(u, labels[u.id]); }).join("") + "</ul>";
  }

  function question(q, fields) {
    var f = fields || {};
    var lines = [];
    if (f.decider) lines.push("<b>Decider:</b> " + esc(f.decider));
    if (f.links && f.links.length > 0) {
      lines.push(
        "<b>Links:</b> " +
          f.links
            .map(function (l) {
              return '<a href="' + esc(specHref(l)) + '">' + esc(l) + "</a>";
            })
            .join(", "),
      );
    }
    if (f.provisional) lines.push("<b>Provisional:</b> " + inline(f.provisional));
    if (f.trigger) lines.push("<b>Trigger:</b> " + inline(f.trigger));
    return (
      "<li>" +
      '<span class="badge' + (q.blocking ? " held" : "") + '">' + (q.blocking ? "blocking" : "non-blocking") + "</span> " +
      (q.address
        ? '<a href="' + esc(specHref(q.address)) + '"><code>' + esc(q.address.slice(q.address.indexOf("#") + 1)) +
          '</code></a><sdp-copy text="' + esc(q.address) + '"></sdp-copy> '
        : "") +
      (q.line === null ? "" : '<span class="floor">line ' + q.line + "</span>") +
      "<div>" + inline(q.question) + "</div>" +
      lines.map(function (l) { return '<span class="field">' + l + "</span>"; }).join("") +
      "</li>"
    );
  }

  function verifierCounts(member) {
    var parts = [];
    if (member.verifiers.total > 0) {
      parts.push(count(member.verifiers.total, "verifier", "verifiers") + ", " + member.verifiers.enabled + " enabled");
    }
    if (member.examples.total > 0) {
      parts.push(count(member.examples.total, "verifying example", "verifying examples") + ", " + member.examples.enabled + " enabled");
    }
    return parts.length === 0 ? "" : ": " + parts.join("; ");
  }

  function card(member, position, context) {
    var id = member.id;
    if (!member.resolved) {
      return (
        '<details class="card" id="' + esc(id) + '"><summary><span class="line1">' + position + ". <code>" + esc(id) +
        "</code></span></summary><div class=\"card-body\"><p>The manifest names an id the graph does not hold.</p></div></details>"
      );
    }
    var facts = context.deliveryFacts || [];
    var implementation = facts.indexOf("implemented") !== -1 ? "present" : "none";
    var verifier = facts.indexOf("has-verifier") !== -1 ? "present" : "none";
    var next = nextRung(member);
    var d = member.design;
    var questionsText =
      d.openQuestions === 0
        ? "no open questions"
        : count(d.openQuestions, "open question", "open questions") + ", " + (d.blockingQuestions === 0 ? "none" : d.blockingQuestions) + " blocking";
    var labels = {};
    (context.implementations || []).concat(context.references || []).forEach(function (b) {
      if (b.label) labels[b.codeId] = b.label;
    });
    var fieldsByLine = {};
    ((context.design && context.design.openQuestions) || []).forEach(function (q) {
      fieldsByLine[q.index] = q;
    });
    var decisionTitles = {};
    ((context.design && context.design.decisions) || []).forEach(function (dd) {
      decisionTitles[dd.id] = dd.title;
    });

    var nextBody =
      member.statedNextRung === null
        ? "<p>States ready, so it has no next rung.</p>"
        : member.statedNextRungFailures.length === 0
          ? "<p><b>" + esc(member.statedNextRung) + ":</b> nothing blocks. The floor already holds it, so it waits only for its author's statement.</p>"
          : "<p><b>" + esc(member.statedNextRung) + "</b> waits on " +
            count(member.statedNextRungFailures.length, "unmet clause", "unmet clauses") + ":</p>" +
            clauses(member.statedNextRungFailures);

    var decisions =
      member.decisions.length === 0
        ? ""
        : "<p><b>Decided by:</b> " +
          member.decisions
            .map(function (dd) {
              return dd.resolved
                ? '<a href="' + esc(specHref(dd.id)) + '">' + esc(decisionTitles[dd.id] || dd.id) + "</a> " + rungBadge(dd.statedReadiness)
                : "<code>" + esc(dd.id) + "</code> (not in the graph)";
            })
            .join(", ") +
          "</p>";

    return (
      '<details class="card" id="' + esc(id) + '">' +
      "<summary>" +
      '<span class="line1">' + position + ". " + esc(member.title || id) + "</span>" +
      '<span class="line2">' +
      [
        '<span class="kind">' + esc(member.specKind) + "</span>",
        stated(member.statedReadiness, member.floorReached),
        next === null ? null : '<span class="kind">' + esc(next) + "</span>",
        '<span class="kind">' + esc(questionsText) + "</span>",
        '<span class="kind">implementation ' + implementation + "</span>",
        '<span class="kind">verifier ' + verifier + "</span>",
      ]
        .filter(Boolean)
        .join('<span class="sep" aria-hidden="true">·</span>') +
      "</span></summary>" +
      '<div class="card-body">' +
      '<p class="ids"><a href="' + esc(specHref(id)) + '"><code>' + esc(id) + "</code></a><sdp-copy text=\"" + esc(id) + "\"></sdp-copy></p>" +
      "<h3>Next rung</h3>" + nextBody +
      "<h3>Design</h3><p>" +
      capital(count(d.entries, "Design or UI entry", "Design and UI entries")) + ", " +
      count(d.declarations, "pinned declaration", "pinned declarations") + ", " +
      questionsText + ".</p>" + decisions +
      (member.questions.length === 0
        ? ""
        : "<h3>Open questions</h3><ol class=\"questions\">" +
          member.questions.map(function (q, i) { return question(q, fieldsByLine[i]); }).join("") +
          "</ol>") +
      "<h3>Code</h3>" +
      "<p><b>Implementation binding:</b> " + implementation + "</p>" +
      units(member.implementedBy, labels, "No unit realizes it.") +
      "<p><b>Design references:</b> " + (member.referencedBy.length === 0 ? "none" : "present") + "</p>" +
      units(member.referencedBy, labels, "No unit answers to its design.") +
      "<h3>Verification</h3>" +
      "<p><b>Verifier binding:</b> " + verifier + verifierCounts(member) + ".</p>" +
      "</div></details>"
    );
  }

  function boundarySection(title, rows, membersById, verb) {
    var body =
      rows.length === 0
        ? "<p>None.</p>"
        : '<div class="table-scroll"><table><thead><tr><th scope="col">Spec</th><th scope="col">Stated</th><th scope="col">Implementation</th><th scope="col">' +
          esc(verb) +
          "</th></tr></thead><tbody>" +
          rows
            .map(function (row) {
              return (
                "<tr><td>" + '<a href="' + esc(specHref(row.id)) + '">' + esc(row.title || row.id) + "</a><br><code>" + esc(row.id) + "</code></td>" +
                "<td>" + rungBadge(row.statedReadiness) + "</td>" +
                "<td>" + (row.implemented ? "present" : "none") + "</td>" +
                "<td>" +
                row.via
                  .map(function (v) {
                    return "<b>" + esc(v.type) + ":</b> " + v.members
                      .map(function (m) {
                        return '<a href="' + esc(cardHref(m)) + '">' + esc((membersById[m] && membersById[m].title) || m) + "</a>";
                      })
                      .join(", ");
                  })
                  .join("<br>") +
                "</td></tr>"
              );
            })
            .join("") +
          "</tbody></table></div>";
    return (
      '<details class="section" id="boundary-' + esc(title.toLowerCase().replace(/ /g, "-")) + '"><summary>' + esc(title) +
      " (" + rows.length + ")</summary><div class=\"section-body\">" + body + "</div></details>"
    );
  }

  function renderPack(design, context) {
    var t = design.totals;
    var contextById = {};
    context.members.forEach(function (m) { contextById[m.id] = m; });
    var membersById = {};
    design.members.forEach(function (m) { membersById[m.id] = m; });
    var resolved = design.members.filter(function (m) { return m.resolved; });
    var errors = context.findings.filter(function (f) { return f.severity === "error"; }).length;
    var warnings = context.findings.length - errors;
    var link = function (m) { return '<a href="' + esc(cardHref(m.id)) + '">' + esc(m.title || m.id) + "</a>"; };
    var held = resolved.filter(function (m) { return m.statedNextRungFailures.length > 0; });
    var waiting = resolved.filter(function (m) { return m.statedNextRung !== null && m.statedNextRungFailures.length === 0; });

    // Each Pack total in one sentence that opens with its count, a zero written as No. The held
    // sentence links each held member to its card; the waiting sentence names its members unless
    // every member waits.
    var summary = [
      count(t.members, "member", "members") + (t.unresolved === 0 ? ", all in the graph." : ", " + t.unresolved + " of them not in the graph."),
      held.length === 0
        ? "No member is held below its stated next rung."
        : count(t.heldBelowNextRung, "member", "members") + " held below " + (t.heldBelowNextRung === 1 ? "its" : "their") + " stated next rung: " +
          held
            .map(function (m) { return link(m) + " (" + count(m.statedNextRungFailures.length, "unmet clause", "unmet clauses") + ")"; })
            .join(", ") + ".",
      t.waitingForAuthor === 0
        ? "No member waits only for its author's statement."
        : t.waitingForAuthor === t.members
          ? "All " + t.members + " members wait only for their author's statement."
          : count(t.waitingForAuthor, "member waits", "members wait") + " only for " + (t.waitingForAuthor === 1 ? "its" : "their") +
            " author's statement: " + waiting.map(link).join(", ") + ".",
      t.entries === 0
        ? "No Design or UI entries."
        : count(t.entries, "Design or UI entry", "Design and UI entries") + ", " + (t.declarations === 0 ? "none" : t.declarations) + " of them pinned declarations.",
      t.openQuestions === 0
        ? "No open questions."
        : count(t.openQuestions, "open question", "open questions") + ", " + (t.blockingQuestions === 0 ? "none" : t.blockingQuestions) + " blocking.",
      count(t.withImplementations, "member has", "members have") + " an implementation binding; " +
        (t.withReferences === 0 ? "none has" : t.withReferences + (t.withReferences === 1 ? " has" : " have")) + " a design reference.",
      count(t.restsOn, "outside Spec the Pack rests on", "outside Specs the Pack rests on") + "; " +
        (t.restedOnBy === 0 ? "none rests" : t.restedOnBy + (t.restedOnBy === 1 ? " rests" : " rest")) + " on it; " +
        (t.verifiedBy === 0 ? "none verifies" : t.verifiedBy + (t.verifiedBy === 1 ? " verifies" : " verify")) + " a member; " +
        (t.supersededBy === 0 ? "none supersedes" : t.supersededBy + (t.supersededBy === 1 ? " supersedes" : " supersede")) + " one.",
      errors === 0 && warnings === 0
        ? "No errors and no warnings name the Pack."
        : count(errors, "error", "errors") + " and " + count(warnings, "warning", "warnings") + " name the Pack.",
    ];

    var gaps = context.verifierGaps.slice().sort(function (a, b) { return (b.priority ? 1 : 0) - (a.priority ? 1 : 0); });

    var html =
      '<header class="page-head">' +
      '<p class="eyebrow">Pack</p>' +
      "<h1>" + esc(design.title || design.id) + "</h1>" +
      '<p class="ids"><span>' + copy(design.id) + "</span><span>" + copy(context.file) + "</span></p>" +
      "</header>" +
      '<sdp-expander>' +
      '<section id="summary" aria-labelledby="summary-h"><h2 id="summary-h">Where the design stands</h2><ul class="summary">' +
      summary.map(function (s) { return "<li>" + capital(s) + "</li>"; }).join("") +
      "</ul></section>" +
      (context.framing || context.modelRefs.length > 0
        ? '<section id="framing" aria-labelledby="framing-h"><h2 id="framing-h">Framing</h2>' +
          (context.framing ? '<div class="prose">' + prose(context.framing) + "</div>" : "") +
          (context.modelRefs.length === 0
            ? ""
            : "<p><b>Vocabulary:</b> " + context.modelRefs.map(function (r) { return '<a href="' + esc(specHref(r)) + '">' + esc(r) + "</a>"; }).join(", ") + "</p>") +
          "</section>"
        : "") +
      '<section id="members" aria-labelledby="members-h"><h2 id="members-h">Members, in reading order</h2>' +
      design.members.map(function (m, i) { return card(m, i + 1, contextById[m.id] || {}); }).join("") +
      "</section>" +
      '<section id="boundary" aria-labelledby="boundary-h"><h2 id="boundary-h">Outside the Pack</h2>' +
      "<p>Specs outside the Pack joined to a member by an authored relation. The Pack rests on a Spec a member refines, depends on, is constrained by or decided by, and is rested on by a Spec that relates to a member the same ways.</p>" +
      boundarySection("Rests on", design.boundary.restsOn, membersById, "Members that rest on it") +
      boundarySection("Rested on by", design.boundary.restedOnBy, membersById, "Members it rests on") +
      boundarySection("Verified by", design.boundary.verifiedBy, membersById, "Members it verifies") +
      boundarySection("Superseded by", design.boundary.supersededBy, membersById, "Members it supersedes") +
      "</section>" +
      '<section id="gaps" aria-labelledby="gaps-h"><h2 id="gaps-h">Members with no verifier binding</h2>' +
      "<p>The graph records bindings, never runs, so no page shows a run result.</p>" +
      (gaps.length === 0
        ? "<p>Every member has a verifier binding.</p>"
        : '<ul class="plain-list">' +
          gaps.map(function (g) { return "<li>" + link(membersById[g.id] || { id: g.id }) + " " + rungBadge(g.statedReadiness) + (g.priority ? " <b>stated ready</b>" : "") + "</li>"; }).join("") +
          "</ul>") +
      "</section>" +
      '<section id="findings" aria-labelledby="findings-h"><h2 id="findings-h">Findings that name the Pack</h2>' +
      (context.findings.length === 0
        ? "<p>None.</p>"
        : '<ul class="plain-list">' +
          context.findings.map(function (f) { return "<li><b>" + esc(f.severity) + "</b> <code>" + esc(f.validatorId) + "</code> " + inline(f.message) + "</li>"; }).join("") +
          "</ul>") +
      "</section>" +
      "</sdp-expander>";

    var rail =
      '<h2 id="rail-members">Members</h2><ol aria-labelledby="rail-members">' +
      design.members
        .map(function (m) {
          return "<li>" + link(m) + (m.resolved ? " " + rungBadge(m.statedReadiness) : "") + "</li>";
        })
        .join("") +
      "</ol>" +
      '<h2 id="rail-findings">Findings</h2><p><a href="#findings">' + capital(count(errors, "error", "errors")) + ", " + count(warnings, "warning", "warnings") + "</a> name this Pack.</p>";

    return { html: html, rail: rail };
  }

  /* ------------------------------------------------------------------------------------------ */
  /* 2. The elements                                                                              */
  /* ------------------------------------------------------------------------------------------ */

  function liveRegion() {
    var span = document.createElement("span");
    span.className = "visually-hidden";
    span.setAttribute("aria-live", "polite");
    return span;
  }

  function button(label) {
    var b = document.createElement("button");
    b.type = "button";
    b.textContent = label;
    return b;
  }

  // sdp-expander: Open all and Close all for the details inside it, and the details that hold the
  // fragment's target open on load and on each fragment change.
  class SdpExpander extends HTMLElement {
    connectedCallback() {
      if (this.dataset.ready) return;
      this.dataset.ready = "true";
      var self = this;
      var bar = document.createElement("div");
      bar.className = "toolbar";
      var open = button("Open all");
      var close = button("Close all");
      var live = liveRegion();
      open.addEventListener("click", function () {
        self.querySelectorAll("details").forEach(function (d) { d.open = true; });
        live.textContent = "Every card and section is open.";
      });
      close.addEventListener("click", function () {
        self.querySelectorAll("details").forEach(function (d) { d.open = false; });
        live.textContent = "Every card and section is closed.";
      });
      bar.append(open, close, live);
      var members = this.querySelector("#members h2");
      (members ? members.parentNode : this).insertBefore(bar, members ? members.nextSibling : this.firstChild);
      function reveal() {
        var id = decodeURIComponent(location.hash.slice(1));
        if (id === "") return;
        var target = document.getElementById(id);
        if (target === null || !self.contains(target)) return;
        for (var node = target; node !== null && node !== self; node = node.parentElement) {
          if (node.tagName === "DETAILS") node.open = true;
        }
        target.scrollIntoView();
      }
      window.addEventListener("hashchange", reveal);
      reveal();
    }
  }

  // sdp-copy: a Copy button for its text; where the clipboard is unavailable it selects the text
  // the build wrote beside it.
  class SdpCopy extends HTMLElement {
    connectedCallback() {
      if (this.dataset.ready) return;
      this.dataset.ready = "true";
      var text = this.getAttribute("text") || "";
      var self = this;
      var b = button("Copy");
      b.setAttribute("aria-label", "Copy " + text);
      var live = liveRegion();
      function selectBeside() {
        var shown = self.previousElementSibling;
        if (shown === null) return;
        var range = document.createRange();
        range.selectNodeContents(shown);
        var selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        live.textContent = "Selected " + text + "; copy it with your keyboard.";
      }
      b.addEventListener("click", function () {
        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard.writeText(text).then(function () {
            b.textContent = "Copied";
            live.textContent = "Copied " + text;
            setTimeout(function () { b.textContent = "Copy"; }, 1500);
          }, selectBeside);
        } else {
          selectBeside();
        }
      });
      this.append(b, live);
    }
  }

  /* ------------------------------------------------------------------------------------------ */
  /* The prototype's bootstrap: render once, then define the elements so they upgrade the markup.  */
  /* ------------------------------------------------------------------------------------------ */

  var input = window.SDP_PROTOTYPE;
  var main = document.getElementById("main");
  if (!input || !main) return;
  var page = renderPack(input.design, input.context);
  document.title = (input.design.title || input.design.id) + " · Pack · Spec Studio prototype";
  main.innerHTML = page.html;
  document.getElementById("rail").innerHTML = page.rail;
  customElements.define("sdp-expander", SdpExpander);
  customElements.define("sdp-copy", SdpCopy);
})();
