/**
 * Investment Calculator Functions
 * Production-ready JavaScript implementation of financial formulas
 * All functions return structured objects for React UI rendering and PDF export
 */

/**
 * 1️⃣ Lifeline Calculator
 * Calculates future expenses and corpus requirements based on inflation and return assumptions
 */
export function calculateLifeline({ currentAge, retirementAge, monthlyExpenseNow }) {
  const inflationRate = 0.07;
  const returnRate = 0.06;

  // Build age slots starting from current age, incrementing by 10, stopping at retirement age
  const ageSlots = [];
  let currentAgeSlot = currentAge;
  while (currentAgeSlot <= retirementAge) {
    ageSlots.push(currentAgeSlot);
    currentAgeSlot += 10;
  }

  // Calculate future monthly expenses for each age slot
  const tableRows = ageSlots.map(age => {
    const yearsToThisAge = age - currentAge;
    const futureExpense = monthlyExpenseNow * Math.pow(1 + inflationRate, yearsToThisAge);
    return {
      Age: age,
      "Future Monthly Expense (₹)": futureExpense.toFixed(2),
    };
  });

  // Find future expense at retirement age
  const yearsToRetirement = retirementAge - currentAge;
  const futureExpenseAtRetirement = monthlyExpenseNow * Math.pow(1 + inflationRate, yearsToRetirement);

  // Calculate future corpus required using the correct formula
  const futureCorpusRequired = futureExpenseAtRetirement * 12 * (1 / returnRate);

  return {
    cards: [
      { title: "Desired Age of Retirement", value: retirementAge },
      { title: "Future Monthly Expense*", value: futureExpenseAtRetirement.toFixed(2) },
      { title: "Future Corpus Required**", value: futureCorpusRequired.toFixed(2) },
    ],
    tables: [
      { headers: ["Age", "Future Monthly Expense (₹)"], rows: tableRows },
    ],
    notes: [
      "* Future Monthly Expense calculated with 7% inflation",
      "** Future Corpus based on 6% annual return"
    ],
  };
}

/**
 * 2️⃣ Salary Saving Calculator
 * Projects salary growth and calculates needs, wants, and savings over time
 */
export function calculateSalarySaving({ 
  rate, 
  nominal, 
  monthlySalary, 
  savingsRate, 
  salaryGrowth, 
  calculateUptoAge, 
  currentAge 
}) {
  const tableRows = [];
  let totalNeeds = 0;
  let totalWants = 0;
  let totalSavings = 0;

  // Calculate for each year from current age to target age
  for (let year = 0; year <= calculateUptoAge - currentAge; year++) {
    const age = currentAge + year;
    
    // Annual salary with growth
    const annualSalary = monthlySalary * 12 * Math.pow(1 + salaryGrowth, year);
    
    // 50-30-20 rule: 50% needs, 30% wants, 20% savings
    const needs = annualSalary * 0.50;
    const wants = annualSalary * 0.30;
    const savings = annualSalary * savingsRate;
    
    // Calculate saving corpus (compounded savings)
    const savingCorpus = savings * (Math.pow(1 + rate, year + 1) - 1) / rate;
    
    tableRows.push({
      Age: age,
      "Monthly Salary (₹)": (annualSalary / 12).toFixed(2),
      "Annual Salary (₹)": annualSalary.toFixed(2),
      "Needs (₹)": needs.toFixed(2),
      "Wants (₹)": wants.toFixed(2),
      "Savings (₹)": savings.toFixed(2),
      "Saving Corpus (₹)": savingCorpus.toFixed(2),
    });

    totalNeeds += needs;
    totalWants += wants;
    totalSavings += savings;
  }

  // Add totals row
  tableRows.push({
    Age: "TOTAL",
    "Monthly Salary (₹)": "",
    "Annual Salary (₹)": "",
    "Needs (₹)": totalNeeds.toFixed(2),
    "Wants (₹)": totalWants.toFixed(2),
    "Savings (₹)": totalSavings.toFixed(2),
    "Saving Corpus (₹)": "",
  });

  return {
    cards: [
      { title: "Current Monthly Salary", value: monthlySalary.toFixed(2) },
      { title: "Salary Growth Rate", value: (salaryGrowth * 100).toFixed(1) + "%" },
      { title: "Savings Rate", value: (savingsRate * 100).toFixed(1) + "%" },
    ],
    tables: [
      { 
        headers: ["Age", "Monthly Salary (₹)", "Annual Salary (₹)", "Needs (₹)", "Wants (₹)", "Savings (₹)", "Saving Corpus (₹)"], 
        rows: tableRows 
      },
    ],
    notes: [
      "Needs: 50% of salary, Wants: 30% of salary, Savings: Based on savings rate",
      "Saving Corpus: Compounded savings at specified return rate"
    ],
  };
}

