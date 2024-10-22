const taxRate = .25

type Sale = { readonly total: number }
type TaxReport = { readonly tax: number }
type TaxReceipt = {}

async function readDailySales(date: Date): Promise<Sale[]> {
  const res: Response = await fetch("http://example.com/sales?date=" + date.toString())
  return res.json()
}

async function reportTaxes(taxes: TaxReport[]): Promise<TaxReceipt> {
  const res: Response = await fetch("http://irs.gov/taxes", {method: 'POST', body: JSON.stringify(taxes) })
  return res.json()
}

async function reportDailyTaxes(date: Date): Promise<TaxReceipt> {
  let sales = await readDailySales(date)
  let taxes = sales.map(({total}) => ({tax: taxRate * total}))
  return reportTaxes(taxes)
}

// Sandwich model:
function taxCalc(sales: Sale[]): TaxReport[] {
    return sales.map(({total}) => ({tax: taxRate * total}))
}

async function reportDailyTaxesSandwich(date: Date): Promise<TaxReceipt> {
  let sales = await readDailySales(date)
  let taxes = taxCalc(sales)
  return reportTaxes(taxes)
}

type Reader = (_: Date) => Promise<Sale[]>

type Writer = (_: TaxReport[]) => Promise<TaxReceipt>

// Dependency injection
const reportDailyTaxesDI = (read: Reader, report: Writer) =>async (date: Date) => {
  let sales = await read(date)
  let taxes = taxCalc(sales)
  return report(taxes)
}

const AlternativeReportDailyTaxesDI = (read: Reader, report: Writer) =>async (date: Date) => 
  read(date)
  .then(taxCalc)
  .then(report)

const reportDailyTaxesPlugged = reportDailyTaxesDI(readDailySales, reportTaxes)

// Report taxes for today:
reportDailyTaxesPlugged(new Date())
