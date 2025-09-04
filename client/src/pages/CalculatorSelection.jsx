import { useState } from 'react'
import CalculatorCard from '../components/calculators/CalculatorCard'
import CalculatorModal from '../components/calculators/CalculatorModal'
import calculatorsData from '../data/calculatorsV2.json'

export default function CalculatorSelection() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCalculator, setSelectedCalculator] = useState(null)

  const handleStartCalculator = (calculatorId) => {
    const calculator = calculatorsData.calculators.find(c => c.id === calculatorId)
    setSelectedCalculator(calculator)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCalculator(null)
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Portfolio Calculators
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Choose a calculator to analyze your financial portfolio and get personalized insights.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {calculatorsData.calculators.map((calculator) => (
          <CalculatorCard
            key={calculator.id}
            id={calculator.id}
            name={calculator.name}
            description={calculator.description}
            onStart={handleStartCalculator}
          />
        ))}
      </div>

      {selectedCalculator && (
        <CalculatorModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          calculator={selectedCalculator}
        />
      )}
    </div>
  )
}