/**
 * 3️⃣ SWP (Systematic Withdrawal Plan) Calculator
 * Calculates withdrawal scenarios and month-wise balance tracking
 */
export function calculateSWP({ investmentAmount, returnRate, withdrawal, expectedRate }) {
  // Table 1: Total Withdrawal vs Net Worth for different time periods
  const timePeriods = [5, 10, 15, 20];
  const table1Rows = timePeriods.map(years => {
    const totalWithdrawal = withdrawal * 12 * years;
    const monthlyReturn = returnRate / 12;
    const months = years * 12;
    
    // Calculate net worth after withdrawals
    let balance = investmentAmount;
    for (let month = 1; month <= months; month++) {
      const interest = balance * monthlyReturn;
      balance = balance + interest - withdrawal;
    }
    
    return {
      "Years": years,
      "Total Withdrawal (₹)": totalWithdrawal.toFixed(2),
      "Net Worth (₹)": Math.max(0, balance).toFixed(2),
    };
  });

  // Table 2: Month-wise tracking for 240 months (20 years)
  const table2Rows = [];
  let balance = investmentAmount;
  
  for (let month = 1; month <= 240; month++) {
    const interest = balance * (returnRate / 12);
    const monthlyAmount = withdrawal;
    balance = balance + interest - withdrawal;
    
    if (month <= 60 || month % 12 === 0) { // Show first 5 years + yearly milestones
      table2Rows.push({
        "Month": month,
        "Monthly Amount (₹)": monthlyAmount.toFixed(2),
        "Interest (₹)": interest.toFixed(2),
        "Net Worth (₹)": Math.max(0, balance).toFixed(2),
      });
    }
  }

  return {
    cards: [
      { title: "Initial Investment", value: investmentAmount.toFixed(2) },
      { title: "Monthly Withdrawal", value: withdrawal.toFixed(2) },
      { title: "Expected Return Rate", value: (returnRate * 100).toFixed(1) + "%" },
    ],
    tables: [
      { 
        headers: ["Years", "Total Withdrawal (₹)", "Net Worth (₹)"], 
        rows: table1Rows 
      },
      { 
        headers: ["Month", "Monthly Amount (₹)", "Interest (₹)", "Net Worth (₹)"], 
        rows: table2Rows 
      },
    ],
    notes: [
      "Table 1: Shows withdrawal scenarios for different time periods",
      "Table 2: Month-wise tracking (showing first 5 years + yearly milestones)",
      "Net Worth calculated with monthly compounding and withdrawals"
    ],
  };
}

/**
 * 4️⃣ Cash Surplus Tracker
 * Analyzes cash flow and categorizes expenses
 */
