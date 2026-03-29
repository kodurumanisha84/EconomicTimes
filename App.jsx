import { useState } from "react";

export default function App() {
  const [transactions, setTransactions] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [sla, setSla] = useState([]);

  const [results, setResults] = useState([]);
  const [savings, setSavings] = useState(0);
  const [executed, setExecuted] = useState([]);

  // ---------- AI ENGINE ----------
  const analyze = () => {
    let issues = [];
    let totalSavings = 0;

    // Duplicate Detection
    let seen = {};
    transactions.forEach((t) => {
      if (!t.vendor || !t.amount) return;
      const key = t.vendor + t.amount;

      if (seen[key]) {
        issues.push({
          issue: "Duplicate Transaction",
          reason: `Duplicate payment to ${t.vendor}`,
          confidence: "90%",
          impact: Number(t.amount),
        });
        totalSavings += Number(t.amount);
      } else {
        seen[key] = true;
      }
    });

    // Subscription Optimization
    subscriptions.forEach((s) => {
      const allocated = Number(s.allocated || 0);
      const active = Number(s.active || 0);

      if (allocated > 0 && active / allocated < 0.1) {
        const loss = allocated * 100;

        issues.push({
          issue: "Underutilized Subscription",
          reason: `${s.tool} usage very low`,
          confidence: "85%",
          impact: loss,
        });

        totalSavings += loss;
      }
    });

    // Vendor Pricing
    vendors.forEach((v) => {
      const current = Number(v.current || 0);
      const market = Number(v.market || 0);

      if (current > market) {
        const diff = current - market;

        issues.push({
          issue: "Overpriced Vendor",
          reason: `${v.name} higher than market`,
          confidence: "88%",
          impact: diff,
        });

        totalSavings += diff;
      }
    });

    // SLA
    sla.forEach((s) => {
      if (s.status === "Delayed") {
        const penalty = Number(s.penalty || 0);

        issues.push({
          issue: "SLA Delay",
          reason: `${s.process} delayed`,
          confidence: "80%",
          impact: penalty,
        });

        totalSavings += penalty;
      }
    });

    if (issues.length === 0) {
      issues.push({
        issue: "No Issues",
        reason: "System operating efficiently",
        confidence: "95%",
        impact: 0,
      });
    }

    setResults(issues);
    setSavings(totalSavings);
  };

  // ---------- EXECUTE ----------
  const execute = (item) => {
    setSavings((prev) => prev + item.impact);
    setExecuted((prev) => [...prev, item]);
    alert("Action Executed Successfully");
  };

  // ---------- CHATBOT ----------
  const askAI = () => {
    if (results.length === 0) {
      alert("No data analyzed yet");
      return;
    }

    let biggest = results.reduce((a, b) =>
      a.impact > b.impact ? a : b
    );

    alert(
      `Biggest issue: ${biggest.issue}\nPotential saving: ₹${biggest.impact}`
    );
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>SmartCost AI</h1>
      <p><b>"This system doesn’t just analyze — it acts."</b></p>

      {/* ---------- INPUT ---------- */}
      <h2>Transactions</h2>
      <button
        onClick={() =>
          setTransactions([...transactions, { vendor: "", amount: "" }])
        }
      >
        Add Row
      </button>

      {transactions.map((t, i) => (
        <div key={i}>
          <input
            placeholder="Vendor"
            onChange={(e) => {
              let copy = [...transactions];
              copy[i].vendor = e.target.value;
              setTransactions(copy);
            }}
          />
          <input
            placeholder="Amount"
            onChange={(e) => {
              let copy = [...transactions];
              copy[i].amount = e.target.value;
              setTransactions(copy);
            }}
          />
        </div>
      ))}

      <h2>Subscriptions</h2>
      <button
        onClick={() =>
          setSubscriptions([
            ...subscriptions,
            { tool: "", allocated: "", active: "" },
          ])
        }
      >
        Add Row
      </button>

      {subscriptions.map((s, i) => (
        <div key={i}>
          <input placeholder="Tool"
            onChange={(e)=>{
              let c=[...subscriptions]; c[i].tool=e.target.value; setSubscriptions(c);
            }}
          />
          <input placeholder="Allocated"
            onChange={(e)=>{
              let c=[...subscriptions]; c[i].allocated=e.target.value; setSubscriptions(c);
            }}
          />
          <input placeholder="Active"
            onChange={(e)=>{
              let c=[...subscriptions]; c[i].active=e.target.value; setSubscriptions(c);
            }}
          />
        </div>
      ))}

      <h2>Vendors</h2>
      <button
        onClick={() =>
          setVendors([...vendors, { name: "", current: "", market: "" }])
        }
      >
        Add Row
      </button>

      {vendors.map((v, i) => (
        <div key={i}>
          <input placeholder="Vendor"
            onChange={(e)=>{
              let c=[...vendors]; c[i].name=e.target.value; setVendors(c);
            }}
          />
          <input placeholder="Current Price"
            onChange={(e)=>{
              let c=[...vendors]; c[i].current=e.target.value; setVendors(c);
            }}
          />
          <input placeholder="Market Price"
            onChange={(e)=>{
              let c=[...vendors]; c[i].market=e.target.value; setVendors(c);
            }}
          />
        </div>
      ))}

      <h2>SLA</h2>
      <button
        onClick={() =>
          setSla([...sla, { process: "", status: "", penalty: "" }])
        }
      >
        Add Row
      </button>

      {sla.map((s, i) => (
        <div key={i}>
          <input placeholder="Process"
            onChange={(e)=>{
              let c=[...sla]; c[i].process=e.target.value; setSla(c);
            }}
          />
          <select
            onChange={(e)=>{
              let c=[...sla]; c[i].status=e.target.value; setSla(c);
            }}
          >
            <option>On Time</option>
            <option>Delayed</option>
          </select>
          <input placeholder="Penalty"
            onChange={(e)=>{
              let c=[...sla]; c[i].penalty=e.target.value; setSla(c);
            }}
          />
        </div>
      ))}

      <br />
      <button onClick={analyze}>Analyze with AI</button>

      {/* ---------- DASHBOARD ---------- */}
      <h2>Dashboard</h2>
      <p>₹ Saved: {savings}</p>
      <p>Alerts: {results.length}</p>

      {/* ---------- INSIGHTS ---------- */}
      <h2>Insights</h2>
      {results.map((r, i) => (
        <div key={i} style={{ border: "1px solid black", margin: 5, padding: 5 }}>
          <b>{r.issue}</b>
          <p>{r.reason}</p>
          <p>Confidence: {r.confidence}</p>
          <p>Impact: ₹{r.impact}</p>

          <button onClick={() => execute(r)}>Approve & Execute</button>
        </div>
      ))}

      {/* ---------- EXECUTED ---------- */}
      <h2>Executed Actions</h2>
      {executed.map((e, i) => (
        <div key={i}>
          {e.issue} → ₹{e.impact}
        </div>
      ))}

      {/* ---------- CHATBOT ---------- */}
      <button
        onClick={askAI}
        style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          padding: 10,
        }}
      >
        AI Chat
      </button>
    </div>
  );
}