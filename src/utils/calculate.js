// ── Basic Interest Calculation ──────────────────────────────────────────────
export function calculateInterest(type, principal, rate, time, frequency) {
  const p = parseFloat(principal);
  const r = parseFloat(rate) / 100;
  const t = parseFloat(time);
  if (!p || !r || !t) return null;

  let interest, total, breakdown = [];

  if (type === "simple") {
    interest = p * r * t;
    total = p + interest;
    for (let i = 1; i <= t; i++)
      breakdown.push({ year: `Y${i}`, amount: +(p + p * r * i).toFixed(2) });
  } else {
    const n = frequency;
    total = p * Math.pow(1 + r / n, n * t);
    interest = total - p;
    for (let i = 1; i <= t; i++)
      breakdown.push({ year: `Y${i}`, amount: +(p * Math.pow(1 + r / n, n * i)).toFixed(2) });
  }

  return {
    principal: p,
    interest: +interest.toFixed(2),
    total: +total.toFixed(2),
    breakdown,
  };
}

// ── Advanced: EMI Calculator ─────────────────────────────────────────────────
export function calculateEMI(principal, annualRate, tenureMonths) {
  const p = parseFloat(principal);
  const r = parseFloat(annualRate) / 100 / 12;
  const n = parseFloat(tenureMonths);
  if (!p || !r || !n) return null;

  const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
  const totalPayment = emi * n;
  const totalInterest = totalPayment - p;

  const breakdown = [];
  let balance = p;
  for (let i = 1; i <= Math.min(n, 60); i++) {
    const interestPart = balance * r;
    const principalPart = emi - interestPart;
    balance -= principalPart;
    breakdown.push({
      year: `M${i}`,
      amount: +Math.max(balance, 0).toFixed(2),
    });
  }

  return {
    emi: +emi.toFixed(2),
    totalPayment: +totalPayment.toFixed(2),
    totalInterest: +totalInterest.toFixed(2),
    principal: p,
    breakdown,
  };
}

// ── Advanced: Inflation-Adjusted Return ─────────────────────────────────────
export function calculateRealReturn(nominalRate, inflationRate, years) {
  const r = parseFloat(nominalRate) / 100;
  const inf = parseFloat(inflationRate) / 100;
  const t = parseFloat(years);
  if (!r || !inf || !t) return null;

  // Fisher equation: real rate = (1 + nominal) / (1 + inflation) - 1
  const realRate = (1 + r) / (1 + inf) - 1;
  const breakdown = [];
  for (let i = 1; i <= t; i++) {
    breakdown.push({
      year: `Y${i}`,
      amount: +(Math.pow(1 + realRate, i) * 100).toFixed(2), // as % of principal
    });
  }

  return {
    realRate: +(realRate * 100).toFixed(3),
    nominalRate: +(r * 100).toFixed(2),
    inflationRate: +(inf * 100).toFixed(2),
    breakdown,
  };
}

// ── Advanced: Goal-Based Calculator ─────────────────────────────────────────
export function calculateGoalSIP(targetAmount, annualRate, years) {
  const target = parseFloat(targetAmount);
  const r = parseFloat(annualRate) / 100 / 12;
  const n = parseFloat(years) * 12;
  if (!target || !r || !n) return null;

  // SIP formula: P = FV * r / ((1+r)^n - 1)
  const monthlyInvestment = (target * r) / (Math.pow(1 + r, n) - 1);
  const totalInvested = monthlyInvestment * n;
  const totalGains = target - totalInvested;

  const breakdown = [];
  for (let i = 1; i <= years; i++) {
    const months = i * 12;
    const val = monthlyInvestment * ((Math.pow(1 + r, months) - 1) / r);
    breakdown.push({ year: `Y${i}`, amount: +val.toFixed(2) });
  }

  return {
    monthlyInvestment: +monthlyInvestment.toFixed(2),
    totalInvested: +totalInvested.toFixed(2),
    totalGains: +totalGains.toFixed(2),
    target,
    breakdown,
  };
}