export function calculateCashSurplus({ cashIn, expensesByCategory }) {
  // Calculate total expenses
  const totalExpenses = expensesByCategory.reduce((sum, expense) => sum + expense, 0);
  
  // Calculate cash surplus
  const cashSurplus = cashIn - totalExpenses;
  
  // Extract specific categories (assuming array indices 0-14 for 15 categories)
  const monthlyInsurance = expensesByCategory[0] || 0;
  const monthlySavings = expensesByCategory[1] || 0;
  const monthlyLoanEMI = expensesByCategory[2] || 0;
  
  // Sum of other expenses (categories 4-15, indices 3-14)
  const monthlyExpense = expensesByCategory.slice(3).reduce((sum, expense) => sum + expense, 0);
  
  // Determine remarks based on cash surplus
  let remarks = "";
  if (cashSurplus > 0) {
    remarks = "Positive cash flow - Good financial health";
  } else if (cashSurplus === 0) {
    remarks = "Break-even cash flow - Monitor expenses";
  } else {
    remarks = "Negative cash flow - Review spending patterns";
  }

  return {
    cards: [
      { title: "Cash In (₹)", value: cashIn.toFixed(2) },
      { title: "Cash Out (₹)", value: totalExpenses.toFixed(2) },
      { title: "Cash Surplus (₹)", value: cashSurplus.toFixed(2) },
    ],
    tables: [
      {
        headers: ["Category", "Amount (₹)"],
        rows: [
          { "Category": "Insurance", "Amount (₹)": monthlyInsurance.toFixed(2) },
          { "Category": "Savings", "Amount (₹)": monthlySavings.toFixed(2) },
          { "Category": "Loan EMI", "Amount (₹)": monthlyLoanEMI.toFixed(2) },
          { "Category": "Other Expenses", "Amount (₹)": monthlyExpense.toFixed(2) },
          { "Category": "TOTAL", "Amount (₹)": totalExpenses.toFixed(2) },
        ]
      }
    ],
    notes: [
      `Remarks: ${remarks}`,
      `Insurance: ${monthlyInsurance.toFixed(2)}, Savings: ${monthlySavings.toFixed(2)}`,
      `Loan EMI: ${monthlyLoanEMI.toFixed(2)}, Monthly Expense: ${monthlyExpense.toFixed(2)}`
    ],
  };
}

/**
 * 5️⃣ 70-Year Projection Calculator
 * Projects wealth accumulation over 70 years with SIP and lumpsum investments
 */
export function calculate70YearProjection({ 
  lumpsumInvestment, 
  ror, 
  nominalRate, 
  monthlyInvestment, 
  startYear, 
  endYear 
}) {
  const tableRows = [];
  let corpus = lumpsumInvestment;
  let totalInvestment = lumpsumInvestment;
  
  // Calculate for 70 years
  for (let year = 0; year <= 70; year++) {
    const currentYear = startYear + year;
    const sipValue = monthlyInvestment * 12;
    
    // Add SIP to total investment
    totalInvestment += sipValue;
    
    // Calculate corpus growth
    corpus = corpus * (1 + ror) + sipValue;
    
    // Show results for key years (first 10, then every 10th year, last 10)
    if (year <= 10 || year % 10 === 0 || year >= 60) {
      tableRows.push({
        "Year": currentYear,
        "SIP Amount (₹)": sipValue.toFixed(2),
        "Total Investment (₹)": totalInvestment.toFixed(2),
        "Withdrawal (₹)": "0.00", // No withdrawals in this calculator
        "SIP Value (₹)": sipValue.toFixed(2),
        "Net Wealth (₹)": corpus.toFixed(2),
      });
    }
  }

  return {
    cards: [
      { title: "Initial Lumpsum", value: lumpsumInvestment.toFixed(2) },
      { title: "Monthly SIP", value: monthlyInvestment.toFixed(2) },
      { title: "Return Rate", value: (ror * 100).toFixed(1) + "%" },
      { title: "Final Wealth (70 years)", value: corpus.toFixed(2) },
    ],
    tables: [
      {
        headers: ["Year", "SIP Amount (₹)", "Total Investment (₹)", "Withdrawal (₹)", "SIP Value (₹)", "Net Wealth (₹)"],
        rows: tableRows
      }
    ],
    notes: [
      "Projection covers 70 years from start year",
      "Shows key milestone years for readability",
      "Assumes no withdrawals during accumulation phase"
    ],
  };
}

/**
 * 6️⃣ Corpus Needed Calculator
 * Calculates deficit and provides multiple investment strategies
 */
