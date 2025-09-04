import { useForm } from 'react-hook-form'
import * as Dialog from '@radix-ui/react-dialog'
import { useState } from 'react'
import { useUser } from '../../context/UserContext'
import { 
  calculateLifeline, 
  calculateSalarySaving, 
  calculateSWP, 
  calculateCashSurplus, 
  calculate70YearProjection, 
  calculateCorpusNeeded 
} from '../../utils/calculators';

export default function CalculatorModal({ isOpen, onClose, calculator }) {
  const [showResults, setShowResults] = useState(false)
  const [formData, setFormData] = useState(null)
  const [calculationResults, setCalculationResults] = useState(null)
  const { basicInfo } = useUser()
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const onSubmit = (data) => {
    console.log(`Submitting for ${calculator.name}:`, data)
    console.log('basicInfo in onSubmit:', basicInfo) // Debug log
    setFormData(data)
    
    // Call appropriate calculator function based on calculator.id
    let results = null;
    
    try {
      switch (calculator.id) {
        case 'lifeline':
          const currentAge = parseInt(basicInfo?.age) || 0;
          console.log('Using currentAge:', currentAge); // Debug log
          results = calculateLifeline({
            currentAge: currentAge,
            retirementAge: data.retirementAge,
            monthlyExpenseNow: data.currentMonthlyExpense
          });
          break;
          
        case 'salarySaving':
          results = calculateSalarySaving({
            rate: data.rate / 100, // Convert percentage to decimal
            nominal: data.nominal / 100,
            monthlySalary: data.monthlySalary,
            savingsRate: data.savingsRate / 100,
            salaryGrowth: data.salaryGrowth / 100,
            calculateUptoAge: data.calculateUptoAge,
            currentAge: parseInt(basicInfo?.age) || 0
          });
          break;
          
        case 'swp':
          results = calculateSWP({
            investmentAmount: data.investmentAmount,
            returnRate: data.returnRate / 100,
            withdrawal: data.withdrawalAmount,
            expectedRate: data.expectedRate / 100
          });
          break;
          
        case 'cashSurplus':
          // For cash surplus, we need to handle the expense categories
          // This would need to be implemented based on your form structure
          results = calculateCashSurplus({
            cashIn: data.cashIn,
            expensesByCategory: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] // Placeholder - implement based on your form
          });
          break;
          
        case 'projection70':
          results = calculate70YearProjection({
            lumpsumInvestment: data.lumpsum,
            ror: data.ror / 100,
            nominalRate: data.nominalRate / 100,
            monthlyInvestment: data.monthlyInvestment,
            startYear: data.startYear,
            endYear: data.endYear
          });
          break;
          
        case 'corpusNeeded':
          results = calculateCorpusNeeded({
            currentWealth: data.currentWealth,
            ror: data.ror / 100,
            nominalRate: data.nominalRate / 100,
            activeSIP: data.activeSIP,
            years: data.years,
            targetWealth: data.targetWealth
          });
          break;
          
        default:
          console.warn(`Unknown calculator ID: ${calculator.id}`);
          results = null;
      }
      
      setCalculationResults(results);
      setShowResults(true);
      
    } catch (error) {
      console.error('Calculation error:', error);
      // You might want to show an error message to the user here
      setCalculationResults(null);
      setShowResults(true);
    }
  }

  const handleClose = () => {
    setShowResults(false)
    setFormData(null)
    setCalculationResults(null)
    reset()
    onClose()
  }

  const renderInputField = (field) => {
    const inputProps = {
      id: field.id,
      type: field.type === 'currency' || field.type === 'percent' ? 'number' : field.type,
      placeholder: field.placeholder || `Enter ${field.label}`,
      ...register(field.id, { 
        required: `${field.label} is required`,
        valueAsNumber: field.type !== 'text',
        min: field.type === 'number' ? 0 : undefined,
        max: field.type === 'percent' ? 100 : undefined
      }),
      className: `input-field mt-1 ${errors[field.id] ? 'border-red-500' : ''}`,
      step: field.type === 'percent' ? '0.01' : field.type === 'currency' ? '0.01' : 'any'
    }

    return (
      <div key={field.id}>
        <label htmlFor={field.id} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {field.label} {field.unit && <span className="text-xs text-gray-500">({field.unit})</span>}
        </label>
        <input {...inputProps} />
        {errors[field.id] && (
          <p className="text-red-500 text-xs mt-1">{errors[field.id].message}</p>
        )}
      </div>
    )
  }

  const renderPortfolioHeader = () => {
    console.log('basicInfo in renderPortfolioHeader:', basicInfo); // Debug log
    
    if (!basicInfo || Object.keys(basicInfo).length === 0 || !basicInfo.name) {
      return (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-6 border border-yellow-200 dark:border-yellow-800">
          <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">⚠️ Portfolio Information Missing</h3>
          <p className="text-yellow-700 dark:text-yellow-600 text-sm">
            Please complete your basic information first. The calculator will use default values.
          </p>
        </div>
      );
    }
    
    return (
      <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Portfolio Information</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="font-medium text-gray-600 dark:text-gray-400">Name:</span>
            <span className="ml-2 text-gray-900 dark:text-white">{basicInfo.name || 'Not provided'}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600 dark:text-gray-400">Occupation:</span>
            <span className="ml-2 text-gray-900 dark:text-white">{basicInfo.occupation || 'Not provided'}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600 dark:text-gray-400">Age:</span>
            <span className="ml-2 text-gray-900 dark:text-white">{basicInfo.age || 'Not provided'}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600 dark:text-gray-400">Gender:</span>
            <span className="ml-2 text-gray-900 dark:text-white">{basicInfo.gender || 'Not provided'}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600 dark:text-gray-400">Marital Status:</span>
            <span className="ml-2 text-gray-900 dark:text-white">{basicInfo.maritalStatus || 'Not provided'}</span>
          </div>
          <div>
            <span className="font-medium text-gray-600 dark:text-gray-400">Dependants:</span>
            <span className="ml-2 text-gray-900 dark:text-white">{basicInfo.dependants || 'Not provided'}</span>
          </div>
        </div>
      </div>
    )
  }



  const renderResults = () => {
    if (!formData || !calculationResults) return null

    // If there was an error in calculation, show error message
    if (calculationResults === null) {
      return (
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-red-600 dark:text-red-400">Calculation Error</h4>
          <p className="text-gray-600 dark:text-gray-400">There was an error processing your calculation. Please check your inputs and try again.</p>
        </div>
      )
    }

    const { cards, tables, notes } = calculationResults

    return (
      <div className="space-y-6">
        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Results</h4>
        
        {/* Cards Section */}
        {cards && cards.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cards.map((card, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                <h5 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{card.title}</h5>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {typeof card.value === 'number' ? 
                    (card.title.toLowerCase().includes('age') || 
                     card.title.toLowerCase().includes('years') || 
                     card.title.toLowerCase().includes('month') ||
                     card.title.toLowerCase().includes('dependants') ||
                     card.title.toLowerCase().includes('retirement') ? 
                      card.value.toLocaleString('en-IN') : // Plain number for age/years
                      card.value.toLocaleString('en-IN', { // Currency for monetary values
                        style: 'currency', 
                        currency: 'INR',
                        minimumFractionDigits: 2 
                      })
                    ) : 
                    card.value
                  }
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Tables Section */}
        {tables && tables.map((table, tableIndex) => (
          <div key={tableIndex} className="space-y-3">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {table.headers.map((header, index) => (
                      <th key={index} className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider border-b border-gray-200 dark:border-gray-600">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {table.rows.map((row, rowIndex) => (
                    <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      {table.headers.map((header, colIndex) => {
                        const cellValue = row[header];
                        
                        // Check if this column should be formatted as currency
                        const isCurrencyColumn = header.toLowerCase().includes('expense') || 
                                               header.toLowerCase().includes('salary') || 
                                               header.toLowerCase().includes('needs') || 
                                               header.toLowerCase().includes('wants') || 
                                               header.toLowerCase().includes('savings') || 
                                               header.toLowerCase().includes('corpus') || 
                                               header.toLowerCase().includes('wealth') || 
                                               header.toLowerCase().includes('investment') || 
                                               header.toLowerCase().includes('withdrawal') || 
                                               header.toLowerCase().includes('amount') ||
                                               header.toLowerCase().includes('emi') ||
                                               header.toLowerCase().includes('premium') ||
                                               header.toLowerCase().includes('rent') ||
                                               header.toLowerCase().includes('bills') ||
                                               header.toLowerCase().includes('fees') ||
                                               header.toLowerCase().includes('maintenance') ||
                                               header.toLowerCase().includes('cash') ||
                                               header.toLowerCase().includes('lumpsum') ||
                                               header.toLowerCase().includes('sip');
                        
                        // Check if this column should be formatted as plain number (no formatting)
                        const isPlainNumberColumn = header.toLowerCase() === 'year' || 
                                                   header.toLowerCase() === 'age' || 
                                                   header.toLowerCase() === 'month' || 
                                                   header.toLowerCase() === 'years' ||
                                                   header.toLowerCase() === 'months';
                        
                        return (
                          <td key={colIndex} className="px-4 py-3 text-sm text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">
                            {typeof cellValue === 'number' ? 
                              (isCurrencyColumn ? 
                                cellValue.toLocaleString('en-IN', { 
                                  style: 'currency', 
                                  currency: 'INR',
                                  minimumFractionDigits: 2 
                                }) : 
                                (isPlainNumberColumn ? 
                                  cellValue.toString() : // Plain number with no formatting
                                  cellValue.toLocaleString('en-IN') // Number with commas for thousands
                                )
                              ) : 
                              cellValue
                            }
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}

        {/* Notes Section */}
        {notes && notes.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h5 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-2">Notes:</h5>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
              {notes.map((note, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  {note}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    )
  }



  if (!calculator) return null

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 z-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg z-50 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <Dialog.Title className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            {calculator.name}
          </Dialog.Title>

          {!showResults ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {calculator.modalInputs && calculator.modalInputs.map(field => renderInputField(field))}
              
              <div className="flex justify-end space-x-2 mt-6">
                <button type="button" onClick={handleClose} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Calculate
                </button>
              </div>
            </form>
          ) : (
            <div>
              {renderPortfolioHeader()}
              {renderResults()}
              
              <div className="flex justify-end space-x-2 mt-6">
                <button onClick={handleClose} className="btn-primary">
                  Close
                </button>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
