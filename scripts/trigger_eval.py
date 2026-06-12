#!/usr/bin/env python3
"""Ecological trigger evaluation for DEPLOYED wzrdxOS skills.

Unlike the vendored skill-creator runner (which clones a skill under a hashed
name and assumes a clean environment), this measures whether a query triggers
the REAL deployed skill (`wzrdx-<dept>-<name>`) in the REAL environment — with
all other installed skills competing. That is the production condition, and
near-miss queries measure true false-positives.

Usage:
  python3 scripts/trigger_eval.py \
    --eval-set artifacts/skills/ops/roadmap-diagnose/evals/trigger_eval.json \
    --skill wzrdx-ops-roadmap-diagnose \
    [--runs 2] [--workers 6] [--timeout 60] [--model sonnet]

Output: JSON to stdout — {skill, results: [{query, should_trigger, triggers,
runs, trigger_rate, pass, fired_others}], summary}.
"""

from __future__ import annotations

import argparse
import json
import os
import shutil
import subprocess
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed


def run_once(query: str, target: str, timeout: int, model: str | None) -> tuple[bool, list[str]]:
    """Run one claude -p; return (target_triggered, other_skills_fired)."""
    cmd = ["claude", "-p", query, "--output-format", "stream-json", "--verbose"]
    if model:
        cmd += ["--model", model]
    env = {k: v for k, v in os.environ.items() if k != "CLAUDECODE"}
    proc = subprocess.Popen(
        cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, env=env, text=True
    )
    fired: list[str] = []
    hit = False
    start = time.time()
    try:
        assert proc.stdout is not None
        for line in proc.stdout:
            if time.time() - start > timeout:
                break
            line = line.strip()
            if not line:
                continue
            try:
                event = json.loads(line)
            except json.JSONDecodeError:
                continue
            if event.get("type") != "assistant":
                continue
            for block in event.get("message", {}).get("content") or []:
                if block.get("type") == "tool_use" and block.get("name") == "Skill":
                    skill = str((block.get("input") or {}).get("skill", ""))
                    if skill == target:
                        hit = True
                    else:
                        fired.append(skill)
            if hit:
                break  # early exit: decision made
    finally:
        proc.kill()
    return hit, fired


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--eval-set", required=True)
    ap.add_argument("--skill", required=True, help="deployed skill name, e.g. wzrdx-ops-roadmap-diagnose")
    ap.add_argument("--runs", type=int, default=2)
    ap.add_argument("--workers", type=int, default=6)
    ap.add_argument("--timeout", type=int, default=60)
    ap.add_argument("--model", default="sonnet")
    ap.add_argument("--threshold", type=float, default=0.5)
    args = ap.parse_args()

    if shutil.which("claude") is None:
        sys.exit(
            "fatal: `claude` not found on PATH — every run would silently count as "
            "no-trigger. Fix PATH (e.g. include ~/.local/bin) and retry."
        )

    items = json.loads(open(args.eval_set).read())
    jobs = [(i, r) for i, item in enumerate(items) for r in range(args.runs)]
    hits: dict[int, int] = {i: 0 for i in range(len(items))}
    others: dict[int, list[str]] = {i: [] for i in range(len(items))}

    with ThreadPoolExecutor(max_workers=args.workers) as ex:
        futs = {
            ex.submit(run_once, items[i]["query"], args.skill, args.timeout, args.model): i
            for i, _ in jobs
        }
        done = 0
        for fut in as_completed(futs):
            i = futs[fut]
            try:
                hit, fired = fut.result()
            except Exception as e:  # noqa: BLE001 — record and continue
                print(f"[warn] run error q{i}: {e}", file=sys.stderr)
                hit, fired = False, []
            if hit:
                hits[i] += 1
            others[i].extend(fired)
            done += 1
            print(f"[{done}/{len(jobs)}]", file=sys.stderr)

    results = []
    for i, item in enumerate(items):
        rate = hits[i] / args.runs
        should = bool(item["should_trigger"])
        ok = rate >= args.threshold if should else rate < args.threshold
        results.append(
            {
                "query": item["query"],
                "should_trigger": should,
                "triggers": hits[i],
                "runs": args.runs,
                "trigger_rate": rate,
                "pass": ok,
                "fired_others": sorted(set(others[i])),
            }
        )

    tp = [r for r in results if r["should_trigger"]]
    tn = [r for r in results if not r["should_trigger"]]
    summary = {
        "skill": args.skill,
        "should_trigger_pass": sum(1 for r in tp if r["pass"]),
        "should_trigger_total": len(tp),
        "should_not_pass": sum(1 for r in tn if r["pass"]),
        "should_not_total": len(tn),
    }
    print(json.dumps({"skill": args.skill, "results": results, "summary": summary}, indent=2))


if __name__ == "__main__":
    main()