export function calculateCorpusNeeded({ 
  currentWealth, 
  ror, 
  nominalRate, 
  activeSIP, 
  years, 
  targetWealth 
}) {
  // Calculate future wealth from current investments
  const futureWealthFromCurrent = currentWealth * Math.pow(1 + ror, years);
  
  // Calculate future wealth from active SIP
  const futureWealthFromSIP = activeSIP * ((Math.pow(1 + ror, years) - 1) / ror) * (1 + ror);
  
  // Total future wealth
  const totalFutureWealth = futureWealthFromCurrent + futureWealthFromSIP;
  
  // Calculate deficit
  const deficit = targetWealth - totalFutureWealth;
  
  // Calculate different investment strategies
  const option1 = deficit; // 100% lumpsum
  const option2 = deficit / ((Math.pow(1 + ror, years) - 1) / ror); // 100% SIP
  const option3Lumpsum = deficit * 0.5; // 50% lumpsum
  const option3SIP = (deficit * 0.5) / ((Math.pow(1 + ror, years) - 1) / ror); // 50% SIP
  const option4Lumpsum = deficit * 0.6; // 60% lumpsum
  const option4SIP = (deficit * 0.4) / ((Math.pow(1 + ror, years) - 1) / ror); // 40% SIP

  const tableRows = [
    {
      "Option": "Option 1: 100% Lumpsum",
      "Lumpsum (₹)": option1.toFixed(2),
      "Monthly SIP (₹)": "0.00",
      "Total Investment (₹)": option1.toFixed(2),
    },
    {
      "Option": "Option 2: 100% SIP",
      "Lumpsum (₹)": "0.00",
      "Monthly SIP (₹)": option2.toFixed(2),
      "Total Investment (₹)": (option2 * 12 * years).toFixed(2),
    },
    {
      "Option": "Option 3: 50% SIP + 50% Lumpsum",
      "Lumpsum (₹)": option3Lumpsum.toFixed(2),
      "Monthly SIP (₹)": option3SIP.toFixed(2),
      "Total Investment (₹)": (option3Lumpsum + option3SIP * 12 * years).toFixed(2),
    },
    {
      "Option": "Option 4: 40% SIP + 60% Lumpsum",
      "Lumpsum (₹)": option4Lumpsum.toFixed(2),
      "Monthly SIP (₹)": option4SIP.toFixed(2),
      "Total Investment (₹)": (option4Lumpsum + option4SIP * 12 * years).toFixed(2),
    },
  ];

  return {
    cards: [
      { title: "Current Wealth", value: currentWealth.toFixed(2) },
      { title: "Target Wealth", value: targetWealth.toFixed(2) },
      { title: "Future Wealth (Current + SIP)", value: totalFutureWealth.toFixed(2) },
      { title: "Deficit", value: deficit.toFixed(2) },
    ],
    tables: [
      {
        headers: ["Option", "Lumpsum (₹)", "Monthly SIP (₹)", "Total Investment (₹)"],
        rows: tableRows
      }
    ],
    notes: [
      "Future Wealth calculated with compound interest over specified years",
      "SIP amounts are monthly contributions needed to bridge the deficit",
      "Choose option based on your liquidity preference and investment style"
    ],
  };
}

// Test function for Lifeline Calculator
export function testLifelineCalculator() {
  console.log('🧪 Testing Lifeline Calculator...');
  
  const testCase = {
    currentAge: 32,
    retirementAge: 62,
    monthlyExpenseNow: 39500
  };
  
  console.log('Test Input:', testCase);
  
  const results = calculateLifeline(testCase);
  
  console.log('Test Results:', results);
  
  // Verify age sequence
  const expectedAges = [32, 42, 52, 62];
  const actualAges = results.tables[0].rows.map(row => row.Age);
  console.log('Expected Ages:', expectedAges);
  console.log('Actual Ages:', actualAges);
  console.log('Age Sequence Correct:', JSON.stringify(expectedAges) === JSON.stringify(actualAges));
  
  // Verify calculations
  console.log('Future Monthly Expense at Retirement:', results.cards[1].value);
  console.log('Future Corpus Required:', results.cards[2].value);
  
  return results;
}
